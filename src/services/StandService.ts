import { api } from './api';
import type { ApiError, ApiResponse } from './interfaces/api';
import type { ICreateStand, IStandResponse, IStandWithCompanyResponse, IUpdateStand } from './interfaces/stand';

export class StandService {
  static async getAll(): Promise<IStandResponse[]> {
    try {
      const response = await api.get<ApiResponse<IStandResponse[]>>('/stands');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getById(uuid: string): Promise<IStandWithCompanyResponse> {
    try {
      const response = await api.get<ApiResponse<IStandWithCompanyResponse>>(`/stands/uuid/${uuid}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async create(data: ICreateStand | FormData): Promise<IStandResponse> {
    try {
      // SEMPRE usa FormData - a API espera multipart
      let formData: FormData;

      if (data instanceof FormData) {
        formData = data;
      } else {
        // Converte objeto para FormData
        formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
      }

      const response = await api.post<ApiResponse<IStandResponse>>('/stands', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  /**
   * Atualiza um stand com dados e/ou imagens
   * @param uuid - ID do stand
   * @param data - Dados do stand (pode ser objeto ou FormData)
   * @param imageIds - Array com IDs das imagens que devem ser mantidas (opcional)
   * @param newImages - Novas imagens a serem adicionadas (opcional)
   */
  static async update(
    uuid: string,
    data: IUpdateStand | FormData,
    imageIds?: string[],
    newImages?: File[],
  ): Promise<IStandResponse> {
    try {
      // SEMPRE usa FormData - a API espera multipart
      let formData: FormData;

      // Se já for FormData, usa ele diretamente
      if (data instanceof FormData) {
        formData = data;
      } else {
        // Se for objeto, converte para FormData
        formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
      }

      // Adiciona gerenciamento de imagens se fornecido
      if (imageIds !== undefined) {
        formData.append('imageIds', JSON.stringify(imageIds));
      }

      if (newImages && newImages.length > 0) {
        newImages.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await api.put<ApiResponse<IStandResponse>>(`/stands/${uuid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [],
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro no StandService.update:', error);
      throw error as ApiError;
    }
  }

  static async delete(uuid: string): Promise<void> {
    try {
      await api.delete(`/stands/${uuid}`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Métodos específicos documentados na API
  static async getByCategory(category: string): Promise<IStandResponse[]> {
    try {
      const response = await api.get<ApiResponse<IStandResponse[]>>(`/stands/category/${category}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getByName(name: string): Promise<IStandResponse> {
    try {
      const response = await api.get<ApiResponse<IStandResponse>>(`/stands/name/${name}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getByDate(date: string): Promise<IStandResponse[]> {
    try {
      const response = await api.get<ApiResponse<IStandResponse[]>>(`/stands/date/${date}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getByInterest(interest: string): Promise<IStandResponse[]> {
    try {
      const response = await api.get<ApiResponse<IStandResponse[]>>(`/stands/interest/${interest}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar stands por empresa (se implementado no backend)
  static async getByCompany(companyId: string): Promise<IStandResponse[]> {
    try {
      const response = await api.get<ApiResponse<IStandResponse[]>>(`/stands/company/${companyId}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar estatísticas do dashboard (se implementado no backend)
  static async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
  }> {
    try {
      const response = await api.get<
        ApiResponse<{
          total: number;
          active: number;
          inactive: number;
          byCategory: Record<string, number>;
        }>
      >('/stands/stats');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
}
