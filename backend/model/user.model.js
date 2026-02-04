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
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;

// import mongoose from "mongoose";   

// const userSchema = new mongoose.Schema(
//     {
//         firstName: { type: String, required: true, trim: true },
//         lastName: { type: String, required: true, trim: true },
//     email: {
//         type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//       match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
//     },
//        contacts: { type: String, required: true, trim: true },
//     address: { type: String, trim: true },
//     program: {
//       type: String,
//       enum: ['Hair Care and Styling', 'Nail Technology'],
//       required: true
//     },
//     nextOfKinName: { type: String, trim: true },
//     nextOfKinContacts: { type: String, trim: true }
//     },{
//         timestamps: true
//     }
// );

// const User = mongoose.model("User", userSchema);

// export default User;