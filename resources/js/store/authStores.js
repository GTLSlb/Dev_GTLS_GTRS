// stores/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // For persistence
import axios from 'axios';

// Configure Axios to send cookies with requests
axios.defaults.withCredentials = true; // IMPORTANT for Sanctum SPA authentication
axios.defaults.baseURL = process.env.APP_URL; // Your Laravel API base URL

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // Stores the user object { id, name, email, roles, ... }
      isAuthenticated: false,
      isLoading: true, // To indicate initial authentication check is in progress

      // Actions
      login: async (email, password) => {
        try {
          // Get CSRF cookie first (important for Sanctum SPA auth)
          await axios.get('/sanctum/csrf-cookie');

          const response = await axios.post('/login', { email, password });
          const { user } = response.data;

          set({ user, isAuthenticated: true, isLoading: false });
          return true; // Login successful
        } catch (error) {
          console.error("Login failed:", error.response?.data || error.message);
          set({ user: null, isAuthenticated: false, isLoading: false });
          throw error; // Re-throw to handle in component
        }
      },

      logout: async () => {
        try {
          await axios.post('/logout');
          set({ user: null, isAuthenticated: false });
          // Optional: Clear any other related client-side state
        } catch (error) {
          console.error("Logout failed:", error.response?.data || error.message);
          // Even if logout fails on server, clear client state for security
          set({ user: null, isAuthenticated: false });
        }
      },

      // Fetches the authenticated user from the backend
      // This is crucial for initial load and refreshing user data
      fetchUser: async () => {
        set({ isLoading: true }); // Set loading before fetching
        try {
          const response = await axios.get('/user');
          const user = response.data;
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch user:", error.response?.data || error.message);
          set({ user: null, isAuthenticated: false, isLoading: false });
          // If 401 (unauthenticated), Laravel Sanctum will handle the cookie removal,
          // but we ensure client-side state is reset.
        }
      },

      // Initialize auth state (call this once on app startup)
      // This checks if a user is already authenticated via session cookie
      initAuth: async () => {
        // Attempt to fetch user. If successful, user is authenticated.
        // If 401, they are not (or session expired/invalid).
        await get().fetchUser();
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
      // Only persist `user` and `isAuthenticated` for UI display.
      // `isLoading` should not be persisted.
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Optional: Axios interceptor to handle unauthenticated responses
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && error.config?.url !== '/login') {
      // If 401 and not on the login request itself, it means session expired/invalid
      useAuthStore.getState().logout(); // Clear client-side state
      // Optionally redirect to login page if using react-router-dom
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
