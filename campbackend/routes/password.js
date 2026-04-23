const express = require('express');
const passwordController = require('../controllers/passwordController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/change', authMiddleware, passwordController.changePassword);
router.post('/forgot', passwordController.forgotPassword);
router.post('/reset', passwordController.resetPassword);

module.exports = router;