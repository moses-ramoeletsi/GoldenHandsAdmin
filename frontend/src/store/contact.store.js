import { create } from "zustand";

const API_BASE_URL = import.meta.env.PROD
  ? "https://golden-hands-admin-server.vercel.app"
  : "http://localhost:5000";

export const contactFunctionStore = create((set, get) => ({
  contacts: [],
  isLoading: false,

  fetchContacts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts`);
      const data = await res.json();
      if (data.success) {
        set({ contacts: data.data, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      set({ isLoading: false });
    }
  },

  updateContactStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchContacts();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Error updating status:", error);
      return { success: false, message: "Network error" };
    }
  },

  deleteContact: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await get().fetchContacts();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Error deleting contact:", error);
      return { success: false, message: "Network error" };
    }
  }
}));