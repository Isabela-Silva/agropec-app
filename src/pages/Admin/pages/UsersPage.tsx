import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { UserService } from '../../../services';
import type { ApiError } from '../../../services/interfaces/api';
import type { ICreateUser, IUpdateUser, IUser } from '../../../services/interfaces/user';
import { toastUtils } from '../../../utils/toast';
import { UserModal } from '../components/modals/UserModal';

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | undefined>();

  const queryClient = useQueryClient();

  // Query para buscar todos os usuários
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: UserService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Mutation para criar usuário
  const createMutation = useMutation({
    mutationFn: UserService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      setIsModalOpen(false);
      setSelectedUser(undefined);
      toastUtils.success('Usuário criado com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao criar usuário';
      toastUtils.error(message);
    },
  });

  // Mutation para atualizar usuário
  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: IUpdateUser }) => UserService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      setIsModalOpen(false);
      setSelectedUser(undefined);
      toastUtils.success('Usuário atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar usuário';
      toastUtils.error(message);
    },
  });

  // Mutation para deletar usuário
  const deleteMutation = useMutation({
    mutationFn: UserService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      toastUtils.success('Usuário excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao excluir usuário';
      toastUtils.error(message);
    },
  });

  const filteredUsers = users.filter(
    (user: IUser) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteMutation.mutate(uuid);
    }
  };

  const handleSubmit = async (data: ICreateUser | Partial<IUser>) => {
    if (selectedUser) {
      // Atualizar usuário existente
      const updateData: IUpdateUser = {
        uuid: selectedUser.uuid,
        firstName: data.firstName || selectedUser.firstName,
        lastName: data.lastName || selectedUser.lastName,
        email: data.email || selectedUser.email,
      };

      // Só inclui password se foi fornecida
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      updateMutation.mutate({ uuid: selectedUser.uuid, data: updateData });
    } else {
      // Criar novo usuário
      createMutation.mutate(data as ICreateUser);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <h2 className="mb-2 text-2xl font-bold">Erro ao Carregar Usuários</h2>
          <p className="text-red-100">
            Não foi possível carregar a lista de usuários. Verifique sua conexão e tente novamente.
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </button>
      </div>

      {/* Users list */}
      <div className="card">
        {filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo usuário.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Atividades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Stands
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user.uuid} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-primary-100">
                          <span className="text-sm font-medium text-admin-primary-700">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-admin-primary-100 px-2 text-xs font-semibold leading-5 text-admin-primary-800">
                        {user.role === 'user' ? 'Usuário' : user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.activitiesId?.length || 0}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.standsId?.length || 0}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-admin-primary-600 hover:text-admin-primary-900"
                          disabled={deleteMutation.isPending}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.uuid)}
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
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(undefined);
        }}
        user={selectedUser}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
