import express from 'express';
import Hospital from '../models/Hospital.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import ServiceCategory from '../models/ServiceCategory.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', async (req, res) => {
  try {
    const [hospitals, bookings, users] = await Promise.all([
      Hospital.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ role: 'user' }),
    ]);
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    res.json({ hospitals, bookings, users, recentBookings });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/bookings/analytics', async (req, res) => {
  try {
    const byDay = await Booking.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const byStatus = await Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    res.json({ byDay, byStatus });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate('userId', 'name email').lean();
    res.json(hospitals);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/hospitals/:id/verify', async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!hospital) return res.status(404).json({ message: 'Not found' });
    res.json(hospital);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await ServiceCategory.find().lean();
    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const cat = await ServiceCategory.create(req.body);
    res.status(201).json(cat);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('hospital', 'name slug address city')
      .sort('-createdAt')
      .lean();
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
