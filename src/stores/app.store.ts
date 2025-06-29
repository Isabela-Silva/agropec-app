import { create } from 'zustand';

interface AppState {
  hasSplashShown: boolean;
  setSplashShown: (value: boolean) => void;
  hasClosedPWA: boolean;
  setClosedPWA: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  hasSplashShown: false,
  setSplashShown: (value) => set({ hasSplashShown: value }),
  hasClosedPWA: false,
  setClosedPWA: (value) => set({ hasClosedPWA: value }),
}));
