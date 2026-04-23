const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// All admin routes require authentication and admin role
router.use(auth);
router.use(requireAdmin);

// Student management routes
router.get('/students', adminController.getAllStudents);
router.get('/students/:id', adminController.getStudentById);
router.post('/students', adminController.createStudent);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

module.exports = router;