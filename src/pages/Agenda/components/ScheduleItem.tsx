import { useMutation } from '@tanstack/react-query';
import { Calendar, Check, ChevronDown, ChevronUp, Plus, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useUserAuth } from '../../../hooks/useUserAuth';
import { ScheduleItem as ScheduleItemType } from '../../../services/interfaces/schedule';
import { ScheduleService } from '../../../services/ScheduleService';
import { toastUtils } from '../../../utils/toast';

interface ScheduleItemProps {
  item: ScheduleItemType;
}

export function ScheduleItem({ item }: ScheduleItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 32;
  const { user, updateUserData } = useUserAuth();

  const getTimeString = () => {
    if (item.type === 'activity') {
      return `${item.startTime}h - ${item.endTime}h`;
    }
    return `${item.openingTime}h - ${item.closingTime}h`;
  };

  const Icon = item.type === 'activity' ? Calendar : Store;

  const shouldTruncate = item.description.length > MAX_LENGTH;
  const displayText =
    shouldTruncate && !isExpanded ? `${item.description.slice(0, MAX_LENGTH).trim()}...` : item.description;

  // Verificar se o usuário já participa/visita este item
  const isParticipating = useMemo(() => {
    const activities = user?.activitiesId || [];
    const stands = user?.standsId || [];
    const isInActivities = activities.includes(item.uuid);
    const isInStands = stands.includes(item.uuid);

    return isInActivities || isInStands;
  }, [user?.activitiesId, user?.standsId, item.uuid]);

  // Mutation para adicionar à agenda
  const addMutation = useMutation({
    mutationFn: () => ScheduleService.addToUserSchedule(user!.uuid, item),
    onSuccess: (updatedUser) => {
      updateUserData(updatedUser);
      toastUtils.success(
        item.type === 'activity' ? 'Atividade adicionada à sua agenda!' : 'Stand adicionado à sua agenda!',
      );
    },
    onError: (error) => {
      console.error('Add mutation error:', error);
      toastUtils.error('Erro ao adicionar à agenda. Tente novamente.');
    },
  });

  // Mutation para remover da agenda
  const removeMutation = useMutation({
    mutationFn: () => ScheduleService.removeFromUserSchedule(user!.uuid, item),
    onSuccess: (updatedUser) => {
      updateUserData(updatedUser);
      toastUtils.success(
        item.type === 'activity' ? 'Atividade removida da sua agenda!' : 'Stand removido da sua agenda!',
      );
    },
    onError: (error) => {
      console.error('Remove mutation error:', error);
      toastUtils.error('Erro ao remover da agenda. Tente novamente.');
    },
  });

  const handleToggleParticipation = () => {
    if (!user) {
      toastUtils.error('Você precisa estar logado para participar.');
      return;
    }

    if (isParticipating) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  const isLoading = addMutation.isPending || removeMutation.isPending;

  return (
    <div className="flex flex-col space-y-3 rounded-lg bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 sm:p-4">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="rounded-lg bg-green-500 p-2 sm:p-3">
          <Icon className="h-5 w-5 text-base-white sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-base-black sm:text-base">{item.name}</h3>
          <p className="text-xs text-base-gray sm:text-sm">{getTimeString()}</p>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-base-gray-dark text-xs sm:text-sm">{displayText}</p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 flex items-center text-xs text-green-500 hover:text-green-600 sm:text-sm"
          >
            {isExpanded ? (
              <>
                Ver menos
                <ChevronUp className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </>
            ) : (
              <>
                Ver mais
                <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Botão de participar/visitar */}
      <div className="flex-shrink-0">
        <button
          onClick={handleToggleParticipation}
          disabled={isLoading}
          className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:w-auto sm:gap-2 sm:px-4 sm:text-sm ${
            isParticipating
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-green-500 text-white hover:bg-green-600'
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-current sm:h-4 sm:w-4"></div>
          ) : isParticipating ? (
            <>
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{item.type === 'activity' ? 'Participando' : 'Visitando'}</span>
              <span className="sm:hidden">{item.type === 'activity' ? 'Participando' : 'Visitando'}</span>
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{item.type === 'activity' ? 'Participar' : 'Visitar'}</span>
              <span className="sm:hidden">{item.type === 'activity' ? 'Participar' : 'Visitar'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
