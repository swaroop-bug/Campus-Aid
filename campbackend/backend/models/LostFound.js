const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: String,
  location: String,
  contactEmail: String,
  contactPhone: String,
  image: String,
  status: { type: String, enum: ['active', 'forgotten'], default: 'active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostFound', lostFoundSchema);