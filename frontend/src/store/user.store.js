import { create } from "zustand";

const API_BASE_URL = import.meta.env.PROD
  ? "https://golden-hands-admin-server.vercel.app"
  : "http://localhost:5000";

export const userFunctionStore = create((set, get) => ({
  students: [],
  isLoading: false,
  error: null,

  setStudents: (students) => set({ students }),

  addUser: async (newUser) => {
    if (
      !newUser?.firstName || !newUser?.lastName || !newUser?.email ||
      !newUser?.contacts || !newUser?.address || !newUser?.program ||
      !newUser?.nextOfKinName || !newUser?.nextOfKinContacts
    ) {
      return { success: false, message: "Please fill all required fields" };
    }

    set({ isLoading: true, error: null });

    try {
      // FIX: Corrected fetch syntax - use parentheses, not backticks
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message || "Failed to add user" };
      }

      // Refresh the user list
      await get().fetchUsers();
      set({ isLoading: false });
      return { success: true, message: data.message || "User added successfully" };
    } catch (error) {
      console.error("Error in addUser:", error);
      set({ isLoading: false, error: error.message });
      return { success: false, message: "Network error - please try again" };
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      // FIX: Corrected fetch syntax
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const data = await res.json();
      
      if (!res.ok) {
        set({ isLoading: false, error: data?.message || `HTTP ${res.status}` });
        return;
      }
      
      set({ students: data?.data ?? [], isLoading: false });
    } catch (err) {
      console.error("Error fetching users:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  updateUser: async (id, updates) => {
    set({ isLoading: true, error: null });

    try {
      // FIX: Corrected fetch syntax
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message };
      }

      await get().fetchUsers();
      set({ isLoading: false });
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error updating user:", error);
      set({ isLoading: false, error: error.message });
      return { success: false, message: "Network error - please try again" };
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });

    try {
      // FIX: Corrected fetch syntax
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message };
      }

      set((state) => ({
        students: state.students.filter((s) => s._id !== id),
        isLoading: false,
      }));

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error deleting user:", error);
      set({ isLoading: false, error: error.message });
      return { success: false, message: "Network error - please try again" };
    }
  },
}));