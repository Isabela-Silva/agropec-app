import { api } from './api';
import type { ApiError, ApiResponse } from './interfaces/api';
import type { ICreateUser, IUpdateUser, IUser } from './interfaces/user';

export class UserService {
  static async getAll(): Promise<IUser[]> {
    try {
      const response = await api.get<ApiResponse<IUser[]>>('/users');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getById(uuid: string): Promise<IUser> {
    try {
      const response = await api.get<ApiResponse<IUser>>(`/users/${uuid}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async create(userData: ICreateUser): Promise<IUser> {
    try {
      const response = await api.post<ApiResponse<IUser>>('/users/signup', userData);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async update(uuid: string, userData: IUpdateUser): Promise<IUser> {
    try {
      const response = await api.patch<ApiResponse<IUser>>(`/users/${uuid}`, userData);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error as ApiError;
    }
  }

  static async delete(uuid: string): Promise<void> {
    try {
      await api.delete(`/users/${uuid}`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Métodos específicos documentados na API
  static async updateActivities(uuid: string, activitiesId: string[]): Promise<IUser> {
    try {
      const response = await api.patch<IUser>(`/users/${uuid}/activities`, {
        activitiesId,
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async updateStands(uuid: string, standsId: string[]): Promise<IUser> {
    try {
      const response = await api.patch<IUser>(`/users/${uuid}/stands`, {
        standsId,
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async removeActivities(uuid: string, activitiesId: string[]): Promise<IUser> {
    try {
      const response = await api.patch<IUser>(`/users/${uuid}/activities/remove`, {
        activitiesId,
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async removeStands(uuid: string, standsId: string[]): Promise<IUser> {
    try {
      const response = await api.patch<IUser>(`/users/${uuid}/stands/remove`, {
        standsId,
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar estatísticas do dashboard (se implementado no backend)
  static async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  }> {
    try {
      const response = await api.get<
        ApiResponse<{
          total: number;
          active: number;
          inactive: number;
          newThisMonth: number;
        }>
      >('/users/stats');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
}
