import { create } from "zustand";

const API_BASE_URL = import.meta.env.PROD
  ? "https://golden-hands-admin-server.vercel.app"
  : "http://localhost:5000";

export const bookingFunctionStore = create((set, get) => ({
  bookings: [],
  isLoading: false,

  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`);
      const data = await res.json();
      if (data.success) {
        set({ bookings: data.data, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      set({ isLoading: false });
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchBookings(); // Refresh list
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Error updating status:", error);
      return { success: false, message: "Network error" };
    }
  },

  deleteBooking: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await get().fetchBookings();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Error deleting booking:", error);
      return { success: false, message: "Network error" };
    }
  }
}));