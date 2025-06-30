import { create } from 'zustand';
import type { IAdmin } from '../services/interfaces/admin';
import type { IUser } from '../services/interfaces/user';

// Tipos para usuário e admin logados (sem senha)
type LoggedInUser = Omit<IUser, 'password'>;
type LoggedInAdmin = Omit<IAdmin, 'password'>;

interface AppState {
  // Splash e PWA
  hasSplashShown: boolean;
  setSplashShown: (value: boolean) => void;
  hasClosedPWA: boolean;
  setClosedPWA: (value: boolean) => void;

  // Autenticação de usuário
  user: LoggedInUser | null;
  isUserLoading: boolean;
  setUser: (user: LoggedInUser | null) => void;
  setUserLoading: (loading: boolean) => void;

  // Autenticação de admin
  admin: LoggedInAdmin | null;
  isAdminLoading: boolean;
  setAdmin: (admin: LoggedInAdmin | null) => void;
  setAdminLoading: (loading: boolean) => void;

  // Logout
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Splash e PWA
  hasSplashShown: false,
  setSplashShown: (value) => set({ hasSplashShown: value }),
  hasClosedPWA: false,
  setClosedPWA: (value) => set({ hasClosedPWA: value }),

  // Autenticação de usuário
  user: null,
  isUserLoading: true,
  setUser: (user) => set({ user }),
  setUserLoading: (loading) => set({ isUserLoading: loading }),

  // Autenticação de admin
  admin: null,
  isAdminLoading: true,
  setAdmin: (admin) => set({ admin }),
  setAdminLoading: (loading) => set({ isAdminLoading: loading }),

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    set({ user: null, admin: null });
  },
}));
