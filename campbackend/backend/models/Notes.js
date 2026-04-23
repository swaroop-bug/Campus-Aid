const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  // year removed for MSC-only application
  description: String,
  filePath: { type: String, required: true },
  fileName: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notes', notesSchema);