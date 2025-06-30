import { api } from './api';
import type { IActivityResponse, ICreateActivity, IUpdateActivity } from './interfaces/activity';
import type { ApiError, ApiResponse } from './interfaces/api';

export class ActivityService {
  static async getAll(): Promise<IActivityResponse[]> {
    try {
      const response = await api.get<ApiResponse<IActivityResponse[]>>('/activities');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getById(uuid: string): Promise<IActivityResponse> {
    try {
      const response = await api.get<ApiResponse<IActivityResponse>>(`/activities/uuid/${uuid}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async create(data: ICreateActivity | FormData): Promise<IActivityResponse> {
    try {
      const config = {
        headers: {
          'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      };

      const response = await api.post<ApiResponse<IActivityResponse>>('/activities', data, config);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error as ApiError;
    }
  }

  /**
   * Atualiza uma atividade com dados e/ou imagens
   * @param uuid - ID da atividade
   * @param data - Dados da atividade (pode ser objeto ou FormData)
   * @param imageIds - Array com IDs das imagens que devem ser mantidas (opcional)
   * @param newImages - Novas imagens a serem adicionadas (opcional)
   */
  static async update(
    uuid: string,
    data: IUpdateActivity | FormData,
    imageIds?: string[],
    newImages?: File[],
  ): Promise<IActivityResponse> {
    try {
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

      const response = await api.put<ApiResponse<IActivityResponse>>(`/activities/${uuid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [],
      });
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async delete(uuid: string): Promise<void> {
    try {
      await api.delete(`/activities/${uuid}`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Métodos específicos documentados na API
  static async getByCategory(categoryId: string): Promise<IActivityResponse[]> {
    try {
      const response = await api.get<ApiResponse<IActivityResponse[]>>(`/activities/category/${categoryId}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getByName(name: string): Promise<IActivityResponse[]> {
    try {
      const response = await api.get<ApiResponse<IActivityResponse[]>>(
        `/activities/name?name=${encodeURIComponent(name)}`,
      );
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getByDate(date: string): Promise<IActivityResponse[]> {
    try {
      const response = await api.get<ApiResponse<IActivityResponse[]>>(`/activities/date/${date}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getByInterest(interest: string): Promise<IActivityResponse[]> {
    try {
      const response = await api.get<ApiResponse<IActivityResponse[]>>(
        `/activities/interest?interest=${encodeURIComponent(interest)}`,
      );
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar atividades recentes (se implementado no backend)
  static async getRecent(): Promise<IActivityResponse[]> {
    try {
      const response = await api.get<ApiResponse<IActivityResponse[]>>('/activities/recent');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar estatísticas do dashboard (se implementado no backend)
  static async getStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    try {
      const response = await api.get<
        ApiResponse<{
          total: number;
          today: number;
          thisWeek: number;
          thisMonth: number;
        }>
      >('/activities/stats');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
}
