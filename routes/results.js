const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Result = require('../models/Result');

router.post('/', auth, async (req, res) => {
  try {
    const result = new Result({ ...req.body, user: req.user.id });
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id }).populate('test', 'title assessmentType');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
