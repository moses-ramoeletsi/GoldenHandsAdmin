import { create } from "zustand";

const API_BASE_URL = import.meta.env.PROD
  ? "https://golden-hands-admin-server.vercel.app"
  : "http://localhost:5000";

export const galleryFunctionStore = create((set, get) => ({
  galleryItems: [],
  isLoading: false,
  error: null,

  fetchGalleryItems: async (category = null) => {
    set({ isLoading: true, error: null });
    try {
      const url = category 
        ? `${API_BASE_URL}/api/gallery?category=${category.toLowerCase()}` 
        : `${API_BASE_URL}/api/gallery`;
        
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        set({ isLoading: false, error: data?.message || `HTTP ${res.status}` });
        return { success: false, message: data?.message };
      }
      
      set({ galleryItems: data?.data ?? [], isLoading: false });
      return { success: true };
    } catch (err) {
      console.error("Error fetching gallery items:", err);
      set({ isLoading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  addGalleryItem: async (formData) => { // formData is now a FormData object
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: "POST",
        body: formData, // Browser handles Content-Type automatically
      });
      const data = await res.json();

      if (!res.ok) {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message || "Failed to add item" };
      }

      await get().fetchGalleryItems();
      set({ isLoading: false });
      return { success: true, message: data.message || "Item added successfully" };
    } catch (error) {
      console.error("Error adding gallery item:", error);
      set({ isLoading: false, error: error.message });
      return { success: false, message: "Network error - please try again" };
    }
  },

  updateGalleryItem: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message };
      }

      await get().fetchGalleryItems();
      set({ isLoading: false });
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error updating gallery item:", error);
      set({ isLoading: false, error: error.message });
      return { success: false, message: "Network error - please try again" };
    }
  },

  deleteGalleryItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message };
      }

      await get().fetchGalleryItems();
      set({ isLoading: false });
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      set({ isLoading: false, error: error.message });
      return { success: false, message: "Network error - please try again" };
    }
  },
}));