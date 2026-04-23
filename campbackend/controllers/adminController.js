const bcrypt = require('bcryptjs');
const { getDb } = require('../config/firebase');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection('users').where('role', '==', 'student').get();
    const students = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data(),
      password: undefined, // exclude password
    }));
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const db = getDb();
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists || doc.data().role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    const data = doc.data();
    res.json({ _id: doc.id, ...data, password: undefined });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student', error: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const db = getDb();
    const docRef = db.collection('users').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    const updateData = { name, email };
    const validDepts = ['CS', 'IT', 'DS', 'MACS'];
    if (department && validDepts.includes(department)) {
      updateData.department = department;
    }
    await docRef.update(updateData);
    const updated = await docRef.get();
    res.json({ _id: updated.id, ...updated.data(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const db = getDb();
    const docRef = db.collection('users').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    await docRef.delete();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
};

// Create student (for admin)
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!email.toLowerCase().endsWith('@somaiya.edu')) {
      return res.status(400).json({ message: 'Email must be a @somaiya.edu address' });
    }
    const validDepts = ['CS', 'IT', 'DS', 'MACS'];
    const dept = validDepts.includes(department) ? department : 'CS';
    const db = getDb();
    const existing = await db.collection('users').where('email', '==', email).get();
    if (!existing.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = await db.collection('users').add({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      department: dept,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({
      message: 'Student created successfully',
      user: { id: userRef.id, name, email, role: 'student', department: dept },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
};

// ─── Announcements ───

// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
    const announcements = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: error.message });
  }
};

// Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const db = getDb();
    const ref = await db.collection('announcements').add({
      title,
      description,
      priority: priority || 'medium',
      createdBy: req.user._id,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ message: 'Announcement created', _id: ref.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement', error: error.message });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const db = getDb();
    await db.collection('announcements').doc(req.params.id).delete();
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete announcement', error: error.message });
  }
};

// ─── Quiz Analytics ───

// Get all quiz results (for analytics)
exports.getQuizAnalytics = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection('quizzes').orderBy('completedAt', 'desc').get();
    const quizzes = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      // Fetch student name
      let studentName = 'Unknown';
      let studentEmail = '';
      if (data.user) {
        const userDoc = await db.collection('users').doc(data.user).get();
        if (userDoc.exists) {
          studentName = userDoc.data().name;
          studentEmail = userDoc.data().email;
        }
      }
      quizzes.push({
        _id: doc.id,
        ...data,
        studentName,
        studentEmail,
      });
    }

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quiz analytics', error: error.message });
  }
};

// Get quiz results for a specific student
exports.getStudentQuizScores = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db
      .collection('quizzes')
      .where('user', '==', req.params.studentId)
      .orderBy('completedAt', 'desc')
      .get();
    const scores = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student scores', error: error.message });
  }
};