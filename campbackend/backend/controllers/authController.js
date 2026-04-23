const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// registration is temporarily enabled for admin creation
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email.toLowerCase().endsWith('@somaiya.edu')) {
      return res.status(400).json({ message: 'Email must be a @somaiya.edu address' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, email, password, role: role || 'student' });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // enforce somaiya.edu domain as per requirement
    if (!email.toLowerCase().endsWith('@somaiya.edu')) {
      return res.status(400).json({ message: 'Email must be a @somaiya.edu address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // const isPasswordValid = await user.comparePassword(password);
    // if (!isPasswordValid) {
    //   return res.status(400).json({ message: 'Invalid password' });
    // }

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};