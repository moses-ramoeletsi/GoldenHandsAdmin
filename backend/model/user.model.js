import mongoose from "mongoose";   

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
    email: {
        type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
       contacts: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    program: {
      type: String,
      enum: ['Hair Care and Styling', 'Nail Technology'],
      required: true
    },
    nextOfKinName: { type: String, trim: true },
    nextOfKinContacts: { type: String, trim: true }
    },{
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;