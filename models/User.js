const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  // Student Profile Information
  profile: {
    age: { type: Number },
    grade: { type: String },
    currentStream: { type: String },
    academicPerformance: {
      math: { type: Number, min: 0, max: 100 },
      science: { type: Number, min: 0, max: 100 },
      english: { type: Number, min: 0, max: 100 },
      socialStudies: { type: Number, min: 0, max: 100 },
      languages: { type: Number, min: 0, max: 100 },
      arts: { type: Number, min: 0, max: 100 }
    },
    interests: [{ type: String }],
    extracurricular: [{ type: String }],
    careerGoals: { type: String },
    familyBackground: { type: String }
  },
  assessmentProgress: {
    totalCompleted: { type: Number, default: 0 },
    totalPending: { type: Number, default: 6 },
    completedAssessments: [{ type: String }]
  },
  assessmentScores: {
    interest: { type: mongoose.Schema.Types.Mixed, default: {} },
    aptitude: { type: mongoose.Schema.Types.Mixed, default: {} },
    personality: { type: mongoose.Schema.Types.Mixed, default: {} },
    values: { type: mongoose.Schema.Types.Mixed, default: {} },
    academicStrength: { type: mongoose.Schema.Types.Mixed, default: {} },
    futureScope: { type: mongoose.Schema.Types.Mixed, default: {} }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);