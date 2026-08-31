import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  contacts: {
    type: String,
    required: [true, "Contact number is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  program: {
    type: String,
    required: [true, "Program is required"],
    enum: ["Hair Care and Styling", "Nail Technology"],
  },
  nextOfKinName: {
    type: String,
    required: [true, "Next of kin name is required"],
    trim: true,
  },
  nextOfKinContacts: {
    type: String,
    required: [true, "Next of kin contact is required"],
    trim: true,
  },
   applicationStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
