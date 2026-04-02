import express from 'express';
import Hospital from '../models/Hospital.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

const NOISE_WORDS = /\b(near me|price|cost|fee|test|tests|scan|in|at|for|best|cheap|cheapest)\b/gi;
const SERVICE_ALIASES = [
  { pattern: /x[\s-]?ray/i, value: 'x-ray' },
  { pattern: /ct/i, value: 'ct' },
  { pattern: /mri/i, value: 'mri' },
  { pattern: /blood/i, value: 'blood' },
  { pattern: /consult/i, value: 'consultation' },
  { pattern: /full body/i, value: 'full body' },
];

function buildServiceRegex(rawService) {
  if (!rawService) return null;
  const cleaned = rawService.replace(NOISE_WORDS, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return null;
  const alias = SERVICE_ALIASES.find((a) => a.pattern.test(cleaned));
  const normalized = alias ? alias.value : cleaned;
  return new RegExp(normalized, 'i');
}

router.get('/', async (req, res) => {
  try {
    const { city, service, sort = 'rating', lat, lng, limit = 20, page = 1 } = req.query;
    const filter = { verified: true };
    if (city) filter.city = new RegExp(city, 'i');
    const serviceRegex = buildServiceRegex(service);
    if (serviceRegex) filter['services.name'] = serviceRegex;

    let query = Hospital.find(filter).populate('userId', 'name email');

    if (lat && lng) {
      query = query.find({
        location: {
          $nearSphere: { $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] } },
        },
      });
    } else {
      const sortMap = { price: 'services.price', rating: '-rating', distance: 'location' };
      query = query.sort(sortMap[sort] || '-rating');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const hospitals = await query.skip(skip).limit(Number(limit)).lean();
    const total = await Hospital.countDocuments(filter);
    res.json({ hospitals, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Hospital.aggregate([
      { $unwind: '$services' },
      { $group: { _id: '$services.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    res.json(categories.map((c) => ({ name: c._id, count: c.count })));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/suggest', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const services = await Hospital.aggregate([
      { $unwind: '$services' },
      { $match: { 'services.name': new RegExp(q, 'i') } },
      { $group: { _id: '$services.name', category: { $first: '$services.category' } } },
      { $limit: 10 },
    ]);
    res.json(services.map((s) => ({ name: s._id, category: s.category })));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ slug: req.params.slug, verified: true })
      .populate('userId', 'name email phone')
      .lean();
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json(hospital);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', protect, restrictTo('hospital', 'admin'), async (req, res) => {
  try {
    if (req.user.role === 'hospital') req.body.userId = req.user.id;
    const hospital = await Hospital.create(req.body);
    res.status(201).json(hospital);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && hospital.userId?.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    Object.assign(hospital, req.body);
    await hospital.save();
    res.json(hospital);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
