import { api } from './api';
import type { ILoginInput } from './interfaces/admin';
import type { AdminAuthResponse, ApiError, AuthResponse } from './interfaces/api';
import type { ICreateUser, ILoginInput as IUserLoginInput } from './interfaces/user';

export class AuthService {
  // Autenticação de usuários
  static async signIn(credentials: IUserLoginInput): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async signUp(userData: ICreateUser): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/signup', userData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Autenticação de administradores
  static async adminSignIn(credentials: ILoginInput): Promise<AdminAuthResponse> {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async adminSignUp(adminData: ICreateUser): Promise<AdminAuthResponse> {
    try {
      const response = await api.post('/admin/signup', adminData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Logout local (remove tokens do localStorage)
  static signOut(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('auth_data');
    localStorage.removeItem('admin_data');
  }
}
