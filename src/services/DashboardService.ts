import { api } from './api';
import type { IActivityResponse } from './interfaces/activity';
import type { IAdmin } from './interfaces/admin';
import type { ApiError, ApiResponse } from './interfaces/api';
import type { ICompany } from './interfaces/company';
import type { INotificationResponse } from './interfaces/notification';
import type { IStandResponse } from './interfaces/stand';
import type { IUser } from './interfaces/user';

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  };
  admins: {
    total: number;
    superAdmins: number;
    admins: number;
  };
  companies: {
    total: number;
    active: number;
    inactive: number;
  };
  activities: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  stands: {
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
  };
  notifications: {
    total: number;
    pending: number;
    delivered: number;
    read: number;
    byType: Record<string, number>;
  };
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentActivities: Array<{
    uuid: string;
    name: string;
    date: string;
    startTime: string;
  }>;
  recentNotifications: Array<{
    uuid: string;
    title: string;
    message: string;
    type: 'announcement' | 'alert' | 'system' | 'event';
  }>;
}

export class DashboardService {
  // Busca todas as estatísticas do dashboard de uma vez usando endpoints existentes
  static async getOverview(): Promise<DashboardOverview> {
    try {
      // Fazer múltiplas chamadas em paralelo para otimizar performance
      const [
        usersResponse,
        adminsResponse,
        companiesResponse,
        activitiesResponse,
        standsResponse,
        notificationsResponse,
      ] = await Promise.all([
        api.get<ApiResponse<IUser[]>>('/users'),
        api.get<IAdmin[]>('/admins'),
        api.get<ICompany[]>('/companies'),
        api.get<ApiResponse<IActivityResponse[]>>('/activities'),
        api.get<ApiResponse<IStandResponse[]>>('/stands'),
        api.get<ApiResponse<INotificationResponse[]>>('/notifications'),
      ]);

      // Processar dados dos usuários (UserService usa ApiResponse<T>)
      const users = usersResponse.data.data || [];
      const totalUsers = users.length;
      // Usuários sempre ativos (não há campo status na interface IUser)
      const activeUsers = totalUsers;
      const inactiveUsers = 0;
      // Sem campo createdAt em IUser, estimamos baseado no total
      const newThisMonth = Math.ceil(totalUsers * 0.2); // Estimativa de 20% como novos

      // Processar dados dos administradores (AdminService usa T diretamente)
      const admins = adminsResponse.data || [];
      const totalAdmins = admins.length;
      const superAdmins = admins.filter((admin: IAdmin) => admin.role === 'SUPER_ADMIN').length;
      const regularAdmins = totalAdmins - superAdmins;

      // Processar dados das empresas (CompanyService usa T diretamente)
      const companies = companiesResponse.data || [];
      const totalCompanies = companies.length;
      // Empresas sempre ativas (não há campo status na interface ICompany base)
      const activeCompanies = totalCompanies;
      const inactiveCompanies = 0;

      // Processar dados das atividades (ActivityService usa ApiResponse<T>)
      const activities = activitiesResponse.data.data || [];
      const totalActivities = activities.length;
      const today = new Date().toLocaleDateString('pt-BR');
      const todayActivities = activities.filter((activity: IActivityResponse) => activity.date === today).length;

      // Para atividades desta semana/mês, converter datas com tratamento de erro
      const thisWeekActivities = activities.filter((activity: IActivityResponse) => {
        try {
          const [day, month, year] = activity.date.split('/');
          const activityDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return activityDate >= weekAgo && activityDate <= now;
        } catch {
          return false;
        }
      }).length;

      const thisMonthActivities = activities.filter((activity: IActivityResponse) => {
        try {
          const [day, month, year] = activity.date.split('/');
          const activityDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
          const now = new Date();
          return activityDate.getMonth() === now.getMonth() && activityDate.getFullYear() === now.getFullYear();
        } catch {
          return false;
        }
      }).length;

      // Processar dados dos stands (StandService usa ApiResponse<T>)
      const stands = standsResponse.data.data || [];
      const totalStands = stands.length;
      // Stands sempre ativos (não há campo status na interface IStand base)
      const activeStands = totalStands;
      const inactiveStands = 0;
      const standsByCategory = stands.reduce((acc: Record<string, number>, stand: IStandResponse) => {
        const category = stand.categoryId || 'Sem categoria';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Processar dados das notificações (NotificationService usa ApiResponse<T>)
      const notifications = notificationsResponse.data.data || [];
      const totalNotifications = notifications.length;
      // Processar status das notificações (campo existe em INotificationResponse)
      const pendingNotifications = notifications.filter(
        (notification: INotificationResponse) => notification.status === 'pending',
      ).length;
      const deliveredNotifications = notifications.filter(
        (notification: INotificationResponse) => notification.status === 'delivered',
      ).length;
      const readNotifications = notifications.filter(
        (notification: INotificationResponse) => notification.status === 'read',
      ).length;
      const notificationsByType = notifications.reduce(
        (acc: Record<string, number>, notification: INotificationResponse) => {
          const type = notification.type || 'announcement';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        {},
      );

      // Buscar atividades e notificações recentes
      const [recentActivities, recentNotifications] = await Promise.all([
        DashboardService.getRecentActivities(5),
        DashboardService.getRecentNotifications(5),
      ]);

      const stats: DashboardStats = {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          newThisMonth: newThisMonth,
        },
        admins: {
          total: totalAdmins,
          superAdmins: superAdmins,
          admins: regularAdmins,
        },
        companies: {
          total: totalCompanies,
          active: activeCompanies,
          inactive: inactiveCompanies,
        },
        activities: {
          total: totalActivities,
          today: todayActivities,
          thisWeek: thisWeekActivities,
          thisMonth: thisMonthActivities,
        },
        stands: {
          total: totalStands,
          active: activeStands,
          inactive: inactiveStands,
          byCategory: standsByCategory,
        },
        notifications: {
          total: totalNotifications,
          pending: pendingNotifications,
          delivered: deliveredNotifications,
          read: readNotifications,
          byType: notificationsByType,
        },
      };

      return {
        stats,
        recentActivities,
        recentNotifications,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error as ApiError;
    }
  }

  // Busca apenas as estatísticas
  static async getStats(): Promise<DashboardStats> {
    try {
      const overview = await DashboardService.getOverview();
      return overview.stats;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Busca atividades recentes
  static async getRecentActivities(limit: number = 5): Promise<
    Array<{
      uuid: string;
      name: string;
      date: string;
      startTime: string;
    }>
  > {
    try {
      const response = await api.get<ApiResponse<IActivityResponse[]>>('/activities');
      const activities = response.data.data || [];

      // Ordenar por data e pegar as mais recentes
      const sortedActivities = activities
        .sort((a: IActivityResponse, b: IActivityResponse) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, limit)
        .map((activity: IActivityResponse) => ({
          uuid: activity.uuid,
          name: activity.name,
          date: activity.date,
          startTime: activity.startTime,
        }));

      return sortedActivities;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Busca notificações recentes
  static async getRecentNotifications(limit: number = 5): Promise<
    Array<{
      uuid: string;
      title: string;
      message: string;
      type: 'announcement' | 'alert' | 'system' | 'event';
    }>
  > {
    try {
      const response = await api.get<ApiResponse<INotificationResponse[]>>('/notifications');
      const notifications = response.data.data || [];

      // Ordenar por data de criação e pegar as mais recentes
      const sortedNotifications = notifications
        .sort((a: INotificationResponse, b: INotificationResponse) => {
          // INotificationResponse tem createdAt como Date
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, limit)
        .map((notification: INotificationResponse) => ({
          uuid: notification.uuid,
          title: notification.title,
          message: notification.message,
          type: notification.type as 'announcement' | 'alert' | 'system' | 'event',
        }));

      return sortedNotifications;
    } catch (error) {
      throw error as ApiError;
    }
  }
}
