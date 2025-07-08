import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2, Loader2, Plus, Search, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminService } from '../../../services';
import type { IAdmin, ICreateAdmin, IUpdateAdmin } from '../../../services/interfaces/admin';
import type { ApiError } from '../../../services/interfaces/api';
import { toastUtils } from '../../../utils/toast';
import { AdminModal } from '../components/modals/AdminModal';

export function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<IAdmin | undefined>();

  const queryClient = useQueryClient();

  // Query para buscar todos os administradores
  const {
    data: admins = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admins'],
    queryFn: AdminService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Mutation para criar administrador
  const createMutation = useMutation({
    mutationFn: AdminService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      setIsModalOpen(false);
      setSelectedAdmin(undefined);
      toastUtils.success('Administrador criado com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao criar administrador';
      toastUtils.error(message);
    },
  });

  // Mutation para atualizar administrador
  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: IUpdateAdmin }) => AdminService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      setIsModalOpen(false);
      setSelectedAdmin(undefined);
      toastUtils.success('Administrador atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar administrador';
      toastUtils.error(message);
    },
  });

  // Mutation para deletar administrador
  const deleteMutation = useMutation({
    mutationFn: AdminService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      toastUtils.success('Administrador excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao excluir administrador';
      toastUtils.error(message);
    },
  });

  const filteredAdmins = admins.filter(
    (admin: IAdmin) =>
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedAdmin(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (admin: IAdmin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir este administrador?')) {
      deleteMutation.mutate(uuid);
    }
  };

  const handleSubmit = async (data: ICreateAdmin | Partial<IAdmin>) => {
    if (selectedAdmin) {
      // Atualizar administrador existente
      const updateData: IUpdateAdmin = {
        uuid: selectedAdmin.uuid,
        firstName: data.firstName || selectedAdmin.firstName,
        lastName: data.lastName || selectedAdmin.lastName,
        email: data.email || selectedAdmin.email,
      };

      // Só inclui password se foi fornecida
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      updateMutation.mutate({ uuid: selectedAdmin.uuid, data: updateData });
    } else {
      // Criar novo administrador
      createMutation.mutate(data as ICreateAdmin);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando administradores...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <h2 className="mb-2 text-2xl font-bold">Erro ao Carregar Administradores</h2>
          <p className="text-red-100">
            Não foi possível carregar a lista de administradores. Verifique sua conexão e tente novamente.
          </p>
        </div>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative mr-4 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Buscar administradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Administrador</span>
        </button>
      </div>

      {/* Admins list */}
      <div className="card">
        {filteredAdmins.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">Nenhum administrador encontrado</h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo administrador.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Administrador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Função
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.uuid} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-admin-primary-100">
                          <Shield className="h-5 w-5 text-admin-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.firstName} {admin.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{admin.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          admin.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-admin-primary-600 hover:text-admin-primary-900"
                          disabled={deleteMutation.isPending}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.uuid)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAdmin(undefined);
        }}
        admin={selectedAdmin}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
