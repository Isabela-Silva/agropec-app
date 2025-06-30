import { api } from './api';
import type { IAdmin, ICreateAdmin, IUpdateAdmin } from './interfaces/admin';
import type { ApiError, ApiResponse } from './interfaces/api';

export class AdminService {
  static async getAll(): Promise<IAdmin[]> {
    try {
      const response = await api.get<IAdmin[]>('/admins');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getById(uuid: string): Promise<IAdmin> {
    try {
      const response = await api.get<IAdmin>(`/admins/${uuid}`);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async create(adminData: ICreateAdmin): Promise<IAdmin> {
    try {
      const response = await api.post<IAdmin>('/admin/signup', adminData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async update(uuid: string, adminData: IUpdateAdmin): Promise<IAdmin> {
    try {
      const response = await api.put<IAdmin>(`/admin/${uuid}`, adminData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async delete(uuid: string): Promise<void> {
    try {
      await api.delete(`/admin/${uuid}`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar estatísticas do dashboard (se implementado no backend)
  static async getStats(): Promise<{
    total: number;
    superAdmins: number;
    admins: number;
  }> {
    try {
      const response = await api.get<
        ApiResponse<{
          total: number;
          superAdmins: number;
          admins: number;
        }>
      >('/admins/stats');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
}
