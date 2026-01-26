import { connect } from 'mongoose';

const connectDatabase = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    // don't exit in dev — return false so caller can handle it
    return false;
  }
};

export default connectDatabase;