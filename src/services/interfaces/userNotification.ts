import { z } from 'zod';

// Interface para notificações pessoais do usuário
export const UserNotificationSchema = z.object({
  uuid: z.string().uuid(),
  userId: z.string().uuid(),
  message: z.string(),
  eventId: z.string().uuid(),
  eventType: z.enum(['activity', 'stand']),
  scheduledFor: z.string().or(z.date()),
  status: z.enum(['pending', 'delivered', 'read']),
  createdAt: z.string().or(z.date()),
});

// Interface para notificações globais
export const GlobalNotificationSchema = z.object({
  _id: z.string().optional(),
  uuid: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['announcement', 'alert', 'system', 'event']),
  isScheduled: z.boolean(),
  status: z.enum(['pending', 'delivered', 'read']),
  date: z.string(),
  time: z.string(),
  targetAudience: z.array(z.string()),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional(),
});

// Interface unificada para exibição
export interface INotificationItem {
  uuid: string;
  title?: string; // Para notificações globais
  message: string;
  type?: 'announcement' | 'alert' | 'system' | 'event'; // Para notificações globais
  eventType?: 'activity' | 'stand'; // Para notificações pessoais
  status: 'pending' | 'delivered' | 'read';
  createdAt: string | Date;
  isGlobal: boolean; // Flag para identificar o tipo
  targetAudience?: string[]; // Para notificações globais
  eventId?: string; // Para notificações pessoais
  userId?: string; // Para notificações pessoais
  scheduledFor?: string | Date; // Para notificações pessoais
}

export type IUserNotification = z.infer<typeof UserNotificationSchema>;
export type IGlobalNotification = z.infer<typeof GlobalNotificationSchema>;
