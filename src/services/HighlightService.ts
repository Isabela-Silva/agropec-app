import { api } from './api';
import { IHighlightWithDetails } from './interfaces/highlight';

export class HighlightService {
  static async getAllHighlights(): Promise<IHighlightWithDetails[]> {
    const response = await api.get('/highlights/with-details');
    return response.data.data;
  }
} 