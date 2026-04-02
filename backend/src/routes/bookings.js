import express from 'express';
import Booking from '../models/Booking.js';
import Hospital from '../models/Hospital.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'admin') {
      filter = {};
    } else if (req.user.role === 'hospital') {
      // Find all hospitals owned by this user and filter bookings for them
      const myHospitals = await Hospital.find({ userId: req.user.id }).select('_id');
      const hospitalIds = myHospitals.map((h) => h._id);
      filter = { hospital: { $in: hospitalIds } };
    } else {
      filter = { user: req.user.id };
    }
    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('hospital', 'name slug address city')
      .sort('-createdAt')
      .lean();
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('hospital', 'name slug address city phone');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'user' && booking.user._id.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', protect, restrictTo('user'), async (req, res) => {
  try {
    const { hospitalId, service, slot, homeSample, address } = req.body;
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    const svc = hospital.services.find((s) => s.name === service.name && s.category === service.category);
    if (!svc) return res.status(400).json({ message: 'Service not found' });
    const booking = await Booking.create({
      user: req.user.id,
      hospital: hospitalId,
      service: { name: svc.name, category: svc.category, price: svc.price },
      slot,
      homeSample: !!homeSample,
      address: homeSample ? address : hospital.address,
      payment: { 
        amount: svc.price, 
        paid: !!req.body.transactionId,
        transactionId: req.body.transactionId,
        method: req.body.method || 'upi',
      },
      status: req.body.transactionId ? 'confirmed' : 'pending',
    });
    const populated = await Booking.findById(booking._id)
      .populate('hospital', 'name slug address city')
      .populate('user', 'name email phone');
    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id/confirm', protect, restrictTo('hospital', 'admin'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed', 'payment.paid': true, 'payment.transactionId': req.body.transactionId },
      { new: true }
    )
      .populate('hospital', 'name slug')
      .populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'user' && booking.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id/pay', protect, restrictTo('user'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        'payment.paid': true,
        'payment.method': req.body.method || 'upi',
        'payment.transactionId': req.body.transactionId,
        status: 'confirmed',
      },
      { new: true }
    );
    if (!booking || booking.user.toString() !== req.user.id)
      return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
