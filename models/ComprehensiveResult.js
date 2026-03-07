const mongoose = require('mongoose');

const careerRecommendationSchema = new mongoose.Schema({
  careerCluster: { type: mongoose.Schema.Types.ObjectId, ref: 'CareerCluster', required: true },
  careerRole: { type: String, required: true },
  fitPercentage: { type: Number, required: true, min: 0, max: 100 },
  whyMatch: [{ type: String }],
  subjectStream: { type: String },
  recommendedCourses: [{
    name: { type: String },
    duration: { type: String },
    institutions: [{ type: String }]
  }],
  actionPlan: {
    year1: [{ type: String }],
    year2: [{ type: String }],
    year3: [{ type: String }],
    year4: [{ type: String }],
    year5: [{ type: String }]
  },
  skillsToDevelop: [{ type: String }],
  alternateCareers: [{
    career: { type: String },
    fitPercentage: { type: Number, min: 0, max: 100 }
  }]
});

const comprehensiveResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessmentScores: {
    interest: { type: mongoose.Schema.Types.Mixed, default: {} },
    aptitude: { type: mongoose.Schema.Types.Mixed, default: {} },
    personality: { type: mongoose.Schema.Types.Mixed, default: {} },
    values: { type: mongoose.Schema.Types.Mixed, default: {} },
    academicStrength: { type: mongoose.Schema.Types.Mixed, default: {} },
    futureScope: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  careerRecommendations: [careerRecommendationSchema],
  topMatches: [{
    career: { type: String },
    fitPercentage: { type: Number, min: 0, max: 100 }
  }],
  subjectStreamRecommendation: { type: String },
  overallAssessment: {
    strengths: [{ type: String }],
    areasForImprovement: [{ type: String }],
    careerReadiness: { type: Number, min: 0, max: 100 }
  },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ComprehensiveResult', comprehensiveResultSchema);