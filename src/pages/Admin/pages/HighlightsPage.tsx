import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Edit2, Loader2, Plus, Search, Star, Store, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ICreateHighlight, IHighlightWithDetails, IUpdateHighlight } from '../../../services';
import { HighlightService } from '../../../services';
import { toastUtils } from '../../../utils/toast';
import { HighlightModal } from '../components/modals/HighlightModal';

export function HighlightsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<IHighlightWithDetails | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: highlights = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['highlights'],
    queryFn: HighlightService.getAllHighlights,
  });

  const filteredHighlights = highlights.filter((highlight) => {
    // Buscar pelo tipo ou pelo nome da entidade relacionada
    const searchText = searchTerm.toLowerCase();
    const typeMatch = highlight.type.toLowerCase().includes(searchText);
    const activityMatch = highlight.activity?.name.toLowerCase().includes(searchText);
    const standMatch = highlight.stand?.name.toLowerCase().includes(searchText);

    return typeMatch || activityMatch || standMatch;
  });

  const handleCreate = () => {
    setSelectedHighlight(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (highlight: IHighlightWithDetails) => {
    setSelectedHighlight(highlight);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir este destaque?')) {
      try {
        await HighlightService.deleteHighlight(uuid);
        toastUtils.success('Destaque excluído com sucesso!');
        await refetch();
        queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      } catch (error) {
        console.error('Erro ao excluir destaque:', error);
        toastUtils.error('Erro ao excluir destaque');
      }
    }
  };

  const handleSubmit = async (data: ICreateHighlight | IUpdateHighlight) => {
    setIsSubmitting(true);
    try {
      if (selectedHighlight) {
        // Atualizar destaque existente
        await HighlightService.updateHighlight(selectedHighlight.uuid, data as IUpdateHighlight);
        toastUtils.success('Destaque atualizado com sucesso!');
      } else {
        // Criar novo destaque
        await HighlightService.createHighlight(data as ICreateHighlight);
        toastUtils.success('Destaque criado com sucesso!');
      }

      setIsModalOpen(false);
      setSelectedHighlight(undefined);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    } catch (error) {
      console.error('Erro ao salvar destaque:', error);
      toastUtils.error('Erro ao salvar destaque');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      activity: 'Atividade',
      stand: 'Stand',
    };
    return types[type as keyof typeof types] || type;
  };

  const getDisplayName = (highlight: IHighlightWithDetails) => {
    if (highlight.activity) {
      return highlight.activity.name;
    }
    if (highlight.stand) {
      return highlight.stand.name;
    }
    return 'Item não encontrado';
  };

  const getDisplayDescription = (highlight: IHighlightWithDetails) => {
    if (highlight.activity) {
      return highlight.activity.description;
    }
    if (highlight.stand) {
      return highlight.stand.description;
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando destaques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Loader2 className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar destaques</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Ocorreu um erro ao carregar os destaques. Por favor, tente novamente.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar destaques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Destaque</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredHighlights.map((highlight) => (
          <div key={highlight.uuid} className="card">
            <div className="flex">
              {/* Imagem ou Fallback */}
              {highlight.activity?.imageUrls && highlight.activity.imageUrls.length > 0 ? (
                <div className="relative h-32 w-48">
                  <img
                    src={highlight.activity.imageUrls[0]}
                    alt={highlight.activity.name}
                    className="h-full w-full rounded-l-lg object-cover"
                  />
                  {highlight.activity.imageUrls.length > 1 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
                      +{highlight.activity.imageUrls.length - 1}
                    </span>
                  )}
                </div>
              ) : highlight.stand?.imageUrls && highlight.stand.imageUrls.length > 0 ? (
                <div className="relative h-32 w-48">
                  <img
                    src={highlight.stand.imageUrls[0]}
                    alt={highlight.stand.name}
                    className="h-full w-full rounded-l-lg object-cover"
                  />
                  {highlight.stand.imageUrls.length > 1 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
                      +{highlight.stand.imageUrls.length - 1}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex h-32 w-48 items-center justify-center rounded-l-lg bg-gray-100">
                  {highlight.type === 'activity' ? (
                    <Calendar className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Store className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              )}

              {/* Conteúdo */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center space-x-3">
                      <h3 className="truncate text-lg font-semibold text-gray-900">{getDisplayName(highlight)}</h3>
                      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {getTypeLabel(highlight.type)}
                      </span>
                    </div>

                    <p className="mb-3 line-clamp-2 text-gray-600">{getDisplayDescription(highlight)}</p>

                    {/* Informações específicas baseadas no tipo */}
                    {highlight.activity && (
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            {highlight.activity.date} - {highlight.activity.startTime} às {highlight.activity.endTime}
                          </span>
                        </div>
                      </div>
                    )}

                    {highlight.stand && (
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <Store className="mr-2 h-4 w-4" />
                          <span>Stand em destaque</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(highlight)}
                      className="rounded-md p-2 text-admin-primary-600 hover:bg-admin-primary-50 hover:text-admin-primary-900"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(highlight.uuid)}
                      className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredHighlights.length === 0 && (
          <div className="card p-8 text-center">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum destaque encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo destaque.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <HighlightModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHighlight(undefined);
        }}
        highlight={selectedHighlight}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
