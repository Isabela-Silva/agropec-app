import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  hasSplashShown: boolean;
  setSplashShown: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSplashShown: false,
      setSplashShown: (value) => set({ hasSplashShown: value }),
    }),
    {
      name: 'app-storage',
      // Usando sessionStorage para manter o comportamento anterior
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    },
  ),
);
