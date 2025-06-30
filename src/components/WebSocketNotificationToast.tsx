import { Bell, Calendar, Store, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { INotificationItem } from '../services/interfaces/userNotification';

interface WebSocketNotificationToastProps {
  notification: INotificationItem;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function WebSocketNotificationToast({
  notification,
  onClose,
  autoClose = true,
  autoCloseDelay = 6000,
}: WebSocketNotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Aguarda animação de saída
  }, [onClose]);

  useEffect(() => {
    // Anima entrada
    setIsVisible(true);

    // Auto close
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, handleClose]);

  const getIcon = () => {
    if (notification.isGlobal) {
      return <Bell className="h-5 w-5" />;
    } else {
      switch (notification.eventType) {
        case 'activity':
          return <Calendar className="h-5 w-5" />;
        case 'stand':
          return <Store className="h-5 w-5" />;
        default:
          return <Bell className="h-5 w-5" />;
      }
    }
  };

  const getColors = () => {
    if (notification.isGlobal) {
      return {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        text: 'text-white',
        icon: 'text-blue-100',
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-green-500 to-green-600',
        text: 'text-white',
        icon: 'text-green-100',
      };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`fixed right-4 top-4 z-50 max-w-sm transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`rounded-lg shadow-xl ${colors.bg} border border-white/20 p-4 backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          <div className={`rounded-full p-2 ${colors.icon} bg-white/20`}>{getIcon()}</div>

          <div className="min-w-0 flex-1">
            {notification.isGlobal && notification.title && (
              <h3 className={`text-sm font-bold ${colors.text}`}>{notification.title}</h3>
            )}
            <p
              className={`text-sm ${colors.text} ${notification.isGlobal && notification.title ? 'opacity-90' : 'font-medium'}`}
            >
              {notification.message}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {notification.isGlobal && (
                <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                  Global
                </span>
              )}
              <span className={`text-xs ${colors.text} opacity-75`}>Agora mesmo</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className={`rounded-full p-1 transition-colors hover:bg-white/20 ${colors.text}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
