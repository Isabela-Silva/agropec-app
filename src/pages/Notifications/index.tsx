import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Bell, Calendar, Check, CheckCheck, Loader2, Store, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import Header from '../../components/Header';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserNotificationService } from '../../services/UserNotificationService';
import type { INotificationItem } from '../../services/interfaces/userNotification';
import { toastUtils } from '../../utils/toast';

export function NotificationsScreen() {
  const { user } = useUserAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unread' | 'read'>('all');

  // Query para buscar todas as notificações (globais + pessoais)
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allNotifications', user?.uuid],
    queryFn: () => UserNotificationService.getAllNotifications(user!.uuid),
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  // Filtrar notificações baseado no status selecionado
  const filteredNotifications = notifications.filter((notification) => {
    // Para notificações globais, mostrar apenas no filtro "Todas"
    if (notification.isGlobal) {
      return selectedStatus === 'all';
    }

    // Para notificações pessoais, aplicar filtro de status
    switch (selectedStatus) {
      case 'unread':
        return notification.status === 'pending' || notification.status === 'delivered';
      case 'read':
        return notification.status === 'read';
      default:
        return true; // 'all' - mostra todas as pessoais
    }
  });

  // Mutation para marcar como lida (apenas para notificações pessoais)
  const markAsReadMutation = useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) =>
      UserNotificationService.markAsRead(user!.uuid, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
      toastUtils.success('Notificação marcada como lida!');
    },
    onError: () => {
      toastUtils.error('Erro ao marcar notificação como lida.');
    },
  });

  // Mutation para marcar todas como lidas (apenas para notificações pessoais)
  const markAllAsReadMutation = useMutation({
    mutationFn: () => UserNotificationService.markAllAsRead(user!.uuid),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
      toastUtils.success(`${data.markedCount} notificações marcadas como lidas!`);
    },
    onError: () => {
      toastUtils.error('Erro ao marcar notificações como lidas.');
    },
  });

  // Mutation para deletar notificação (apenas para notificações pessoais)
  const deleteMutation = useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) =>
      UserNotificationService.deleteNotification(user!.uuid, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
      toastUtils.success('Notificação removida!');
    },
    onError: () => {
      toastUtils.error('Erro ao remover notificação.');
    },
  });

  // Mutation para deletar todas as notificações (apenas para notificações pessoais)
  const deleteAllMutation = useMutation({
    mutationFn: () => UserNotificationService.deleteAllNotifications(user!.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
      toastUtils.success('Todas as notificações foram removidas!');
    },
    onError: () => {
      toastUtils.error('Erro ao remover notificações.');
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate({ notificationId });
  };

  const handleMarkAllAsRead = () => {
    if (window.confirm('Marcar todas as notificações pessoais como lidas?')) {
      markAllAsReadMutation.mutate();
    }
  };

  const handleDelete = (notificationId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta notificação?')) {
      deleteMutation.mutate({ notificationId });
    }
  };

  const handleDeleteAll = () => {
    if (
      window.confirm(
        'Tem certeza que deseja remover todas as suas notificações pessoais? Esta ação não pode ser desfeita.',
      )
    ) {
      deleteAllMutation.mutate();
    }
  };

  const getNotificationIcon = (notification: INotificationItem) => {
    if (notification.isGlobal) {
      // Ícones para notificações globais
      switch (notification.type) {
        case 'event':
          return <Calendar className="h-4 w-4" />;
        case 'announcement':
          return <Bell className="h-4 w-4" />;
        case 'alert':
          return <AlertCircle className="h-4 w-4" />;
        case 'system':
          return <Check className="h-4 w-4" />;
        default:
          return <Bell className="h-4 w-4" />;
      }
    } else {
      // Ícones para notificações pessoais
      switch (notification.eventType) {
        case 'activity':
          return <Calendar className="h-4 w-4" />;
        case 'stand':
          return <Store className="h-4 w-4" />;
        default:
          return <Bell className="h-4 w-4" />;
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'delivered':
        return 'bg-blue-50 text-blue-700';
      case 'read':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-base-gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'delivered':
        return 'Entregue';
      case 'read':
        return 'Lida';
      default:
        return status;
    }
  };

  const getTypeLabel = (notification: INotificationItem) => {
    if (notification.isGlobal) {
      switch (notification.type) {
        case 'announcement':
          return 'Anúncio';
        case 'alert':
          return 'Alerta';
        case 'system':
          return 'Sistema';
        case 'event':
          return 'Evento';
        default:
          return notification.type || 'Notificação';
      }
    } else {
      switch (notification.eventType) {
        case 'activity':
          return 'Atividade';
        case 'stand':
          return 'Stand';
        default:
          return notification.eventType || 'Evento';
      }
    }
  };

  const formatDate = (date: string | Date) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-base-white-light text-base-black">
        <Header title="Notificações" showBackButton={true} />
        <div className="flex min-h-[400px] items-center justify-center p-3 sm:p-4">
          <div className="text-center">
            <User className="mx-auto mb-3 h-8 w-8 text-gray-400 sm:mb-4 sm:h-12 sm:w-12" />
            <p className="text-xs text-base-gray sm:text-base">Você precisa estar logado para ver suas notificações.</p>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-base-white-light text-base-black">
        <Header title="Notificações" showBackButton={true} />
        <div className="flex min-h-[400px] items-center justify-center p-3 sm:p-4">
          <div className="text-center">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-gray-400 sm:mb-4 sm:h-8 sm:w-8" />
            <p className="text-xs text-base-gray sm:text-sm">Carregando notificações...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-base-white-light text-base-black">
        <Header title="Notificações" showBackButton={true} />
        <div className="flex min-h-[400px] items-center justify-center p-3 sm:p-4">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400 sm:mb-4 sm:h-12 sm:w-12" />
            <p className="text-xs text-base-gray sm:text-base">Erro ao carregar notificações.</p>
          </div>
        </div>
      </main>
    );
  }

  const personalNotifications = notifications.filter((n) => !n.isGlobal);
  const personalUnreadCount = personalNotifications.filter(
    (n) => n.status === 'pending' || n.status === 'delivered',
  ).length;
  const personalReadCount = personalNotifications.filter((n) => n.status === 'read').length;
  const totalCount = notifications.length;

  return (
    <main className="min-h-screen bg-base-white-light text-base-black">
      <Header title="Notificações" showBackButton={true} />

      <div className="p-3 sm:p-4">
        {/* Cabeçalho com descrição */}
        <div className="mb-4 rounded-lg bg-white p-4 shadow-sm sm:mb-6 sm:p-6">
          <h2 className="text-base font-semibold text-base-black sm:text-lg">Central de Notificações</h2>
          <p className="mt-1 text-xs text-base-gray sm:text-sm">
            Acompanhe suas notificações pessoais e os avisos gerais do evento.
          </p>
        </div>

        {/* Filtros por status */}
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
            {(['all', 'unread', 'read'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                  selectedStatus === status
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-base-gray hover:bg-gray-50'
                }`}
              >
                {status === 'all' && `Todas (${totalCount})`}
                {status === 'unread' && `Não lidas (${personalUnreadCount})`}
                {status === 'read' && `Lidas (${personalReadCount})`}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {personalUnreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50 sm:gap-2 sm:px-4 sm:text-sm"
              >
                {markAllAsReadMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                ) : (
                  <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                Marcar como lidas
              </button>
            )}

            {personalNotifications.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={deleteAllMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50 sm:gap-2 sm:px-4 sm:text-sm"
              >
                {deleteAllMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                ) : (
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                Limpar pessoais
              </button>
            )}
          </div>
        </div>

        {/* Lista de notificações */}
        <div className="space-y-3 sm:space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.uuid}
              className={`rounded-lg border-l-4 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                notification.isGlobal ? 'border-l-blue-300' : 'border-l-green-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${notification.isGlobal ? 'bg-blue-50' : 'bg-green-50'}`}>
                    <div className={`${notification.isGlobal ? 'text-blue-600' : 'text-green-600'}`}>
                      {getNotificationIcon(notification)}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    {notification.isGlobal && notification.title && (
                      <h3 className="text-sm font-semibold text-base-black sm:text-base">{notification.title}</h3>
                    )}
                    <p
                      className={`text-sm ${notification.isGlobal && notification.title ? 'text-base-gray' : 'font-medium text-base-black'} sm:text-base`}
                    >
                      {notification.message}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(notification.status)}`}
                      >
                        {getStatusLabel(notification.status)}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          notification.isGlobal ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-base-gray'
                        }`}
                      >
                        {getTypeLabel(notification)}
                      </span>
                      {notification.isGlobal && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          Global
                        </span>
                      )}
                      <span className="text-xs text-base-gray">{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!notification.isGlobal &&
                    (notification.status === 'pending' || notification.status === 'delivered') && (
                      <button
                        onClick={() => handleMarkAsRead(notification.uuid)}
                        disabled={markAsReadMutation.isPending}
                        className="rounded-full p-1.5 transition-colors hover:bg-green-50 disabled:opacity-50"
                        title="Marcar como lida"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </button>
                    )}
                  {!notification.isGlobal && (
                    <button
                      onClick={() => handleDelete(notification.uuid)}
                      disabled={deleteMutation.isPending}
                      className="rounded-full p-1.5 transition-colors hover:bg-red-50 disabled:opacity-50"
                      title="Remover notificação"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado vazio */}
        {filteredNotifications.length === 0 && (
          <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <Bell className="mx-auto mb-3 h-8 w-8 text-gray-400 sm:mb-4 sm:h-12 sm:w-12" />
              <p className="text-sm text-base-gray sm:text-base">
                {selectedStatus === 'unread'
                  ? 'Você não tem notificações pessoais não lidas.'
                  : selectedStatus === 'read'
                    ? 'Você não tem notificações pessoais lidas.'
                    : 'Você não tem notificações ainda.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
