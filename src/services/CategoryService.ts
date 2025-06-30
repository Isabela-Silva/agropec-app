import { api } from './api';
import type { ApiError } from './interfaces/api';
import type { ICategory, ICreateCategory } from './interfaces/category';

export class CategoryService {
  static async getAll(): Promise<ICategory[]> {
    try {
      const response = await api.get<ICategory[]>('/categories');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getById(uuid: string): Promise<ICategory> {
    try {
      const response = await api.get<ICategory>(`/categories/${uuid}`);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async create(categoryData: ICreateCategory): Promise<ICategory> {
    try {
      const response = await api.post<ICategory>('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async update(uuid: string, categoryData: { name: string }): Promise<ICategory> {
    try {
      const response = await api.put<ICategory>(`/categories/${uuid}`, categoryData);
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
