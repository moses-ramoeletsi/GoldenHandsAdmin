import mongoose from "mongoose";
import Booking from "../model/booking.model.js";

export const getAvailableSlots = async (req, res) => {
  try {
    const { service, date } = req.query;
    
    if (!service || !date) {
      return res.status(400).json({ success: false, message: "Service and date are required" });
    }

    // Define your working hours (1-hour intervals)
    const allSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    // Create date range for the selected day (start to end of day)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find bookings for THIS service on THIS date that are NOT cancelled
    const bookedSlots = await Booking.find({
      service: service,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'Cancelled' } 
    }).select('time');

    // Extract just the time strings (e.g., ["10:00", "14:00"])
    const bookedTimes = bookedSlots.map(b => b.time);

    // Filter out the booked times from all slots
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    return res.status(200).json({ 
      success: true, 
      data: availableSlots,
      booked: bookedTimes // Optional: send this if you want to show "Booked" labels
    });
  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, service, date, time, notes } = req.body;
    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const newBooking = new Booking({ name, email, phone, service, date, time, notes });
    const savedBooking = await newBooking.save();

    return res.status(201).json({ success: true, message: "Booking submitted successfully", data: savedBooking });
  } catch (error) {
    console.error("Error in createBooking:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBookings = async (req, res) => {
  try {
    // Sort by date and time ascending
    const bookings = await Booking.find({}).sort({ date: 1, time: 1 });
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error in getBookings:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ NEW: Get bookings for a specific user by email
export const getMyBookings = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find all bookings for this email, sorted by newest date first
    const bookings = await Booking.find({ email: email.toLowerCase() })
      .sort({ date: -1, time: -1 });

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error in getMyBookings:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedBooking) return res.status(404).json({ success: false, message: "Booking not found" });

    return res.status(200).json({ success: true, message: "Booking status updated", data: updatedBooking });
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) return res.status(404).json({ success: false, message: "Booking not found" });
    return res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};