import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2, Loader2, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CategoryService } from '../../../services';
import type { ApiError } from '../../../services/interfaces/api';
import type { ICategory, ICreateCategory } from '../../../services/interfaces/category';
import { toastUtils } from '../../../utils/toast';
import { CategoryModal } from '../components/modals/CategoryModal';

export function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>();

  const queryClient = useQueryClient();

  // Query para buscar todas as categorias
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: CategoryService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Mutation para criar categoria
  const createMutation = useMutation({
    mutationFn: CategoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsModalOpen(false);
      setSelectedCategory(undefined);
      toastUtils.success('Categoria criada com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao criar categoria';
      toastUtils.error(message);
    },
  });

  // Mutation para atualizar categoria
  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: { name: string } }) => CategoryService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsModalOpen(false);
      setSelectedCategory(undefined);
      toastUtils.success('Categoria atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar categoria';
      toastUtils.error(message);
    },
  });

  // Mutation para deletar categoria
  const deleteMutation = useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toastUtils.success('Categoria excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao excluir categoria';
      toastUtils.error(message);
    },
  });

  const filteredCategories = categories.filter((category: ICategory) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteMutation.mutate(uuid);
    }
  };

  const handleSubmit = async (data: ICreateCategory | Partial<ICategory>) => {
    if (selectedCategory) {
      // Atualizar categoria existente
      const updateData = { name: data.name || selectedCategory.name };
      updateMutation.mutate({ uuid: selectedCategory.uuid, data: updateData });
    } else {
      // Criar nova categoria
      createMutation.mutate(data as ICreateCategory);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <h2 className="mb-2 text-2xl font-bold">Erro ao Carregar Categorias</h2>
          <p className="text-red-100">
            Não foi possível carregar a lista de categorias. Verifique sua conexão e tente novamente.
          </p>
        </div>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-red-100 text-red-800',
    'bg-orange-100 text-orange-800',
  ];

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative mr-4 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma categoria encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando uma nova categoria.'}
              </p>
            </div>
          </div>
        ) : (
          filteredCategories.map((category, index) => (
            <div key={category.uuid} className="card group transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-admin-primary-100 flex h-8 w-8 items-center justify-center rounded-full">
                    <Tag className="text-admin-primary-600 h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-admin-primary-600 hover:text-admin-primary-900 hover:bg-admin-primary-50 rounded-md p-1"
                    disabled={deleteMutation.isPending}
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.uuid)}
                    className="rounded-md p-1 text-red-600 hover:bg-red-50 hover:text-red-900"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[index % colors.length]}`}
                >
                  {category.name}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(undefined);
        }}
        category={selectedCategory}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
