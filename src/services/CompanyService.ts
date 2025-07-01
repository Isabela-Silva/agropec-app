import { api } from './api';
import type { ApiError, ApiResponse } from './interfaces/api';
import type { ICompanyResponse, ICreateCompany, IUpdateCompany } from './interfaces/company';

export class CompanyService {
  static async getAll(): Promise<ICompanyResponse[]> {
    try {
      const response = await api.get<ICompanyResponse[]>('/companies');
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getById(uuid: string): Promise<ICompanyResponse> {
    try {
      const response = await api.get<ICompanyResponse>(`/companies/${uuid}`);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async create(companyData: ICreateCompany): Promise<ICompanyResponse> {
    try {
      const response = await api.post<ICompanyResponse>('/companies', companyData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async update(uuid: string, companyData: IUpdateCompany): Promise<ICompanyResponse> {
    try {
      const response = await api.put<ICompanyResponse>(`/companies/${uuid}`, companyData);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async delete(uuid: string): Promise<void> {
    try {
      await api.delete(`/companies/${uuid}`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar estatísticas do dashboard (se implementado no backend)
  static async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    try {
      const response = await api.get<
        ApiResponse<{
          total: number;
          active: number;
          inactive: number;
        }>
      >('/companies/stats');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
}
