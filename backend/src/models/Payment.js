import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentIntentId: {
            type: String,
            required: true,
            unique: true,
        },
        paymentMethod: {
            type: String,
        },
        refundId: {
            type: String,
        },
        refundAmount: {
            type: Number,
        },
        metadata: {
            type: Map,
            of: String,
        },
        failureReason: {
            type: String,
        },
    },
    { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentIntentId: 1 });

export default mongoose.model('Payment', paymentSchema);
