import { create } from "zustand";
import api from "../libs/api";
import toast from 'react-hot-toast'; 

export const useCartStore = create((set, get) => ({
  cart: [],

  
  fetchCart: async () => {
    try {
      const response = await api.get('/cart');
      set({ cart: response.data });
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  },


  addCart: async (productId, quantity) => {
    try {
      await api.post('/cart', { productId, quantity });
      await get().fetchCart(); 
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error; 
    }
  },

  updateCart: async (productId, quantity) => {
    try {
      await api.put(`/cart/${productId}`, { quantity });
      await get().fetchCart(); 
    } catch (error) {
      console.error("Update cart error:", error);
      throw error;
    }
  },

  deleteCart: async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      await get().fetchCart();
    } catch (error) {
      console.error("Delete cart error:", error);
      throw error;
    }
  },


  clearCart: () => set({ cart: [] }),
}));
