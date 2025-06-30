import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
// import { userAPI } from '../services/api';
import { mockUsers } from '../data/mockData';
import type { CreateUser, User } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSubmit: (data: CreateUser | Partial<User>) => void;
  isLoading: boolean;
}

function UserModal({ isOpen, onClose, user, onSubmit, isLoading }: UserModalProps) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{user ? 'Editar Usuário' : 'Novo Usuário'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sobrenome</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {user ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input"
              required={!user}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading] = useState(false);

  // Mock state para simular operações da API
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Versão com API (comentada para desenvolvimento)
  // const queryClient = useQueryClient();
  // const { data: users = [], isLoading } = useQuery({
  //   queryKey: ['users'],
  //   queryFn: userAPI.getAll,
  // });
  // const createMutation = useMutation({
  //   mutationFn: userAPI.create,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['users'] });
  //     setIsModalOpen(false);
  //     setSelectedUser(undefined);
  //   },
  // });
  // const updateMutation = useMutation({
  //   mutationFn: ({ uuid, data }: { uuid: string; data: Partial<User> }) =>
  //     userAPI.update(uuid, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['users'] });
  //     setIsModalOpen(false);
  //     setSelectedUser(undefined);
  //   },
  // });
  // const deleteMutation = useMutation({
  //   mutationFn: userAPI.delete,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['users'] });
  //   },
  // });

  const filteredUsers = users.filter(
    (user: User) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      // Simular delay da API
      setIsSubmitting(true);
      setTimeout(() => {
        setUsers((prev) => prev.filter((user) => user.uuid !== uuid));
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleSubmit = async (data: CreateUser | Partial<User>) => {
    setIsSubmitting(true);

    // Simular delay da API
    setTimeout(() => {
      if (selectedUser) {
        // Atualizar usuário existente
        setUsers((prev) => prev.map((user) => (user.uuid === selectedUser.uuid ? { ...user, ...data } : user)));
      } else {
        // Criar novo usuário
        const newUser: User = {
          uuid: `user-${Date.now()}`,
          firstName: (data as CreateUser).firstName,
          lastName: (data as CreateUser).lastName,
          email: (data as CreateUser).email,
          role: 'user',
          activitiesId: [],
          standsId: [],
        };
        setUsers((prev) => [...prev, newUser]);
      }

      setIsModalOpen(false);
      setSelectedUser(undefined);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Usuários</h2>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Users table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Atividades
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uuid} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-admin-primary-100 flex h-8 w-8 items-center justify-center rounded-full">
                          <span className="text-admin-primary-700 text-sm font-medium">
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
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.activitiesId?.length || 0} atividades
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-admin-primary-600 hover:text-admin-primary-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(user.uuid)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
