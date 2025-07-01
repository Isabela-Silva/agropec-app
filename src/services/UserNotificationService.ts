import { api } from './api';
import type { ApiError, ApiResponse } from './interfaces/api';
import type { IGlobalNotification, INotificationItem, IUserNotification } from './interfaces/userNotification';

export class UserNotificationService {
  // Buscar notificações pessoais do usuário
  static async getUserNotifications(userId: string): Promise<IUserNotification[]> {
    try {
      const response = await api.get<ApiResponse<IUserNotification[]>>(`/users/${userId}/notifications`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Buscar notificações globais
  static async getGlobalNotifications(): Promise<IGlobalNotification[]> {
    try {
      const response = await api.get<ApiResponse<IGlobalNotification[]>>('/notifications/delivered');
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Buscar todas as notificações (globais + pessoais)
  static async getAllNotifications(userId: string): Promise<INotificationItem[]> {
    try {
      const [globalNotifications, userNotifications] = await Promise.all([
        this.getGlobalNotifications(),
        this.getUserNotifications(userId),
      ]);

      // Converter notificações globais para formato unificado
      const globalItems: INotificationItem[] = globalNotifications.map((notification) => ({
        uuid: notification.uuid,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: notification.status,
        createdAt: notification.createdAt,
        isGlobal: true,
        targetAudience: notification.targetAudience,
      }));

      // Converter notificações pessoais para formato unificado
      const userItems: INotificationItem[] = userNotifications.map((notification) => ({
        uuid: notification.uuid,
        message: notification.message,
        eventType: notification.eventType,
        status: notification.status,
        createdAt: notification.createdAt,
        isGlobal: false,
        eventId: notification.eventId,
        userId: notification.userId,
        scheduledFor: notification.scheduledFor,
      }));

      // Combinar e ordenar por data de criação (mais recentes primeiro)
      const allNotifications = [...globalItems, ...userItems];
      return allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getUnreadNotifications(userId: string): Promise<IUserNotification[]> {
    try {
      const response = await api.get<ApiResponse<IUserNotification[]>>(`/users/${userId}/notifications/unread`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      await api.patch(`/users/${userId}/notifications/${notificationId}/read`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async markAllAsRead(userId: string): Promise<{ markedCount: number }> {
    try {
      const response = await api.patch<ApiResponse<{ markedCount: number }>>(`/users/${userId}/notifications/read-all`);
      return response.data.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}/notifications/${notificationId}`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async deleteAllNotifications(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}/notifications`);
    } catch (error) {
      throw error as ApiError;
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);
      return unreadNotifications.length;
    } catch (error) {
      throw error as ApiError;
    }
  }
}
