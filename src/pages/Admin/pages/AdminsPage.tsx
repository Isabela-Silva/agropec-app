import { Edit2, Plus, Search, Shield, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { Admin, CreateAdmin } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin?: Admin;
  onSubmit: (data: CreateAdmin | Partial<Admin>) => void;
  isLoading: boolean;
}

function AdminModal({ isOpen, onClose, admin, onSubmit, isLoading }: AdminModalProps) {
  const [formData, setFormData] = useState({
    firstName: admin?.firstName || '',
    lastName: admin?.lastName || '',
    email: admin?.email || '',
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
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {admin ? 'Editar Administrador' : 'Novo Administrador'}
        </h3>

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
              {admin ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input"
              required={!admin}
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

export function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data para desenvolvimento
  const [admins, setAdmins] = useState<Admin[]>([
    {
      uuid: '1',
      firstName: 'Admin',
      lastName: 'Principal',
      email: 'admin@agropec.com',
      role: 'SUPER_ADMIN',
    },
    {
      uuid: '2',
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@agropec.com',
      role: 'admin',
    },
  ]);

  const filteredAdmins = admins.filter(
    (admin: Admin) =>
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedAdmin(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir este administrador?')) {
      setIsSubmitting(true);
      setTimeout(() => {
        setAdmins((prev) => prev.filter((admin) => admin.uuid !== uuid));
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleSubmit = async (data: CreateAdmin | Partial<Admin>) => {
    setIsSubmitting(true);

    setTimeout(() => {
      if (selectedAdmin) {
        setAdmins((prev) => prev.map((admin) => (admin.uuid === selectedAdmin.uuid ? { ...admin, ...data } : admin)));
      } else {
        const newAdmin: Admin = {
          uuid: Math.random().toString(36).substr(2, 9),
          role: 'admin',
          ...(data as CreateAdmin),
        };
        setAdmins((prev) => [...prev, newAdmin]);
      }
      setIsModalOpen(false);
      setSelectedAdmin(undefined);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar administradores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Administrador</span>
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
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
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredAdmins.map((admin) => (
                <tr key={admin.uuid} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-admin-primary-100 flex h-10 w-10 items-center justify-center rounded-full">
                        <Shield className="text-admin-primary-600 h-5 w-5" />
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
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-admin-primary-600 hover:text-admin-primary-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.uuid)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhum administrador encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
