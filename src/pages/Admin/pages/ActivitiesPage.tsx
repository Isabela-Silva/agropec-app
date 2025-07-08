import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Edit2, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ActivityService, CategoryService, CompanyService } from '../../../services';
import type { IActivityResponse } from '../../../services/interfaces/activity';
import { toastUtils } from '../../../utils/toast';
import { ActivityModal } from '../components/modals/ActivityModal';

export function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<IActivityResponse | undefined>();

  const queryClient = useQueryClient();

  const {
    data: activities = [],
    isLoading: isLoadingActivities,
    error: activitiesError,
    refetch,
  } = useQuery({
    queryKey: ['activities'],
    queryFn: ActivityService.getAll,
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

  const isPageLoading = isLoadingActivities || isLoadingCompanies || isLoadingCategories;

  const filteredActivities = activities.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedActivity(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (activity: IActivityResponse) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      try {
        await ActivityService.delete(uuid);
        toastUtils.success('Atividade excluída com sucesso!');
        await refetch();
        queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      } catch (error) {
        console.error('Erro ao excluir atividade:', error);
        toastUtils.error('Erro ao excluir atividade');
      }
    }
  };

  const handleModalSuccess = async () => {
    await refetch();
    queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
  };

  if (isPageLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando atividades...</p>
        </div>
      </div>
    );
  }

  if (activitiesError || companiesError || categoriesError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Loader2 className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar atividades</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Ocorreu um erro ao carregar as atividades. Por favor, tente novamente.</p>
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
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Atividade</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredActivities.map((activity) => (
          <div key={activity.uuid} className="card">
            {activity.imageUrls && activity.imageUrls.length > 0 ? (
              <div className="relative h-48">
                <img
                  src={activity.imageUrls[0]}
                  alt={activity.name}
                  className="h-full w-full rounded-t-lg object-cover"
                />
                {activity.imageUrls.length > 1 && (
                  <span className="absolute bottom-2 right-2 rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
                    +{activity.imageUrls.length - 1}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-t-lg bg-gray-100">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{activity.name}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-gray-600">{activity.description}</p>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    {activity.startTime} - {activity.endTime}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(activity)}
                  className="rounded-md p-2 text-admin-primary-600 hover:bg-admin-primary-50 hover:text-admin-primary-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(activity.uuid)}
                  className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma atividade encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando uma nova atividade.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(undefined);
        }}
        activity={selectedActivity}
        isLoading={false}
        companies={companies}
        categories={categories}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
