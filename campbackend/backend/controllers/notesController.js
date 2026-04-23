const Notes = require('../models/Notes');
const fs = require('fs');
const path = require('path');

exports.uploadNotes = async (req, res) => {
  try {
    const { title, subject, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const notes = new Notes({
      title,
      subject,
      description,
      filePath: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      uploadedBy: req.userId
    });

    await notes.save();
    res.status(201).json({ message: 'Notes uploaded successfully', notes });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// return all notes (no year filtering)
exports.getNotesByYear = async (req, res) => {
  try {
    const notes = await Notes.find().populate('uploadedBy', 'name email');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
};

exports.deleteNotes = async (req, res) => {
  try {
    const notes = await Notes.findById(req.params.id);
    
    if (!notes) {
      return res.status(404).json({ message: 'Notes not found' });
    }

    if (notes.uploadedBy.toString() !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const filePath = path.join(__dirname, '..', notes.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Notes.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notes deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

