const { getDb } = require('../config/firebase');
const fs = require('fs');
const path = require('path');

exports.uploadNotes = async (req, res) => {
  try {
    const { title, subject, description, department } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Admin can specify a target department; students always use their own
    const isAdmin = req.user && req.user.role === 'admin';
    const userDept = isAdmin && department
      ? department
      : (req.user ? (req.user.department || 'CS') : 'CS');

    const db = getDb();
    const noteRef = await db.collection('notes').add({
      title,
      subject,
      description: description || '',
      department: userDept,
      filePath: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      uploadedBy: req.user ? req.user._id : null,
      uploadedByName: req.user ? req.user.name : 'Unknown',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Notes uploaded successfully',
      notes: { _id: noteRef.id, title, subject, description, department: userDept },
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// Return notes — filtered by department for students, all for admin
exports.getNotesByYear = async (req, res) => {
  try {
    const db = getDb();
    const isAdmin = req.user && req.user.role === 'admin';

    const snapshot = await db.collection('notes').orderBy('createdAt', 'desc').get();
    const allNotes = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    if (isAdmin) {
      // Admin sees everything
      return res.json(allNotes);
    }

    // Students ALWAYS see only their own department's notes (server-enforced)
    const studentDept = req.user ? (req.user.department || 'CS') : 'CS';
    const filtered = allNotes.filter(n => !n.department || n.department === studentDept);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
};

exports.deleteNotes = async (req, res) => {
  try {
    const db = getDb();
    const docRef = db.collection('notes').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Notes not found' });
    }

    const noteData = doc.data();

    // Allow delete if:
    // - legacy note without uploadedBy
    // - current user is uploader, OR
    // - current user is admin
    const hasUploader = !!noteData.uploadedBy;
    const isUploader = hasUploader && req.user && noteData.uploadedBy === req.user._id;
    const isAdmin = req.user && req.user.role === 'admin';

    if (hasUploader && !isUploader && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete the file from disk
    if (noteData.filePath) {
      const filePath = path.join(__dirname, '..', noteData.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await docRef.delete();
    res.json({ message: 'Notes deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};
