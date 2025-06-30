import { useQuery } from '@tanstack/react-query';
import { Clock, Edit2, Loader2, Plus, Search, Store, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CategoryService, CompanyService, StandService } from '../../../services';
import type { IStandResponse } from '../../../services/interfaces/stand';
import { toastUtils } from '../../../utils/toast';
import { StandModal } from '../components/modals/StandModal';

export function StandsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStand, setSelectedStand] = useState<IStandResponse | undefined>();

  const {
    data: stands = [],
    isLoading: isLoadingStands,
    error: standsError,
    refetch,
  } = useQuery({
    queryKey: ['stands'],
    queryFn: StandService.getAll,
  });

  const {
    data: companies = [],
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: CompanyService.getAll,
  });

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: CategoryService.getAll,
  });

  const isPageLoading = isLoadingStands || isLoadingCompanies || isLoadingCategories;

  const filteredStands = stands.filter(
    (stand) =>
      stand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stand.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedStand(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (stand: IStandResponse) => {
    setSelectedStand(stand);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir este stand?')) {
      try {
        await StandService.delete(uuid);
        toastUtils.success('Stand excluído com sucesso!');
        await refetch();
      } catch (error) {
        console.error('Erro ao excluir stand:', error);
        toastUtils.error('Erro ao excluir stand');
      }
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando stands...</p>
        </div>
      </div>
    );
  }

  if (standsError || companiesError || categoriesError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Loader2 className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar stands</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Ocorreu um erro ao carregar os stands. Por favor, tente novamente.</p>
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
              placeholder="Buscar stands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Stand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStands.map((stand) => (
          <div key={stand.uuid} className="card">
            {stand.imageUrls && stand.imageUrls.length > 0 ? (
              <div className="relative h-48">
                <img src={stand.imageUrls[0]} alt={stand.name} className="h-full w-full rounded-t-lg object-cover" />
                {stand.imageUrls.length > 1 && (
                  <span className="absolute bottom-2 right-2 rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
                    +{stand.imageUrls.length - 1}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-t-lg bg-gray-100">
                <Store className="h-12 w-12 text-gray-400" />
              </div>
            )}

            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{stand.name}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-gray-600">{stand.description}</p>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Store className="mr-2 h-4 w-4" />
                  <span>{stand.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    {stand.openingTime} - {stand.closingTime}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(stand)}
                  className="text-admin-primary-600 hover:text-admin-primary-900 hover:bg-admin-primary-50 rounded-md p-2"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(stand.uuid)}
                  className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredStands.length === 0 && (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <Store className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum stand encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo stand.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <StandModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStand(undefined);
        }}
        stand={selectedStand}
        isLoading={false}
        companies={companies}
        categories={categories}
        onSuccess={refetch}
      />
    </div>
  );
}
