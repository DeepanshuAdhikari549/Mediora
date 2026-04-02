import express from 'express';
import PDFDocument from 'pdfkit';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:bookingId', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('user', 'name email phone')
      .populate('hospital', 'name address city phone');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'user' && booking.user._id.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=medicompare-invoice-${booking._id}.pdf`);
    doc.pipe(res);
    doc.fontSize(20).text('MediCompare - Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Booking ID: ${booking._id}`, { align: 'right' });
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();
    doc.text(`Patient: ${booking.user.name}`);
    doc.text(`Email: ${booking.user.email}`);
    doc.text(`Phone: ${booking.user.phone}`);
    doc.moveDown();
    doc.text(`Hospital: ${booking.hospital.name}`);
    doc.text(`Address: ${booking.hospital.address}, ${booking.hospital.city}`);
    doc.moveDown();
    doc.text(`Service: ${booking.service.name} (${booking.service.category})`);
    doc.text(`Slot: ${new Date(booking.slot.date).toLocaleDateString()} ${booking.slot.startTime}-${booking.slot.endTime}`);
    doc.moveDown();
    doc.text(`Amount: ₹${booking.payment.amount}`);
    doc.text(`Status: ${booking.status}`);
    doc.end();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
