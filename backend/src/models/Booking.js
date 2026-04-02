import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    service: {
      name: { type: String, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
    },
    slot: {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    payment: {
      method: { type: String, enum: ['upi', 'card', 'cod'], default: 'upi' },
      amount: { type: Number, required: true },
      paid: { type: Boolean, default: false },
      transactionId: { type: String },
    },
    homeSample: { type: Boolean, default: false },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
