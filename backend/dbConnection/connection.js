// import { connect } from 'mongoose';

// const connectDatabase = async () => {
//   try {
//     await connect(process.env.MONGODB_URI);
//     console.log('MongoDB Connected Successfully');
//     return true;
//   } catch (error) {
//     console.error('MongoDB Connection Error:', error.message);
//     // don't exit in dev — return false so caller can handle it
//     return false;
//   }
// };

// export default connectDatabase;

import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDatabase;