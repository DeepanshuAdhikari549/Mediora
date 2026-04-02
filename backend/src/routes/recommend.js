import express from 'express';
import Hospital from '../models/Hospital.js';

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

// AI-style recommendation: score = f(rating, price, distance, slot availability)
router.get('/', async (req, res) => {
  try {
    const { service, city, lat, lng, limit = 10 } = req.query;
    if (!service) return res.status(400).json({ message: 'service required' });
    const serviceRegex = buildServiceRegex(service);
    if (!serviceRegex) return res.status(400).json({ message: 'service required' });

    const filter = { verified: true, 'services.name': serviceRegex };
    if (city) filter.city = new RegExp(city, 'i');

    let hospitals = await Hospital.find(filter)
      .populate('userId', 'name')
      .lean();

    const allPrices = hospitals.flatMap((x) => (x.services || []).map((s) => s.price)).filter(Boolean);
    const maxPrice = allPrices.length ? Math.max(...allPrices) : 1;
    hospitals = hospitals.map((h) => {
      const svc = h.services?.find((s) => serviceRegex.test(s.name));
      if (!svc) return null;
      let score = 0;
      score += (h.rating || 0) * 20;
      score += 30 * (1 - (svc.price || 0) / maxPrice);
      if (h.location?.coordinates?.length === 2 && lat && lng) {
        const d = distance(lat, lng, h.location.coordinates[1], h.location.coordinates[0]);
        score += Math.max(0, 25 - d / 2);
      } else score += 15;
      score += (h.slots?.filter((s) => s.available)?.length ? 25 : 0);
      return { ...h, service: svc, score: Math.round(score * 10) / 10 };
    }).filter(Boolean);

    hospitals.sort((a, b) => b.score - a.score);
    res.json({ recommendations: hospitals.slice(0, Number(limit)) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default router;
