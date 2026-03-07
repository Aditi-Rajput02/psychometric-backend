const mongoose = require('mongoose');

const careerClusterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  color: { type: String }, 
  careerRoles: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    requiredSubjects: [{ type: String }],
    courses: [{
      name: { type: String, required: true },
      duration: { type: String },
      institutions: [{ type: String }]
    }],
    skills: [{ type: String }],
    salaryRange: {
      entry: { type: Number },
      mid: { type: Number },
      senior: { type: Number }
    },
    growth: { type: String }, 
    workEnvironment: { type: String }
  }],
  matchingCriteria: {
    interest: { type: Number, min: 0, max: 100 },
    aptitude: { type: Number, min: 0, max: 100 },
    personality: { type: Number, min: 0, max: 100 },
    values: { type: Number, min: 0, max: 100 },
    academicStrength: { type: Number, min: 0, max: 100 },
    futureScope: { type: Number, min: 0, max: 100 }
  }
}, { timestamps: true });

module.exports = mongoose.model('CareerCluster', careerClusterSchema);