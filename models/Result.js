const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  assessmentType: { type: String, enum: ['interest', 'aptitude', 'personality', 'values', 'academicStrength', 'futureScope'] },
  answers: [{ questionId: mongoose.Schema.Types.ObjectId, selected: Number }],
  score: Number,
  categoryScores: { type: mongoose.Schema.Types.Mixed, default: {} }, // For detailed scoring within assessment
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
