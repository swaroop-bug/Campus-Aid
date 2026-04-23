// const express = require('express');
// const authMiddleware = require('../middleware/auth');
// const quizController = require('../controllers/quizController');

// const router = express.Router();

// router.get('/:year', authMiddleware, quizController.getQuiz);
// router.post('/submit', authMiddleware, quizController.submitQuiz);
// router.get('/scores/my', authMiddleware, quizController.getScores);

// module.exports = router;

const express = require('express');
const authMiddleware = require('../middleware/auth');
const quizController = require('../controllers/quizController');

const router = express.Router();

// subjects endpoint no longer needs year
router.get('/subjects', authMiddleware, quizController.getSubjects);
router.get('/:subject', authMiddleware, quizController.getQuiz);
router.post('/submit', authMiddleware, quizController.submitQuiz);
router.get('/scores/my', authMiddleware, quizController.getScores);

module.exports = router;