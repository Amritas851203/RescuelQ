import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

console.log('Testing connection with URI:', process.env.MONGO_URI);

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
