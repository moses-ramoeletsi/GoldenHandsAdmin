import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  service: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: { type: String, trim: true, default: '' }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;