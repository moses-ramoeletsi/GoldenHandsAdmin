import { create } from "zustand";

const API_BASE_URL = import.meta.env.PROD
  ? "https://moses-ramoeletsi-portfolio-server.vercel.app"
  : "http://localhost:5000";

export const userFunctionStore = create((set, get) => ({
  students: [],
  isLoading: false,
  error: null,

setStudents: (students) => set({ students }),
  addUser: async (newUser) => {
    // Validate input using the passed newUser object
    if (
      !newUser?.firstName ||
      !newUser?.lastName ||
      !newUser?.email ||
      !newUser?.contacts ||
      !newUser?.address ||
      !newUser?.program ||
      !newUser?.nextOfKinName ||
      !newUser?.nextOfKinContacts
    ) {
      return { success: false, message: "Please fill all required fields" };
    }

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      await get().fetchUsers();

      // Expecting backend to return { success: true, data: <user>, message: ... }
      if (!data?.success) {
        set({ isLoading: false });
        return { success: false, message: data?.message || "Failed to add user" };
      }

      set((state) => ({
        users: [...state.users, data.data],
        isLoading: false,
      }));

      return { success: true, message: data.message || "User added successfully" };
    } catch (error) {
      console.error("Error in addUser:", error);
      set({ isLoading: false, error: error.message });
      return { success: false, message: error.message || "An unexpected error occurred." };
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const data = await res.json();
      if (!res.ok) {
        set({ isLoading: false, error: data?.message || `HTTP ${res.status}` });
        return;
      }
      // backend returns { success: true, data: [...] }
      set({ students: data?.data ?? [], isLoading: false });
    } catch (err) {
      console.error("Error fetching users:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  
  // fetchUsers: async () => {
  //   try {
  //     set({ isLoading: true, error: null });
      
  //     const res = await fetch(`${API_BASE_URL}/api/users`, {
  //       signal: AbortSignal.timeout(30000)
  //     });
     
  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }
      
  //     const data = await res.json();
  //     set({ projects: data.data, isLoading: false });
  //   } catch (error) {
  //     console.error("Error fetching projects:", error);
  //     set({ isLoading: false, error: error.message });
  //   }
  // },
  
//   updateProject: async (uid, updatedProject) => {
//     try {
//       set({ isLoading: true, error: null });
      
//       const res = await fetch(`${API_BASE_URL}/api/project/${uid}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedProject),
//         signal: AbortSignal.timeout(30000)
//       });
      
//       const data = await res.json();
      
//       if (!data.success) {
//         set({ isLoading: false });
//         return { success: false, message: data.message };
//       }
      
//       set((state) => ({
//         projects: state.projects.map((project) => 
//           (project._id === uid ? data.data : project)
//         ),
//         isLoading: false
//       }));
      
//       return { success: true, message: "Project updated successfully" };
//     } catch (error) {
//       console.error("Error updating project:", error);
//       set({ isLoading: false, error: error.message });
      
//       return {
//         success: false,
//         message: "An unexpected error occurred. Please try again."
//       };
//     }
//   },
  
//   deleteProject: async (uid) => {
//     try {
//       set({ isLoading: true, error: null });
      
//       const res = await fetch(`${API_BASE_URL}/api/project/${uid}`, {
//         method: "DELETE",
//         signal: AbortSignal.timeout(30000)
//       });
      
//       const data = await res.json();
      
//       if (!data.success) {
//         set({ isLoading: false });
//         return { success: false, message: data.message };
//       }
      
//       set((state) => ({ 
//         projects: state.projects.filter((project) => project._id !== uid),
//         isLoading: false
//       }));
      
//       return { success: true, message: data.message };
//     } catch (error) {
//       console.error("Error deleting project:", error);
//       set({ isLoading: false, error: error.message });
      
//       return {
//         success: false,
//         message: "An unexpected error occurred. Please try again."
//       };
//     }
//   },
}));