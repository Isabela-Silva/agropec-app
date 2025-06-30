import { api } from './api';
import type { ApiError } from './interfaces/api';
import type { ICategoryResponse, ICreateCategory } from './interfaces/category';

export class CategoryService {
  static async getAll(): Promise<ICategoryResponse[]> {
    try {
      const response = await api.get<ICategoryResponse[]>('/categories');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getById(uuid: string): Promise<ICategoryResponse> {
    try {
      const response = await api.get<ICategoryResponse>(`/categories/${uuid}`);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async create(categoryData: ICreateCategory): Promise<ICategoryResponse> {
    try {
      const response = await api.post<ICategoryResponse>('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async update(uuid: string, categoryData: { name: string }): Promise<ICategoryResponse> {
    try {
      const response = await api.put<ICategoryResponse>(`/categories/${uuid}`, categoryData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async delete(uuid: string): Promise<void> {
    try {
      await api.delete(`/categories/${uuid}`);
    } catch (error) {
      throw error as ApiError;
    }
  }
}
