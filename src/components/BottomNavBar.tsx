import { useQuery } from '@tanstack/react-query';
import { Bell, Calendar, Home, Info, MapPin } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';
import { UserNotificationService } from '../services';
import type { INotificationItem } from '../services/interfaces/userNotification';

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  const { user } = useUserAuth();

  // Busca notificações não lidas
  const { data: notifications } = useQuery({
    queryKey: ['user-notifications', user?.uuid],
    queryFn: () => (user?.uuid ? UserNotificationService.getAllNotifications(user.uuid) : Promise.resolve([])),
    enabled: !!user?.uuid,
    refetchInterval: 30000, // Recarrega a cada 30 segundos
  });

  // Contar apenas notificações PESSOAIS não lidas (globais não contam)
  const unreadCount = notifications?.filter((n: INotificationItem) => !n.isGlobal && n.status !== 'read').length || 0;

  const navItems = [
    { path: '/explore', icon: Home },
    { path: '/agenda', icon: Calendar },
    { path: '/map', icon: MapPin },
    { path: '/notificacoes', icon: Bell, badge: unreadCount },
    { path: '/info', icon: Info },
  ];

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md">
      <div className="flex items-center justify-around rounded-full bg-green-500 px-6 py-4 shadow-lg shadow-base-gray-light">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
          const hasBadge = !!item.badge && item.badge > 0;

          return (
            <div key={item.path} className="relative flex items-center justify-center">
              <Icon
                className={`h-6 w-6 cursor-pointer transition-colors ${
                  isActive ? 'text-base-white' : 'text-base-gray-light'
                }`}
                onClick={() => navigate(item.path)}
              />
              {hasBadge && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;
