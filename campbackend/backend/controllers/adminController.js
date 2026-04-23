const User = require('../models/User');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student', error: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'student' },
      { name, email },
      { new: true }
    ).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
};

// Create student (for admin)
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email.toLowerCase().endsWith('@somaiya.edu')) {
      return res.status(400).json({ message: 'Email must be a @somaiya.edu address' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, email, password, role: 'student' });
    await user.save();
    res.status(201).json({ message: 'Student created successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
};