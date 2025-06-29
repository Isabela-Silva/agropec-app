import { api } from './api';
import { IActivityResponse } from './interfaces/activity';

export class ActivityService {
  static async getAllActivities(): Promise<IActivityResponse[]> {
    const response = await api.get('/activities');
    return response.data.data || response.data;
  }

  static async getActivityById(id: string): Promise<IActivityResponse> {
    console.log('ActivityService: Buscando atividade por ID:', id);
    
    try {
      // Primeira tentativa: endpoint com uuid
      const response = await api.get(`/activities/uuid/${id}`);
      console.log('ActivityService: Atividade encontrada via /activities/uuid/:', response.data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.log('ActivityService: Falha no endpoint /activities/uuid/, tentando /activities/:id');
      try {
        // Segunda tentativa: endpoint direto
        const response = await api.get(`/activities/${id}`);
        console.log('ActivityService: Atividade encontrada via /activities/:id:', response.data);
        return response.data.data || response.data;
      } catch (secondError: any) {
        console.error('ActivityService: Erro ao buscar atividade por ID:', secondError);
        throw secondError;
      }
    }
  }

  static async searchActivities(query: string): Promise<IActivityResponse[]> {
    try {
      console.log('ActivityService: Iniciando busca por atividades com query:', query);
      
      const response = await api.get(`/activities/name?name=${encodeURIComponent(query)}`);
      
      const result = response.data.data || response.data;
      console.log('ActivityService: Resultado da busca:', result);
      console.log('ActivityService: Tipo do resultado:', typeof result, Array.isArray(result));
      
      // Garantir que sempre retorne um array
      if (result && !Array.isArray(result)) {
        console.log('ActivityService: Convertendo objeto único para array');
        return [result];
      }
      
      return Array.isArray(result) ? result : [];
    } catch (error: any) {
      console.error('ActivityService: Erro na busca de atividades:', error);
      console.error('ActivityService: Response status:', error.response?.status);
      console.error('ActivityService: Response data:', error.response?.data);
      return []; // Retornar array vazio em caso de erro
    }
  }

  static async getActivitiesByInterest(interest: string): Promise<IActivityResponse[]> {
    try {
      const response = await api.get(`/activities/interest?interest=${encodeURIComponent(interest)}`);
      const result = response.data.data || response.data;
      return Array.isArray(result) ? result : [];
    } catch (error: any) {
      console.error('ActivityService: Erro ao buscar atividades por interesse:', error);
      return [];
    }
  }
} 