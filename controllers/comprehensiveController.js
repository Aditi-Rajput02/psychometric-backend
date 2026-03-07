const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Test = require('../models/Test');
const Result = require('../models/Result');
const CareerCluster = require('../models/CareerCluster');
const ComprehensiveResult = require('../models/ComprehensiveResult');

router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const progress = { completed: user.assessmentProgress.totalCompleted,total: 6,completedAssessments: user.assessmentProgress.completedAssessments};
    res.json({ progress, profile: user.profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { profile: req.body }, { new: true });
    res.json(user.profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get assessment by type
router.get('/assessment/:type', auth, async (req, res) => {
  try {
    const test = await Test.findOne({ assessmentType: req.params.type });
    if (!test) return res.status(404).json({ message: 'Assessment not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit assessment result
router.post('/assessment/:type/result', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const test = await Test.findOne({ assessmentType: req.params.type });

    if (!test) return res.status(404).json({ message: 'Assessment not found' });

    // Calculate score
    let totalScore = 0;
    const categoryScores = {};

    answers.forEach(answer => {
      const question = test.questions.id(answer.questionId);
      if (question) {
        totalScore += answer.selected;
        if (question.category) {
          categoryScores[question.category] = (categoryScores[question.category] || 0) + answer.selected;
        }
      }
    });

    // Save result
    const result = new Result({
      user: req.user.id,
      test: test._id,
      assessmentType: req.params.type,
      answers,
      score: totalScore,
      categoryScores
    });
    await result.save();

    // Update user progress
    const user = await User.findById(req.user.id);
    if (!user.assessmentProgress.completedAssessments.includes(req.params.type)) {
      user.assessmentProgress.completedAssessments.push(req.params.type);
      user.assessmentProgress.totalCompleted += 1;
      user.assessmentScores[req.params.type] = categoryScores;
      await user.save();
    }

    res.json({ score: totalScore, categoryScores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate comprehensive career recommendations
router.post('/generate-recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.assessmentProgress.totalCompleted < 6) {
      return res.status(400).json({ message: 'Complete all assessments first' });
    }

    // Get all career clusters
    const careerClusters = await CareerCluster.find();

    // Career matching algorithm
    const recommendations = careerClusters.map(cluster => {
      let totalFit = 0;
      let maxPossible = 0;

      Object.keys(cluster.matchingCriteria).forEach(criteria => {
        const userScore = calculateAverageScore(user.assessmentScores[criteria]);
        const requiredScore = cluster.matchingCriteria[criteria];
        maxPossible += 100;

        // Calculate fit percentage for this criteria
        const fit = Math.max(0, 100 - Math.abs(userScore - requiredScore));
        totalFit += fit;
      });

      const overallFit = Math.round((totalFit / maxPossible) * 100);

      // Get top career role for this cluster
      const topRole = cluster.careerRoles[0]; // Simplified - take first role

      return {
        careerCluster: cluster._id,
        careerRole: topRole.name,
        fitPercentage: overallFit,
        whyMatch: generateWhyMatchText(cluster, user),
        subjectStream: determineSubjectStream(cluster, user),
        recommendedCourses: topRole.courses,
        actionPlan: generateActionPlan(topRole, user),
        skillsToDevelop: topRole.skills,
        alternateCareers: generateAlternateCareers(cluster, overallFit)
      };
    });

    // Sort by fit percentage
    recommendations.sort((a, b) => b.fitPercentage - a.fitPercentage);

    // Create comprehensive result
    const comprehensiveResult = new ComprehensiveResult({
      user: req.user.id,
      assessmentScores: user.assessmentScores,
      careerRecommendations: recommendations.slice(0, 5), // Top 5 recommendations
      topMatches: recommendations.slice(0, 3).map(rec => ({
        career: rec.careerRole,
        fitPercentage: rec.fitPercentage
      })),
      subjectStreamRecommendation: recommendations[0].subjectStream,
      overallAssessment: {
        strengths: identifyStrengths(user),
        areasForImprovement: identifyAreasForImprovement(user),
        careerReadiness: calculateCareerReadiness(user)
      }
    });

    await comprehensiveResult.save();

    res.json(comprehensiveResult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's comprehensive results
router.get('/results', auth, async (req, res) => {
  try {
    const results = await ComprehensiveResult.find({ user: req.user.id })
      .populate('careerRecommendations.careerCluster')
      .sort({ completedAt: -1 });
    res.json(results[0]); // Return latest result
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper functions
function calculateAverageScore(scores) {
  if (!scores || Object.keys(scores).length === 0) return 0;
  const values = Object.values(scores);
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function generateWhyMatchText(cluster, user) {
  const reasons = [];
  if (user.assessmentScores.interest && user.assessmentScores.interest.STEM > 3) {
    reasons.push('Your strong interest in STEM subjects aligns well');
  }
  if (user.assessmentScores.personality && user.assessmentScores.personality.Conscientiousness > 3) {
    reasons.push('Your organized and detail-oriented personality fits this career');
  }
  if (user.assessmentScores.values && user.assessmentScores.values.Growth > 3) {
    reasons.push('Your desire for continuous learning matches career growth opportunities');
  }
  return reasons.length > 0 ? reasons : ['Good overall alignment with your assessment results'];
}

function determineSubjectStream(cluster, user) {
  if (cluster.name.includes('STEM')) return 'Science (PCM/PCB)';
  if (cluster.name.includes('Healthcare')) return 'Science (PCB)';
  if (cluster.name.includes('Business')) return 'Commerce';
  if (cluster.name.includes('Creative')) return 'Arts';
  if (cluster.name.includes('Education')) return 'Arts/Science (depending on subject)';
  return 'Flexible - Any stream';
}

function generateActionPlan(role, user) {
  const currentGrade = user.profile?.grade || '10th';
  const plan = {
    year1: [`Focus on ${role.requiredSubjects.join(', ')} subjects`, 'Participate in related extracurricular activities'],
    year2: ['Take advanced courses in chosen subjects', 'Start building portfolio/resume'],
    year3: ['Prepare for entrance exams', 'Gain practical experience through internships'],
    year4: ['Pursue undergraduate degree', 'Develop specialized skills'],
    year5: ['Consider postgraduate studies if required', 'Start career or further specialization']
  };
  return plan;
}

function generateAlternateCareers(cluster, fitPercentage) {
  const alternates = [];
  if (fitPercentage > 70) {
    alternates.push({ career: 'Related field specialization', fitPercentage: fitPercentage - 10 });
  }
  return alternates;
}

function identifyStrengths(user) {
  const strengths = [];
  if (user.assessmentScores.academicStrength) {
    const topSubject = Object.entries(user.assessmentScores.academicStrength)
      .sort(([,a], [,b]) => b - a)[0];
    strengths.push(`Strong in ${topSubject[0]}`);
  }
  if (user.assessmentScores.aptitude?.Logical > 3) {
    strengths.push('Good logical reasoning abilities');
  }
  return strengths;
}

function identifyAreasForImprovement(user) {
  const improvements = [];
  if (user.assessmentScores.personality?.EmotionalStability < 3) {
    improvements.push('Develop stress management skills');
  }
  if (user.assessmentScores.futureScope?.Flexibility < 3) {
    improvements.push('Consider developing adaptability skills');
  }
  return improvements;
}

function calculateCareerReadiness(user) {
  let readiness = 50; // Base readiness

  // Add points for completed assessments
  readiness += user.assessmentProgress.totalCompleted * 8;

  // Add points for profile completeness
  if (user.profile?.academicPerformance) readiness += 10;
  if (user.profile?.interests?.length > 0) readiness += 5;
  if (user.profile?.careerGoals) readiness += 5;

  return Math.min(readiness, 100);
}

module.exports = router;