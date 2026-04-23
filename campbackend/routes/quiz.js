const express = require('express');
const authMiddleware = require('../middleware/auth');
const quizController = require('../controllers/quizController');

const router = express.Router();

router.get('/subjects', authMiddleware, quizController.getSubjects);
router.get('/scores/my', authMiddleware, quizController.getScores);
router.get('/:subject', authMiddleware, quizController.getQuiz);
router.post('/submit', authMiddleware, quizController.submitQuiz);

module.exports = router;