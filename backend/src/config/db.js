import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 */
const connectDB = async (retryCount = 0) => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI || MONGO_URI.includes('cluster0.mongodb.net')) {
    console.warn('⚠️  Warning: MONGO_URI is missing or appears to be a placeholder.');
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // Retry logic for production readiness
    if (retryCount < 5) {
      const waitTime = 5000;
      console.log(`🔄 Retrying connection in ${waitTime / 1000}s... (Attempt ${retryCount + 1}/5)`);
      setTimeout(() => connectDB(retryCount + 1), waitTime);
    } else {
      console.error('❌ Max connection retries reached. Exiting...');
      process.exit(1);
    }
  }
};

export default connectDB;
