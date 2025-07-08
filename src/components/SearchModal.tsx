import { Calendar, Clock, MapPin, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScheduleService } from '../services/ScheduleService';
import { ApiError } from '../services/interfaces/api';
import { ActivityScheduleItem, ScheduleItem, StandScheduleItem } from '../services/interfaces/schedule';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult = {
  type: 'activity' | 'stand';
  data: ScheduleItem;
};

// Função para formatar datas
const formatDate = (dateString: string): string => {
  try {
    // Se for uma data ISO (2025-08-15T09:00:00.000Z)
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    }

    // Se for uma data no formato dd/mm/yyyy
    if (dateString.includes('/')) {
      return dateString;
    }

    // Se for uma data no formato yyyy-mm-dd
    if (dateString.includes('-') && dateString.length === 10) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }

    // Se não conseguir formatar, retorna como está
    return dateString;
  } catch (error) {
    console.error('Erro ao formatar data:', dateString, error);
    return dateString;
  }
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const performSearch = useCallback(async () => {
    if (query.trim().length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const schedule = await ScheduleService.getSchedule();

      const filteredResults = schedule
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()),
        )
        .map((item) => ({
          type: item.type,
          data: item,
        }));

      setResults(filteredResults);
    } catch (error: unknown) {
      if (error instanceof Error || (error as ApiError).response) {
        setError(
          `Erro na pesquisa: ${(error as ApiError).response?.status || 'Desconhecido'} - ${(error as ApiError).response?.data?.message || (error as Error).message}`,
        );
      } else {
        setError('Erro desconhecido na pesquisa');
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const timeout = setTimeout(performSearch, 300);

    return () => clearTimeout(timeout);
  }, [query, performSearch]);

  const handleResultClick = (result: SearchResult) => {
    const id = result.data.uuid;
    navigate(`/detalhes/${result.type}/${id}`);
    onClose();
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getTimeDisplay = (item: ScheduleItem) => {
    if (item.type === 'activity') {
      return `${(item as ActivityScheduleItem).startTime} - ${(item as ActivityScheduleItem).endTime}`;
    } else {
      return `${(item as StandScheduleItem).openingTime || 'N/A'} - ${(item as StandScheduleItem).closingTime || 'N/A'}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4">
      <div className="mt-16 w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Pesquisar</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Pesquisar atividades e stands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-gray-500">Pesquisando...</p>
            </div>
          )}

          {error && (
            <div className="p-4 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && query.trim().length >= 2 && results.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-gray-500">Nenhum resultado encontrado</p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="p-2">
              {results.map((result) => {
                const isActivity = result.type === 'activity';
                const data = result.data;

                return (
                  <div
                    key={`${result.type}-${data.uuid}`}
                    onClick={() => handleResultClick(result)}
                    className="flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {data.imageUrls && data.imageUrls.length > 0 ? (
                        <img src={data.imageUrls[0]} alt={data.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center space-x-2">
                        <h3 className="truncate text-sm font-medium">{data.name}</h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            isActivity ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isActivity ? 'Atividade' : 'Stand'}
                        </span>
                      </div>

                      <p className="mb-1 truncate text-xs text-gray-500">{data.description}</p>

                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(data.date)}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeDisplay(data)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
