import { api } from './api';
import type { ApiError, ApiResponse } from './interfaces/api';
import type { ICreateNotification, INotificationResponse, IUpdateNotification } from './interfaces/notification';

export class NotificationService {
  static async getAll(): Promise<INotificationResponse[]> {
    try {
      const response = await api.get<ApiResponse<INotificationResponse[]>>('/notifications');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getById(uuid: string): Promise<INotificationResponse> {
    try {
      const response = await api.get<ApiResponse<INotificationResponse>>(`/notifications/${uuid}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async create(notificationData: ICreateNotification): Promise<INotificationResponse> {
    try {
      const response = await api.post<ApiResponse<INotificationResponse>>('/notifications', notificationData);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async update(uuid: string, notificationData: IUpdateNotification): Promise<INotificationResponse> {
    try {
      const response = await api.put<ApiResponse<INotificationResponse>>(`/notifications/${uuid}`, notificationData);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async delete(uuid: string): Promise<void> {
    try {
      await api.delete(`/notifications/${uuid}`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Métodos específicos documentados na API
  static async getScheduled(): Promise<
    Array<{
      userId: string;
      eventId: string;
      type: string;
      nextInvocation: Date | null;
      userName?: string;
      eventName?: string;
      eventType: 'activity' | 'stand';
      notificationType?: string;
    }>
  > {
    try {
      const response = await api.get<
        ApiResponse<
          Array<{
            userId: string;
            eventId: string;
            type: string;
            nextInvocation: Date | null;
            userName?: string;
            eventName?: string;
            eventType: 'activity' | 'stand';
            notificationType?: string;
          }>
        >
      >('/notifications/scheduled');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar notificações recentes (se implementado no backend)
  static async getRecent(): Promise<INotificationResponse[]> {
    try {
      const response = await api.get<ApiResponse<INotificationResponse[]>>('/notifications/recent');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar notificações por tipo (se implementado no backend)
  static async getByType(type: 'announcement' | 'alert' | 'system' | 'event'): Promise<INotificationResponse[]> {
    try {
      const response = await api.get<ApiResponse<INotificationResponse[]>>(`/notifications/type/${type}`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Método para buscar estatísticas do dashboard (se implementado no backend)
  static async getStats(): Promise<{
    total: number;
    pending: number;
    delivered: number;
    read: number;
    byType: Record<string, number>;
  }> {
    try {
      const response = await api.get<
        ApiResponse<{
          total: number;
          pending: number;
          delivered: number;
          read: number;
          byType: Record<string, number>;
        }>
      >('/notifications/stats');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }
}
