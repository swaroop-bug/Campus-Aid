const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  // year removed, quizzes exist globally across semesters
  questions: [{
    question: String,
    options: [String],
    correct: Number
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  totalQuestions: Number,
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);