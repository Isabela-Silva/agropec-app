import { useQueryClient } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useUserAuth } from '../hooks/useUserAuth';
import { INotificationItem } from '../services/interfaces/userNotification';
import { WebSocketNotificationToast } from './WebSocketNotificationToast';

interface SafeNotificationProviderProps {
  children: ReactNode;
}

export function SafeNotificationProvider({ children }: SafeNotificationProviderProps) {
  const { user } = useUserAuth();
  const queryClient = useQueryClient();
  const [activeToasts, setActiveToasts] = useState<INotificationItem[]>([]);

  useEffect(() => {
    if (!user?.uuid) return;

    let socket: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;

    const connect = () => {
      try {
        // Usar a mesma lógica do interceptor da API
        const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');

        if (!token) {
          console.error('❌ Nenhum token disponível');
          return;
        }

        const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
        const wsUrl = `${baseUrl}?token=${encodeURIComponent(token)}`;

        console.log('🌐 Conectando WebSocket:', wsUrl);

        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('✅ WebSocket conectado');
          reconnectAttempts = 0;
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'notification' || data.uuid) {
              const notification: INotificationItem = data.type === 'notification' ? data.data : data;
              console.log('📨 Nova notificação:', notification);

              // Adiciona toast
              setActiveToasts((prev) => [...prev, notification]);

              // Atualiza badge
              queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
            }
          } catch (error) {
            console.error('❌ Erro ao processar notificação:', error);
          }
        };

        socket.onclose = (event) => {
          console.log('🔌 WebSocket desconectado:', event.code, event.reason);
          socket = null;

          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            setTimeout(connect, 2000 * reconnectAttempts);
          }
        };

        socket.onerror = (error) => {
          console.error('❌ Erro WebSocket:', error);
        };
      } catch (error) {
        console.error('❌ Erro ao conectar WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (socket) {
        socket.close();
        socket = null;
      }
    };
  }, [user?.uuid, queryClient]);

  const removeToast = (notificationId: string) => {
    setActiveToasts((prev) => prev.filter((n) => n.uuid !== notificationId));
  };

  return (
    <>
      {children}

      {/* Toasts de notificação WebSocket */}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {activeToasts.map((notification) => (
          <WebSocketNotificationToast
            key={notification.uuid}
            notification={notification}
            onClose={() => removeToast(notification.uuid)}
          />
        ))}
      </div>
    </>
  );
}
