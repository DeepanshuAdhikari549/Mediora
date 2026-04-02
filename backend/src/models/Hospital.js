import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  homeSample: { type: Boolean, default: false },
  duration: { type: Number },
});

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['hospital', 'lab', 'clinic'], default: 'hospital' },
    description: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    phone: { type: String },
    email: { type: String },
    images: [{ type: String }],
    services: [serviceSchema],
    slots: [slotSchema],
    nablCertified: { type: Boolean, default: false },
    insuranceSupported: { type: Boolean, default: false },
    available24x7: { type: Boolean, default: false },
    homeSampleCollection: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    offers: [{ type: String }],
  },
  { timestamps: true }
);

hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ city: 1, 'services.name': 1 });

hospitalSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

export default mongoose.model('Hospital', hospitalSchema);
