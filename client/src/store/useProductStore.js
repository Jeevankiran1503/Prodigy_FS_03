import { create } from "zustand";
import api from "../libs/api";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  // Fetch all or search by query
  fetchProducts: async (searchQuery = "") => {
    try {
      set({ loading: true, error: null });

      const url = searchQuery
        ? `/products?search=${encodeURIComponent(searchQuery)}`
        : `/products`;

      const response = await api.get(url);
      set({ products: response.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        products: [],
      });
    } finally {
      set({ loading: false });
    }
  },

  // Wrapper for search
  searchProducts: (query) => {
    return get().fetchProducts(query);
  },

  // Manually set products (optional)
  setProducts: (products) => set({ products }),

  // Add new product
  addProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/products/add', productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // The server now returns { message: '...', product: { ... } }
      // We should add only the product to our state
      set((state) => ({
        products: [...state.products, response.data.product],
      }));
      return response.data; // Return data on success
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error("Add product error:", errorMessage);
      set({ error: errorMessage });
      throw error; // Re-throw the error to be caught by the component
    } finally {
      set({ loading: false });
    }
  }
}));
