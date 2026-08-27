import mongoose from "mongoose";

let cachedConnection = null;

const connectDatabase = async () => {
  // Reuse existing connection in serverless environment
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Recommended for serverless
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedConnection = null;
    });
    
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    cachedConnection = null;
    throw error;
  }
};

export default connectDatabase;