import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Building, Share2, CheckCircle, Info, Users } from 'lucide-react';
import { ActivityService } from '../../services/ActivityService';
import { StandService } from '../../services/StandService';
import { IActivityResponse } from '../../services/interfaces/activity';
import { IStandResponse } from '../../services/interfaces/stand';

type DetailsData = IActivityResponse | IStandResponse;

export function DetailsScreen() {
  const { type, id } = useParams<{ type: 'activity' | 'stand'; id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          result = await ActivityService.getActivityById(id);
        } else if (type === 'stand') {
          result = await StandService.getStandById(id);
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    const shareData = {
      title: data?.name || 'AgroPec',
      text: data?.description || '',
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      const shareText = `${data?.name}\n\n${data?.description}\n\n📅 ${data?.date}\n📍 AgroPec`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
        alert('Informações copiadas para a área de transferência!');
      } else {
        alert('Compartilhamento não suportado neste navegador');
      }
    }
  };

  const handleRegister = () => {
    alert('Funcionalidade de inscrição será implementada em breve!');
  };

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
          <p className="mt-4 text-base-gray">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-white-light">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error || 'Dados não encontrados'}</p>
          <button
            onClick={handleBack}
            className="rounded-lg bg-base-black px-6 py-2 text-white transition-opacity hover:opacity-80"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const isActivity = 'startTime' in data;
  const isStand = 'openingHours' in data;
  const imageUrl = isActivity 
    ? (data as IActivityResponse).imageUrls?.[0] 
    : (() => {
        const imageUrls = (data as IStandResponse).imageUrls;
        return Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
      })();

  return (
    <div className="min-h-screen bg-base-white-light text-base-black">
      {/* Header */}
      <div className="w-full bg-primary p-4 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-20 backdrop-blur-sm transition-all duration-300 hover:bg-opacity-30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-white">Detalhes da {isActivity ? 'Atividade' : 'Stand'}</h1>
          </div>
        </div>
      </div>

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
            <div className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-green-700 backdrop-blur-sm">
              {isActivity ? 'Atividade' : 'Stand'}
            </div>
          </div>

          <div className="p-6">
            <h1 className="mb-3 text-2xl font-bold leading-tight text-green-800">{data.name}</h1>

            <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>{data.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span>
                  {isActivity
                    ? `${data.startTime} - ${data.endTime}`
                    : `${(data as IStandResponse).openingTime || 'N/A'} - ${(data as IStandResponse).closingTime || 'N/A'}`}
                </span>
              </div>
             
            </div>

            <p className="leading-relaxed text-gray-700">{data.description}</p>
            <div className="flex justify-end mt-1">
            <button
              onClick={handleRegister}
              className="flex items-center  gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-700"
            >
              <CheckCircle className="h-5 w-5" />
              {isActivity ? 'Inscrever-se' : 'Visitar'}
            </button>

            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="mt-6 space-y-6">
          {/* Horário e Duração */}
          {isActivity && (
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-green-800">
                <Clock className="h-5 w-5" />
                Horário e Duração
              </h2>
              <div className="rounded-xl border-l-4 border-green-500 bg-green-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-green-700">Início:</span>
                  <span className="text-lg font-medium">{data.startTime}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-green-700">Término:</span>
                  <span className="text-lg font-medium">{data.endTime}</span>
                </div>
                <div className="text-sm text-gray-600">Duração: {calculateDuration(data.startTime, data.endTime)}</div>
              </div>
            </div>
          )}

          {/* Sobre */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-green-800">
              <Info className="h-5 w-5" />
              Sobre {isActivity ? 'a Atividade' : 'o Stand'}
            </h2>
            <div className="leading-relaxed text-gray-700">
              <p className="mb-4">{data.description}</p>
              {isActivity && (
                <div className="space-y-2 text-sm">
                  <p>• Workshop prático e interativo</p>
                  <p>• Material didático incluso</p>
                  <p>• Certificado de participação</p>
                  <p>• Coffee break incluso</p>
                </div>
              )}
            </div>
          </div>

          {/* Organização */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-green-800">
              <Building className="h-5 w-5" />
              Organização
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-lg font-semibold text-white">
                {data.companyId ? data.companyId.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Empresa ID: {data.companyId || 'N/A'}</h3>
                <p className="text-sm text-gray-600">Organizador oficial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
