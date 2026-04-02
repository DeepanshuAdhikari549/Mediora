import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('\n\u274c MONGODB_URI is not set.');
    console.error('  1. Copy backend\\.env.example to backend\\.env');
    console.error('  2. Set MONGODB_URI (e.g. MongoDB Atlas or mongodb://localhost:27017/medicompare)');
    console.error('  3. Set JWT_SECRET to any long random string\n');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
