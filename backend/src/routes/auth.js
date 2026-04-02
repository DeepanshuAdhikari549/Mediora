import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'hospital', 'admin']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { name, password, role = 'user', phone } = req.body;
      const email = req.body.email.toLowerCase().trim();
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already registered' });
      const user = await User.create({ name, email, password, role, phone });
      const token = generateToken(user._id);
      res.status(201).json({ user: { id: user._id, name, email, role }, token });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const email = req.body.email.toLowerCase().trim();
      const { password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ message: 'Invalid email or password' });
      const token = generateToken(user._id);
      res.json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedHospitals', 'name slug rating');
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/saved/:hospitalId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const idx = user.savedHospitals.indexOf(req.params.hospitalId);
    if (idx === -1) user.savedHospitals.push(req.params.hospitalId);
    else user.savedHospitals.splice(idx, 1);
    await user.save();
    res.json({ savedHospitals: user.savedHospitals });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
