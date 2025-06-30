import { api } from './api';
import { ICreateHighlight, IHighlightWithDetails, IUpdateHighlight } from './interfaces/highlight';

export class HighlightService {
  static async getAllHighlights(): Promise<IHighlightWithDetails[]> {
    const response = await api.get('/highlights/with-details');
    return response.data.data;
  }

  static async createHighlight(data: ICreateHighlight): Promise<IHighlightWithDetails> {
    const response = await api.post('/highlights', data);
    return response.data.data;
  }

  static async updateHighlight(uuid: string, data: IUpdateHighlight): Promise<IHighlightWithDetails> {
    const response = await api.put(`/highlights/${uuid}`, data);
    return response.data.data;
  }

  static async deleteHighlight(uuid: string): Promise<void> {
    await api.delete(`/highlights/${uuid}`);
  }
}
