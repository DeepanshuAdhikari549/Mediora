import mongoose from 'mongoose';

const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String },
    icon: { type: String },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

serviceCategorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

export default mongoose.model('ServiceCategory', serviceCategorySchema);
