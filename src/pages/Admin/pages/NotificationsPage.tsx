import { AlertCircle, Bell, Calendar, Edit2, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import type { Notification } from '../types';

export function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      uuid: '1',
      title: 'Bem-vindos ao AgroPec 2024',
      message: 'Feira começa amanhã às 8h!',
      type: 'announcement',
      isScheduled: false,
      status: 'delivered',
      date: '2024-03-15',
      time: '08:00',
      targetAudience: ['all'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uuid: '2',
      title: 'Alerta de Chuva',
      message: 'Possibilidade de chuva no período da tarde',
      type: 'alert',
      isScheduled: true,
      status: 'pending',
      date: '2024-03-16',
      time: '12:00',
      targetAudience: ['visitors'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const filteredNotifications = notifications.filter(
    (notification: Notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    // TODO: Implementar modal de criação
    console.log('Criar notificação');
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta notificação?')) {
      setIsSubmitting(true);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notification) => notification.uuid !== uuid));
        setIsSubmitting(false);
      }, 500);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar notificações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Notificação</span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div key={notification.uuid} className="card">
            <div className="flex items-start space-x-4">
              <div className="mt-1 flex-shrink-0">{getTypeIcon(notification.type)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                    <p className="mt-1 text-gray-600">{notification.message}</p>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <button
                      onClick={() => console.log('Editar notificação:', notification.uuid)}
                      className="text-admin-primary-600 hover:text-admin-primary-900 hover:bg-admin-primary-50 rounded-md p-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(notification.uuid)}
                      className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                      {notification.date} às {notification.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{notification.targetAudience.join(', ')}</span>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(notification.status)}`}
                  >
                    {notification.status}
                  </span>
                  {notification.isScheduled && (
                    <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      Agendada
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="card p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma notificação encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando uma nova notificação.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
