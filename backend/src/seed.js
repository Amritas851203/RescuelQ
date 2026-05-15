import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './models/User.js';
import Incident from './models/Incident.js';
import Team from './models/Team.js';

const seedDatabase = async () => {
  try {
    console.log('🚀 Seeding RescueIQ Database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Create a Test Admin User
    const admin = await User.create({
      name: 'Aditya Admin',
      email: `admin_${Date.now()}@rescueiq.com`,
      password: 'password123',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Aditya+Admin'
    });
    console.log('👤 Admin User created');

    // 2. Create a Rescue Team
    const team = await Team.create({
      teamName: `Alpha Squad ${Date.now()}`,
      members: [admin._id],
      vehicle: { type: 'helicopter', id: 'HELO-01' },
      currentLocation: { lat: 19.076, lng: 72.877 },
      missionStatus: 'available'
    });
    console.log('🚒 Rescue Team created');

    // 3. Create an Incident
    const incident = await Incident.create({
      title: 'Flash Flood in Mumbai',
      severity: 'high',
      location: {
        address: 'Worli, Mumbai',
        coordinates: { lat: 19.017, lng: 72.815 }
      },
      status: 'active',
      assignedTeams: [team._id]
    });
    console.log('🚨 Incident created');

    console.log('\n✨ Database seeded successfully!');
    console.log('Go to MongoDB Atlas -> Browse Collections to see the data.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
