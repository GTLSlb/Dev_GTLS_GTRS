// stores/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,             // User object from Laravel (id, name, email, etc.)
      sessionId: null,        // Laravel session ID
      isAuthenticated: false, // Used to track login status

      // Call this after a successful login API response
      setAuth: (user, sessionId) =>
        set({
          user,
          sessionId,
          isAuthenticated: true,
        }),

      // Clears auth on logout
      clearAuth: () =>
        set({
          user: null,
          sessionId: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        sessionId: state.sessionId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
