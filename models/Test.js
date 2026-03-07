const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ text: String, value: Number }],
  category: { type: String }
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assessmentType: {
    type: String,
    enum: ['interest', 'aptitude', 'personality', 'values', 'academicStrength', 'futureScope','relationship'],
    required: true
  },
  questions: [questionSchema],
  scoringGuide: {
    type: mongoose.Schema.Types.Mixed, 
    default: {}
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
