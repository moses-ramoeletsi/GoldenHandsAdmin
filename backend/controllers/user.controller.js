import mongoose from "mongoose";
import User from "../model/user.model.js";


export const createUser = async (req, res) => {
  const user = req.body;
  
  req.on('timeout', () => {
    return res.status(408).json({
      success: false,
      message: "Request timeout - please try again"
    });
  });

  try {
    // guard: ensure DB is connected before attempting writes
    if (mongoose.connection.readyState !== 1) {
      console.error('createUser: mongoose not connected, state=', mongoose.connection.readyState);
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }
    if (!user.firstName || !user.lastName || 
        !user.email || !user.contacts || !user.address ||
        !user.program || !user.nextOfKinName || !user.nextOfKinContacts) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const validProgram = [
      "Hair Care and Styling",
      "Nail Technology",
    ];
    
    if (!validProgram.includes(user.program)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Program type",
      });
    }
    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contacts: user.contacts,
      address: user.address,
      program: user.program,
      nextOfKinName: user.nextOfKinName,
      nextOfKinContacts: user.nextOfKinContacts,
    });

    const savedUser = await Promise.race([
      newUser.save(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 20000)
      )
    ]);

    return res.status(201).json({
      success: true,
      message: "User added",
      data: savedUser,
    });

  } catch (error) {
    // log full error for easier debugging (message + stack)
    console.error("Error in adding new user:", error && error.message, error && error.stack);
    
    if (error.message === 'Database timeout') {
      return res.status(504).json({
        success: false,
        message: "Database operation timed out please try again"
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error - please try again"
    });
  }
};
 export const getUsers = async (req, res) => {
  try {
    console.log('getUsers called');
    if (mongoose.connection.readyState !== 1) {
      console.error('getUsers: mongoose not connected, state=', mongoose.connection.readyState);
      return res.status(503).json({ success: false, message: 'Database not connected' });
    }

    const users = await User.find({});
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    // log full error for debugging
    console.error('getUsers error:', error && error.message, error && error.stack);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server error while fetching users',
      ...(process.env.NODE_ENV !== 'production' ? { stack: error?.stack } : {}),
    });
  }
};
  
//   export const updateProject = async (req, res) => {
//     const { id } = req.params;
//     const project = req.body;
  
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ success: false, message: "Invalid project Id" });
//     }
  
//     if (project.projectType) {
//       const validProjectType = [
//         "Website",
//         "WebApp",
//         "Mobile Application",
//         "Desktop Application",
//       ];
//       if (!validProjectType.includes(project.projectType)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid project type",
//         });
//       }
//     }
  
//     try {
//       const updatedProject = await Project.findByIdAndUpdate(id, project, {
//         new: true,
//         runValidators: true,
//       });
  
//       res.status(200).json({
//         success: true,
//         message: "Project updated",
//         data: updatedProject,
//       });
//     } catch (error) {
//       console.log("Error in updating project", error.message);
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//   };
  
//   export const deleteProject = async (req, res) => {
//     const { id } = req.params;
  
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ success: false, message: "Invalid project Id" });
//     }
//     try {
//       await Project.findByIdAndDelete(id);
//       res.status(200).json({ success: true, message: "Project deleted" });
//     } catch (error) {
//       console.log("Error in deleting project", error.message);
//       res.status(500).json({ success: false, message: "Server Error" });
//     }
//   };