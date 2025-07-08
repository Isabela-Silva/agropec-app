import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Bell, Calendar, Edit2, Loader2, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { NotificationService } from '../../../services';
import type { ApiError } from '../../../services/interfaces/api';
import type {
  ICreateNotification,
  INotificationResponse,
  IUpdateNotification,
} from '../../../services/interfaces/notification';
import { toastUtils } from '../../../utils/toast';
import { NotificationModal } from '../components/modals/NotificationModal';

export function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<INotificationResponse | undefined>();

  const queryClient = useQueryClient();

  // Query para buscar todas as notificações
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationService.getAll,
    // staleTime: 5 * 60 * 1000
    refetchOnWindowFocus: false,
  });

  // Mutation para criar notificação
  const createMutation = useMutation({
    mutationFn: NotificationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      setIsModalOpen(false);
      setSelectedNotification(undefined);
      toastUtils.success('Notificação criada com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao criar notificação';
      toastUtils.error(message);
    },
  });

  // Mutation para atualizar notificação
  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: IUpdateNotification }) => NotificationService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      setIsModalOpen(false);
      setSelectedNotification(undefined);
      toastUtils.success('Notificação atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar notificação';
      toastUtils.error(message);
    },
  });

  // Mutation para deletar notificação
  const deleteMutation = useMutation({
    mutationFn: NotificationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      toastUtils.success('Notificação excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao excluir notificação';
      toastUtils.error(message);
    },
  });

  // Filtrar notificações por busca
  const filteredNotifications = notifications.filter(
    (notification: INotificationResponse) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedNotification(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (notification: INotificationResponse) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta notificação?')) {
      deleteMutation.mutate(uuid);
    }
  };

  const handleSubmit = async (data: ICreateNotification | Partial<INotificationResponse>) => {
    if (selectedNotification) {
      // Atualizar notificação existente
      const updateData: IUpdateNotification = {
        uuid: selectedNotification.uuid,
        title: data.title || selectedNotification.title,
        message: data.message || selectedNotification.message,
        type: data.type || selectedNotification.type,
        date: data.date || selectedNotification.date,
        time: data.time || selectedNotification.time,
        targetAudience: data.targetAudience || selectedNotification.targetAudience,
        isScheduled: data.isScheduled !== undefined ? data.isScheduled : selectedNotification.isScheduled,
      };

      updateMutation.mutate({ uuid: selectedNotification.uuid, data: updateData });
    } else {
      // Criar nova notificação
      createMutation.mutate(data as ICreateNotification);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando notificações...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <h2 className="mb-2 text-2xl font-bold">Erro ao Carregar Notificações</h2>
          <p className="text-red-100">
            Não foi possível carregar a lista de notificações. Verifique sua conexão e tente novamente.
          </p>
        </div>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Funções helper para interface
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-purple-500" />;
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Entregue';
      case 'pending':
        return 'Pendente';
      case 'read':
        return 'Lida';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'alert':
        return 'Alerta';
      case 'announcement':
        return 'Anúncio';
      case 'event':
        return 'Evento';
      case 'system':
        return 'Sistema';
      default:
        return type;
    }
  };

  // Função para traduzir audiência
  const translateAudience = (audience: string) => {
    const translations: Record<string, string> = {
      all: 'Todos',
      admin: 'Administradores',
      exhibitors: 'Expositores',
      visitors: 'Visitantes',
      staff: 'Equipe',
    };
    return translations[audience] || audience;
  };

  const formatTargetAudience = (audiences: string[]) => {
    return audiences.map(translateAudience).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header com busca e ação */}
      <div className="flex items-center justify-between">
        <div className="relative mr-4 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Buscar notificações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Notificação</span>
        </button>
      </div>

      {/* Lista de notificações */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotifications.length === 0 ? (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma notificação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando uma nova notificação.'}
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div key={notification.uuid} className="card group transition-shadow hover:shadow-md">
              {/* Cabeçalho do Card */}
              <div className="flex items-start justify-between border-b border-gray-100 p-4">
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-1 rounded-lg p-2 ${
                      notification.type === 'alert'
                        ? 'bg-red-100'
                        : notification.type === 'announcement'
                          ? 'bg-blue-100'
                          : notification.type === 'event'
                            ? 'bg-green-100'
                            : 'bg-purple-100'
                    }`}
                  >
                    {getTypeIcon(notification.type)}
                  </div>
                  <div>
                    <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{notification.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{notification.message}</p>
                  </div>
                </div>

                {/* Menu de Ações */}
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(notification)}
                    className="rounded-md p-2 text-admin-primary-600 opacity-0 transition-opacity hover:bg-admin-primary-50 hover:text-admin-primary-900 group-hover:opacity-100"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(notification.uuid)}
                    className="rounded-md p-2 text-red-600 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-900 group-hover:opacity-100"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="p-4">
                {/* Informações de Data e Audiência */}
                <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                      {notification.date} às {notification.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span className="line-clamp-1">{formatTargetAudience(notification.targetAudience)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {/* Status */}
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(notification.status)}`}
                  >
                    {getStatusLabel(notification.status)}
                  </span>

                  {/* Tipo */}
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                    {getTypeLabel(notification.type)}
                  </span>

                  {/* Agendamento */}
                  {notification.isScheduled ? (
                    <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      Agendada
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Instantânea
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNotification(undefined);
        }}
        notification={selectedNotification}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
