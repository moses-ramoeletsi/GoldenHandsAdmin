import mongoose from "mongoose";
import User from "../model/user.model.js";

export const createUser = async (req, res) => {
  try {
    const user = req.body;

    // Validate required fields
    if (!user.firstName || !user.lastName || 
        !user.email || !user.contacts || !user.address ||
        !user.program || !user.nextOfKinName || !user.nextOfKinContacts) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate program
    const validPrograms = [
      "Hair Care and Styling",
      "Nail Technology",
    ];
    
    if (!validPrograms.includes(user.program)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Program type",
      });
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    // Create new user
    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contacts: user.contacts,
      address: user.address,
      program: user.program,
      nextOfKinName: user.nextOfKinName,
      nextOfKinContacts: user.nextOfKinContacts,
      enrollmentDate: new Date(),
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User added successfully",
      data: savedUser,
    });

  } catch (error) {
    console.error("Error in createUser:", error);
    
    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error - please try again",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    console.log('getUsers called - DB state:', mongoose.connection.readyState);
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    const users = await User.find({}).sort({ enrollmentDate: -1 });
    
    console.log('Users found:', users.length);
    
    return res.status(200).json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server error while fetching users',
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error - please try again",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error - please try again",
    });
  }
};
