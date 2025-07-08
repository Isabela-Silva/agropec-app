import { useQuery } from '@tanstack/react-query';
import { Activity, Bell, Building2, Calendar, Loader2, RefreshCw, Store, UserCheck, Users } from 'lucide-react';
import { DashboardService } from '../../../../services';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

function StatCard({ title, value, icon: Icon, color, /*trend,*/ isLoading }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="mt-2 flex items-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">Carregando...</span>
            </div>
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          )}
          {/* {trend && !isLoading && (
            <div className="mt-2 flex items-center">
              <TrendingUp className={`mr-1 h-4 w-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="ml-1 text-sm text-gray-500">vs mês anterior</span>
            </div>
          )} */}
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Hook customizado para buscar dados do dashboard de forma otimizada
function useDashboardData() {
  const {
    data: overview,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: DashboardService.getOverview,
    staleTime: 30 * 1000, // 30 segundos - mais atualizado
    refetchOnWindowFocus: true, // Atualiza quando a janela ganha foco
    refetchInterval: 5 * 60 * 1000, // Atualiza automaticamente a cada 5 minutos
  });

  return {
    overview,
    isLoading,
    error,
    refetch,
  };
}

export function Dashboard() {
  const { overview, isLoading, error, refetch } = useDashboardData();

  const handleRefresh = async () => {
    await refetch();
  };

  // Se não há dados, mostrar loading ou erro
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <h2 className="mb-2 text-2xl font-bold">Erro ao Carregar Dashboard</h2>
          <p className="text-red-100">
            Não foi possível carregar os dados do dashboard. Verifique sua conexão e tente novamente.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 flex items-center gap-2 rounded bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const { stats, recentActivities, recentNotifications } = overview;

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.users.total,
      icon: Users,
      color: 'bg-blue-500',
      trend: { value: 12, isPositive: true },
      isLoading: false,
    },
    {
      title: 'Administradores',
      value: stats.admins.total,
      icon: UserCheck,
      color: 'bg-admin-primary-600',
      trend: { value: 2, isPositive: true },
      isLoading: false,
    },
    {
      title: 'Empresas',
      value: stats.companies.total,
      icon: Building2,
      color: 'bg-purple-500',
      trend: { value: 8, isPositive: true },
      isLoading: false,
    },
    {
      title: 'Atividades',
      value: stats.activities.total,
      icon: Calendar,
      color: 'bg-orange-500',
      trend: { value: 15, isPositive: true },
      isLoading: false,
    },
    {
      title: 'Stands',
      value: stats.stands.total,
      icon: Store,
      color: 'bg-pink-500',
      trend: { value: 5, isPositive: true },
      isLoading: false,
    },
    {
      title: 'Notificações',
      value: stats.notifications.total,
      icon: Bell,
      color: 'bg-red-500',
      trend: { value: 3, isPositive: false },
      isLoading: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section with refresh button */}
      <div className="rounded-lg bg-gradient-to-r from-admin-primary-600 to-admin-primary-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold">Bem-vindo ao Painel Agropec!</h2>
            <p className="text-admin-primary-100">
              Gerencie todos os aspectos do evento de forma centralizada e eficiente.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 disabled:opacity-50"
            disabled={isLoading}
            title="Atualizar dados do dashboard"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Statistics grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            isLoading={stat.isLoading}
          />
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-gray-500">Nenhuma atividade encontrada</span>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.uuid} className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-admin-primary-500"></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{activity.name}</p>
                    <p className="text-sm text-gray-500">
                      {activity.date} às {activity.startTime}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notificações Recentes</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentNotifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-gray-500">Nenhuma notificação encontrada</span>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div key={notification.uuid} className="flex items-start space-x-3">
                  <div
                    className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${
                      notification.type === 'alert'
                        ? 'bg-red-500'
                        : notification.type === 'announcement'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                    }`}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="truncate text-sm text-gray-500">{notification.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
