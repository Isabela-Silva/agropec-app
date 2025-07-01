import { Building, Calendar, CheckCircle, Clock, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import { ActivityService } from '../../services/ActivityService';
import { ScheduleService } from '../../services/ScheduleService';
import { StandService } from '../../services/StandService';
import { IActivityWithCompanyResponse } from '../../services/interfaces/activity';
import { IStandWithCompanyResponse } from '../../services/interfaces/stand';
import { toastUtils } from '../../utils/toast';

type DetailsData = IActivityWithCompanyResponse | IStandWithCompanyResponse;

export function DetailsScreen() {
  const { type, id } = useParams<{ type: 'activity' | 'stand'; id: string }>();
  const [data, setData] = useState<DetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { user, updateUserData } = useUserAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!type || !id) {
        setError('Tipo ou ID não encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let result: DetailsData;

        if (type === 'activity') {
          result = await ActivityService.getById(id);
        } else if (type === 'stand') {
          result = await StandService.getById(id);
        } else {
          throw new Error('Tipo inválido');
        }

        setData(result);
      } catch (err) {
        setError('Erro ao carregar os detalhes');
        console.error('Erro ao buscar detalhes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  const handleRegister = async () => {
    if (!user) {
      toastUtils.error('Você precisa estar logado para se inscrever.');
      return;
    }

    if (!data || !type || !id) {
      toastUtils.error('Dados não encontrados.');
      return;
    }

    try {
      setIsRegistering(true);

      // Criar objeto compatível com ScheduleItem
      const baseItem = {
        uuid: id,
        name: data.name,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId,
        companyId: data.company?.uuid || '',
        imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : data.imageUrls ? [data.imageUrls] : [],
      };

      const scheduleItem =
        type === 'activity'
          ? {
              ...baseItem,
              type: 'activity' as const,
              startTime: (data as IActivityWithCompanyResponse).startTime,
              endTime: (data as IActivityWithCompanyResponse).endTime,
            }
          : {
              ...baseItem,
              type: 'stand' as const,
              openingTime: (data as IStandWithCompanyResponse).openingTime || '',
              closingTime: (data as IStandWithCompanyResponse).closingTime || '',
            };

      if (isRegistered) {
        // Remover da agenda
        const updatedUser = await ScheduleService.removeFromUserSchedule(user.uuid, scheduleItem);
        updateUserData(updatedUser);
        toastUtils.success(type === 'activity' ? 'Inscrição removida com sucesso!' : 'Stand removido da sua agenda!');
      } else {
        // Adicionar à agenda
        const updatedUser = await ScheduleService.addToUserSchedule(user.uuid, scheduleItem);
        updateUserData(updatedUser);
        toastUtils.success(type === 'activity' ? 'Inscrição realizada com sucesso!' : 'Stand adicionado à sua agenda!');
      }
    } catch (error) {
      console.error('Erro ao processar inscrição:', error);
      toastUtils.error('Erro ao processar inscrição. Tente novamente.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Verificar se o usuário já está inscrito
  const isRegistered = useMemo(() => {
    if (!user || !id) return false;

    const activities = user.activitiesId || [];
    const stands = user.standsId || [];

    return activities.includes(id) || stands.includes(id);
  }, [user, id]);

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const durationMinutes = endMinutes - startMinutes;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (minutes === 0) {
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-white-light">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-xs text-base-gray sm:text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-white-light">
        <div className="text-center">
          <p className="mb-4 text-xs text-red-500 sm:text-sm">{error || 'Dados não encontrados'}</p>
        </div>
      </div>
    );
  }

  const isActivity = 'startTime' in data;
  const imageUrl = isActivity
    ? (data as IActivityWithCompanyResponse).imageUrls?.[0]
    : (() => {
        const imageUrls = (data as IStandWithCompanyResponse).imageUrls;
        return Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
      })();

  return (
    <div className="min-h-screen bg-base-white-light text-base-black">
      <div className="mx-auto max-w-2xl px-4 pb-24">
        {/* Hero Section */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="relative">
            {imageUrl ? (
              <img src={imageUrl} alt={data.name} className="h-64 w-full object-cover" />
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500">
                <Building className="h-20 w-20 text-white opacity-80" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

            {/* Badge */}
            <div className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-green-700 backdrop-blur-sm sm:text-sm">
              {isActivity ? 'Atividade' : 'Stand'}
            </div>
          </div>

          <div className="p-6">
            <h1 className="mb-3 text-lg font-bold leading-tight text-green-800 sm:text-xl">{data.name}</h1>

            <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-600 sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>{data.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span>
                  {isActivity
                    ? `${data.startTime} - ${data.endTime}`
                    : `${(data as IStandWithCompanyResponse).openingTime || 'N/A'} - ${(data as IStandWithCompanyResponse).closingTime || 'N/A'}`}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">{data.description}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 sm:text-sm ${
                  isRegistered
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                }`}
              >
                {isRegistering ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                {isRegistering
                  ? 'Processando...'
                  : isRegistered
                    ? isActivity
                      ? 'Cancelar Inscrição'
                      : 'Remover da Agenda'
                    : isActivity
                      ? 'Inscrever-se'
                      : 'Adicionar à Agenda'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="mt-6 space-y-6">
          {/* Horário e Duração */}
          {isActivity && (
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-3 text-base font-semibold text-green-800 sm:text-lg">
                <Clock className="h-5 w-5" />
                Horário e Duração
              </h2>
              <div className="rounded-xl border-l-4 border-green-500 bg-green-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-green-700">Início:</span>
                  <span className="text-sm font-medium sm:text-lg">{data.startTime}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-green-700">Término:</span>
                  <span className="text-sm font-medium sm:text-lg">{data.endTime}</span>
                </div>
                <div className="text-xs text-gray-600 sm:text-sm">
                  Duração: {calculateDuration(data.startTime, data.endTime)}
                </div>
              </div>
            </div>
          )}

          {/* Sobre */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-3 text-base font-semibold text-green-800 sm:text-lg">
              <Info className="h-5 w-5" />
              Sobre {isActivity ? 'a Atividade' : 'o Stand'}
            </h2>
            <div className="text-xs leading-relaxed text-gray-700 sm:text-sm">
              <p className="mb-4">{data.description}</p>
            </div>
          </div>

          {/* Organização */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-3 text-base font-semibold text-green-800 sm:text-lg">
              <Building className="h-5 w-5" />
              Organização
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-semibold text-white sm:text-lg">
                {data.company?.name.charAt(0).toUpperCase() || 'C'}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-800 sm:text-base">
                  {data.company?.name || 'Organizador não especificado'}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
