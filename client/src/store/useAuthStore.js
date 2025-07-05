import { create } from "zustand";
import api from "../libs/api";
import toast from "react-hot-toast";
export const useAuthStore = create((set,get) => ({
  user: null,
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/check-auth');
      set({ user: response.data });
    } catch (error) {
      console.error("Check auth error:", error.response?.data?.message || error.message);
    }
  },
  logout: () => set({ user: null }),

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      set({user: response.data})
      console.log(get().user);
      toast.success("User registered successfully");
    } catch (error) {
      console.error("Register error:", error.response?.data?.message || error.message);
      toast.error("User registration failed");
    }
  },

  login: async (userData) => {
    try {
      const response = await api.post('/auth/login', userData);
      set({ user: response.data });
      toast.success("User logged in successfully");
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      toast.error("Invalid email or password");
    }
  }
}));
