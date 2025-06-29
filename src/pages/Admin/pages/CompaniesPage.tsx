import { Building2, Edit2, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { Company, CreateCompany } from '../types';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company;
  onSubmit: (data: CreateCompany | Partial<Company>) => void;
  isLoading: boolean;
}

function CompanyModal({ isOpen, onClose, company, onSubmit, isLoading }: CompanyModalProps) {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    description: company?.description || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{company ? 'Editar Empresa' : 'Nova Empresa'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input resize-none"
              rows={4}
              required
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

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data para desenvolvimento
  const [companies, setCompanies] = useState<Company[]>([
    {
      uuid: '1',
      name: 'AgroPec Soluções',
      description: 'Empresa especializada em soluções tecnológicas para o agronegócio',
    },
    {
      uuid: '2',
      name: 'Verde Campo Ltda',
      description: 'Fornecedora de equipamentos agrícolas e fertilizantes',
    },
    {
      uuid: '3',
      name: 'Sementes Brasil',
      description: 'Produção e distribuição de sementes certificadas',
    },
  ]);

  const filteredCompanies = companies.filter(
    (company: Company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedCompany(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      setIsSubmitting(true);
      setTimeout(() => {
        setCompanies((prev) => prev.filter((company) => company.uuid !== uuid));
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleSubmit = async (data: CreateCompany | Partial<Company>) => {
    setIsSubmitting(true);

    setTimeout(() => {
      if (selectedCompany) {
        setCompanies((prev) =>
          prev.map((company) => (company.uuid === selectedCompany.uuid ? { ...company, ...data } : company)),
        );
      } else {
        const newCompany: Company = {
          uuid: Math.random().toString(36).substr(2, 9),
          ...(data as CreateCompany),
        };
        setCompanies((prev) => [...prev, newCompany]);
      }
      setIsModalOpen(false);
      setSelectedCompany(undefined);
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
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Empresa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((company) => (
          <div key={company.uuid} className="card">
            <div className="flex items-start space-x-4">
              <div className="bg-admin-primary-100 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                <Building2 className="text-admin-primary-600 h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-gray-900">{company.name}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-gray-600">{company.description}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end space-x-2 border-t border-gray-200 pt-4">
              <button
                onClick={() => handleEdit(company)}
                className="text-admin-primary-600 hover:text-admin-primary-900 hover:bg-admin-primary-50 rounded-md p-2"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(company.uuid)}
                className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredCompanies.length === 0 && (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma empresa encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando uma nova empresa.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(undefined);
        }}
        company={selectedCompany}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
