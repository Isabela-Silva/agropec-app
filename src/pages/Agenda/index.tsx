import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Filter, LoaderCircle, Store, Users } from 'lucide-react';
import { useState } from 'react';
import Header from '../../components/Header';
import { useUserAuth } from '../../hooks/useUserAuth';
import { ScheduleService } from '../../services/ScheduleService';
import { ScheduleItem as ScheduleItemType } from '../../services/interfaces/schedule';
import { ScheduleItem } from './components/ScheduleItem';

interface GroupedSchedule {
  [date: string]: ScheduleItemType[];
}

type FilterType = 'all' | 'stands' | 'activities' | 'subscribed';

export function AgendaScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { user } = useUserAuth();

  // Busca todos os eventos
  const { data: schedule = {}, isLoading } = useQuery({
    queryKey: ['schedule'],
    queryFn: async () => {
      const data = await ScheduleService.getSchedule();

      // Agrupar por data
      return data.reduce((acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
      }, {} as GroupedSchedule);
    },
  });

  // Filtrar eventos baseado no filtro ativo
  const filteredSchedule = Object.entries(schedule).reduce((acc, [date, items]) => {
    const filteredItems = items.filter((item) => {
      switch (activeFilter) {
        case 'stands': {
          return item.type === 'stand';
        }
        case 'activities': {
          return item.type === 'activity';
        }
        case 'subscribed': {
          // Verificar se o usuário está inscrito neste item
          const isSubscribed = user?.activitiesId?.includes(item.uuid) || user?.standsId?.includes(item.uuid);
          return isSubscribed;
        }
        case 'all':
        default: {
          return true;
        }
      }
    });

    if (filteredItems.length > 0) {
      acc[date] = filteredItems;
    }

    return acc;
  }, {} as GroupedSchedule);

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  // Calcular contadores para cada filtro
  const getFilterCount = (filter: FilterType) => {
    const allItems = Object.values(schedule).flat();

    switch (filter) {
      case 'stands': {
        return allItems.filter((item) => item.type === 'stand').length;
      }
      case 'activities': {
        return allItems.filter((item) => item.type === 'activity').length;
      }
      case 'subscribed': {
        return allItems.filter((item) => user?.activitiesId?.includes(item.uuid) || user?.standsId?.includes(item.uuid))
          .length;
      }
      case 'all':
      default: {
        return allItems.length;
      }
    }
  };

  const getFilterLabel = (filter: FilterType) => {
    const count = getFilterCount(filter);
    const baseLabel = (() => {
      switch (filter) {
        case 'all':
          return 'Todos';
        case 'stands':
          return 'Stands';
        case 'activities':
          return 'Atividades';
        case 'subscribed':
          return 'Inscritos';
        default:
          return 'Todos';
      }
    })();

    return `${baseLabel} (${count})`;
  };

  const getFilterIcon = (filter: FilterType) => {
    switch (filter) {
      case 'all':
        return <Calendar className="h-4 w-4" />;
      case 'stands':
        return <Store className="h-4 w-4" />;
      case 'activities':
        return <Clock className="h-4 w-4" />;
      case 'subscribed':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-base-white-light text-base-black">
        <Header title="Agenda" showBackButton={true} />
        <div className="flex min-h-[300px] items-center justify-center p-3 sm:min-h-[400px] sm:p-4">
          <div className="text-center">
            <LoaderCircle className="mx-auto mb-3 h-6 w-6 animate-spin text-gray-400 sm:mb-4 sm:h-8 sm:w-8" />
            <p className="text-xs text-gray-500 sm:text-sm">Carregando programação...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-white-light text-base-black">
      <Header title="Agenda" showBackButton={true} />

      <div className="p-3 sm:p-4">
        <div className="mb-6 rounded-lg bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-2">
          <h2 className="text-base font-semibold text-base-black sm:text-lg">Programação Geral</h2>
          <p className="mt-1 text-xs text-base-gray sm:text-sm">
            {activeFilter === 'all' && 'Confira todos os eventos e atividades do evento.'}
            {activeFilter === 'stands' && 'Confira todos os stands disponíveis.'}
            {activeFilter === 'activities' && 'Confira todas as atividades programadas.'}
            {activeFilter === 'subscribed' && 'Confira os eventos em que você está inscrito.'}
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4 text-base-gray" />
            <span className="text-xs font-medium text-base-gray sm:text-sm">Filtros:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
            {(['all', 'stands', 'activities', 'subscribed'] as FilterType[]).map((filter) => {
              const count = getFilterCount(filter);
              const isDisabled = count === 0;

              return (
                <button
                  key={filter}
                  onClick={() => !isDisabled && setActiveFilter(filter)}
                  disabled={isDisabled}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
                    isDisabled
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : activeFilter === filter
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'border border-gray-200 bg-white text-base-gray hover:bg-gray-50'
                  }`}
                >
                  {getFilterIcon(filter)}
                  <span className="truncate">{getFilterLabel(filter)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {Object.entries(filteredSchedule).map(([date, items]) => (
          <div key={date} className="mb-6 sm:mb-8">
            <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">{formatDate(date)}</h2>
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <ScheduleItem key={item.uuid} item={item} />
              ))}
            </div>
          </div>
        ))}

        {Object.keys(filteredSchedule).length === 0 && (
          <div className="mt-6 text-center sm:mt-8">
            <Calendar className="mx-auto mb-2 h-10 w-10 text-gray-400 sm:mb-3 sm:h-12 sm:w-12" />
            <p className="text-sm text-gray-500 sm:text-base">
              {activeFilter === 'subscribed'
                ? 'Você não está inscrito em nenhum evento ainda.'
                : 'Nenhum evento encontrado com o filtro selecionado.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
