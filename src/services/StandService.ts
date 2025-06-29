import { api } from './api';
import { IStandResponse } from './interfaces/stand';

export class StandService {
  static async getAllStands(): Promise<IStandResponse[]> {
    const response = await api.get('/stands');
    return response.data.data || response.data;
  }

  static async getStandById(id: string): Promise<IStandResponse> {
    console.log('StandService: Buscando stand por ID:', id);
    
    try {
      // Primeira tentativa: endpoint com uuid
      const response = await api.get(`/stands/uuid/${id}`);
      console.log('StandService: Stand encontrado via /stands/uuid/:', response.data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.log('StandService: Falha no endpoint /stands/uuid/, tentando /stands/:id');
      try {
        // Segunda tentativa: endpoint direto
        const response = await api.get(`/stands/${id}`);
        console.log('StandService: Stand encontrado via /stands/:id:', response.data);
        return response.data.data || response.data;
      } catch (secondError: any) {
        console.error('StandService: Erro ao buscar stand por ID:', secondError);
        throw secondError;
      }
    }
  }

  static async searchStands(query: string): Promise<IStandResponse[]> {
    try {
      console.log('StandService: Iniciando busca por stands com query:', query);
      
      // Tentar diferentes endpoints de busca
      let response;
      try {
        // Primeira tentativa: busca por nome exato (retorna um objeto único)
        response = await api.get(`/stands/name/${encodeURIComponent(query)}`);
        console.log('StandService: Busca por nome exato bem-sucedida');
        
        const result = response.data.data || response.data;
        console.log('StandService: Resultado da busca por nome:', result);
        
        // Se retornou um objeto único, converter para array
        if (result && !Array.isArray(result)) {
          console.log('StandService: Convertendo objeto único para array');
          return [result];
        }
        
        return result || [];
        
      } catch (error: any) {
        console.log('StandService: Falha na busca por nome exato, tentando busca por categoria...');
        try {
          // Segunda tentativa: busca por categoria (retorna array)
          response = await api.get(`/stands/category/${encodeURIComponent(query)}`);
          console.log('StandService: Busca por categoria bem-sucedida');
          
          const result = response.data.data || response.data;
          console.log('StandService: Resultado da busca por categoria:', result);
          return Array.isArray(result) ? result : [];
          
        } catch (secondError: any) {
          console.log('StandService: Falha na busca por categoria, tentando busca por interesse...');
          // Terceira tentativa: busca por interesse (retorna array)
          response = await api.get(`/stands/interest/${encodeURIComponent(query)}`);
          console.log('StandService: Busca por interesse bem-sucedida');
          
          const result = response.data.data || response.data;
          console.log('StandService: Resultado da busca por interesse:', result);
          return Array.isArray(result) ? result : [];
        }
      }
    } catch (error: any) {
      console.error('StandService: Erro na busca de stands:', error);
      console.error('StandService: Response status:', error.response?.status);
      console.error('StandService: Response data:', error.response?.data);
      return []; // Retornar array vazio em caso de erro
    }
  }
} 