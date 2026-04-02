import express from 'express';
import Review from '../models/Review.js';
import Hospital from '../models/Hospital.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/hospital/:hospitalId', async (req, res) => {
  try {
    const reviews = await Review.find({ hospital: req.params.hospitalId })
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(50)
      .lean();
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { hospitalId, rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { user: req.user.id, hospital: hospitalId },
      { rating, comment },
      { new: true, upsert: true }
    ).populate('user', 'name');
    const agg = await Review.aggregate([
      { $match: { hospital: review.hospital } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (agg[0]) {
      await Hospital.findByIdAndUpdate(hospitalId, {
        rating: Math.round(agg[0].avg * 10) / 10,
        reviewCount: agg[0].count,
      });
    }
    res.json(review);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
