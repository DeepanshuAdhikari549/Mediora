import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setToken } from '../lib/utils';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (token) setToken(token);
        set({ user, token });
      },
      logout: () => {
        setToken(null);
        set({ user: null, token: null });
      },
    }),
    {
      name: 'medicompare-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) setToken(state.token);
      },
    }
  )
);
