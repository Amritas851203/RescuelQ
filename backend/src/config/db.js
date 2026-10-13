import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 */
const connectDB = async (retryCount = 0) => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ FATAL: MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }
    console.warn('⚠️ WARNING: MONGO_URI is not set in backend/.env. MongoDB Atlas features will be unavailable until configured.');
    return;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // In production, retry up to 5 times
    if (process.env.NODE_ENV === 'production') {
      if (retryCount < 5) {
        const waitTime = 5000;
        console.log(`🔄 Retrying MongoDB connection in ${waitTime / 1000}s... (Attempt ${retryCount + 1}/5)`);
        setTimeout(() => connectDB(retryCount + 1), waitTime);
      } else {
        console.error('❌ Max connection retries reached. Exiting...');
        process.exit(1);
      }
    } else {
      console.warn('⚠️ Development mode: server will continue running. Check your MONGO_URI in .env to connect to database.');
    }
  }
};

export default connectDB;
