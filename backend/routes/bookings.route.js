import express from "express";
import { createBooking,getAvailableSlots, getBookings, updateBookingStatus, deleteBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/available-slots", getAvailableSlots);
router.get("/", getBookings);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;