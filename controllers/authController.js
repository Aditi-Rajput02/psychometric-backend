const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function makeToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set in environment');
  return jwt.sign(payload, secret, { expiresIn: '1d' });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });

    const cleanEmail = String(email).toLowerCase().trim();
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // Validate role
    const userRole = role && ['student', 'admin'].includes(role) ? role : 'student';

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name: name.trim(), email: cleanEmail, password: hashed, role: userRole });
    await user.save();

    let token;
    try {
      token = makeToken({ id: user._id, email: user.email , role: user.role});
    } catch (err) {
      await User.findByIdAndDelete(user._id).catch(() => {});
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' });
    }

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already registered' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const cleanEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    let token;
    try {
      token = makeToken({ id: user._id, email: user.email });
    } catch (err) {
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' });
    }

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
