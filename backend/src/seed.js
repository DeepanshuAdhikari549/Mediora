import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Hospital from './models/Hospital.js';
import ServiceCategory from './models/ServiceCategory.js';

await connectDB();

const categories = [
  'Blood Test', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG', 'Full Body Checkup', 'Doctor Consultation',
];

await ServiceCategory.deleteMany({});
for (const name of categories) {
  await ServiceCategory.create({ name, popular: ['Blood Test', 'X-Ray', 'MRI', 'Full Body Checkup', 'Doctor Consultation'].includes(name) });
}

await User.deleteMany({ email: /@medicompare-demo/ });
const admin = await User.create({
  name: 'Admin Demo',
  email: 'admin@medicompare-demo.com',
  password: 'admin123',
  role: 'admin',
});
const hospitalUser = await User.create({
  name: 'Hospital Demo',
  email: 'hospital@medicompare-demo.com',
  password: 'hospital123',
  role: 'hospital',
});

await Hospital.deleteMany({});

const dehradunAreas = [
  'Rajpur Road', 'Chakrata Road', 'Haridwar Road', 'Prem Nagar', 'Ballupur', 
  'ISBT', 'Garhi Cantt', 'Dalanwala', 'Sahastradhara Road', 'Patel Nagar',
  'GMS Road', 'Vasant Vihar', 'Kaulagarh', 'Karanpur', 'Balliwala'
];

const hospitalNames = [
  'Max Super Speciality', 'Doon Hospital', 'Synergy Hospital', 'CMI Hospital', 
  'Velmed Hospital', 'Shri Mahant Indresh', 'Jolly Grant', 'Kailash Hospital',
  'Uttaranchal Dental', 'Combined Medical Institute', 'Fortis Escorts', 'Apollo Clinic',
  'Dr. Lal PathLabs', 'Metropolis Healthcare', 'SRL Diagnostics', 'Thyrocare',
  'City Care', 'LifeLine Hospital', 'Metro Hospital', 'Saket Hospital'
];

const hospitals = [];

// Generate ~80 hospitals
for (let i = 0; i < 80; i++) {
  const city = i < 60 ? 'Dehradun' : (i < 70 ? 'Mumbai' : 'Delhi');
  const nameBase = hospitalNames[i % hospitalNames.length];
  const area = dehradunAreas[i % dehradunAreas.length];
  const name = `${nameBase} ${i > 20 ? (i % 5 === 0 ? 'Diagnostic' : 'Center') : ''} ${i}`;
  
  const lat_base = city === 'Dehradun' ? 30.3165 : (city === 'Mumbai' ? 19.076 : 28.6139);
  const lng_base = city === 'Dehradun' ? 78.0322 : (city === 'Mumbai' ? 72.8777 : 77.209);
  
  // Random offset for location
  const lat = lat_base + (Math.random() - 0.5) * 0.1;
  const lng = lng_base + (Math.random() - 0.5) * 0.1;

  hospitals.push({
    name,
    userId: hospitalUser._id,
    type: i % 4 === 0 ? 'lab' : 'hospital',
    description: `${name} provides premium healthcare in ${area}, ${city}.`,
    address: `${100 + i}, ${area}`,
    city,
    state: city === 'Dehradun' ? 'Uttarakhand' : (city === 'Mumbai' ? 'Maharashtra' : 'Delhi'),
    pincode: city === 'Dehradun' ? '248001' : (city === 'Mumbai' ? '400001' : '110001'),
    location: { type: 'Point', coordinates: [lng, lat] },
    phone: `99999${i.toString().padStart(5, '0')}`,
    services: [
      { name: 'X-Ray', category: 'X-Ray', price: 300 + (i % 10) * 50 },
      { name: 'Blood Test - CBC', category: 'Blood Test', price: 200 + (i % 5) * 20 },
      { name: 'MRI', category: 'MRI', price: 4000 + (i % 3) * 500 },
      { name: 'Doctor Consultation', category: 'Doctor Consultation', price: 300 + (i % 8) * 100 },
    ],
    slots: [
      { date: new Date(), startTime: '09:00', endTime: '10:00', available: true },
      { date: new Date(), startTime: '10:00', endTime: '11:00', available: true },
    ],
    nablCertified: i % 2 === 0,
    insuranceSupported: i % 3 === 0,
    homeSampleCollection: i % 2 === 0,
    verified: true,
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    reviewCount: Math.floor(Math.random() * 200),
  });
}

for (const h of hospitals) {
  await Hospital.create(h);
}

console.log(`Seed done. Added ${hospitals.length} hospitals.`);
console.log('Admin: admin@medicompare-demo.com / admin123');
await mongoose.connection.close();
process.exit(0);
