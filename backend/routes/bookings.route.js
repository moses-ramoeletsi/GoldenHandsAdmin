import express from "express";
import { createBooking,getAvailableSlots, getBookings,getMyBookings, updateBookingStatus, deleteBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/available-slots", getAvailableSlots);
router.get("/", getBookings);
router.get("/my-bookings", getMyBookings);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;