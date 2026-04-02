import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true }
);

reviewSchema.index({ hospital: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
