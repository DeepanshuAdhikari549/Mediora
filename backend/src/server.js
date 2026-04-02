import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import hospitalsRoutes from './routes/hospitals.js';
import bookingsRoutes from './routes/bookings.js';
import reviewsRoutes from './routes/reviews.js';
import recommendRoutes from './routes/recommend.js';
import adminRoutes from './routes/admin.js';
import invoiceRoutes from './routes/invoice.js';
import aiRoutes from './routes/ai.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// ✅ CORS FIX (important for Vercel frontend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);

// ✅ Health check (Render uses this)
app.get('/', (req, res) => {
  res.send('MediCompare Backend Running 🚀');
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// ✅ Start server ONLY after DB connects
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MediCompare API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed ❌', err);
    process.exit(1);
  });
