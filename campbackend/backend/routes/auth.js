const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// registration endpoint temporarily enabled for admin creation
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;