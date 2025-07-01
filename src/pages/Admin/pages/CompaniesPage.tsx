import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Edit2, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CompanyService } from '../../../services';
import type { ApiError } from '../../../services/interfaces/api';
import type { ICompanyResponse, ICreateCompany, IUpdateCompany } from '../../../services/interfaces/company';
import { toastUtils } from '../../../utils/toast';
import { CompanyModal } from '../components/modals/CompanyModal';

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ICompanyResponse | undefined>();

  const queryClient = useQueryClient();

  // Query para buscar todas as empresas
  const {
    data: companies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: CompanyService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Mutation para criar empresa
  const createMutation = useMutation({
    mutationFn: CompanyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalOpen(false);
      setSelectedCompany(undefined);
      toastUtils.success('Empresa criada com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao criar empresa';
      toastUtils.error(message);
    },
  });

  // Mutation para atualizar empresa
  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: IUpdateCompany }) => CompanyService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsModalOpen(false);
      setSelectedCompany(undefined);
      toastUtils.success('Empresa atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao atualizar empresa';
      toastUtils.error(message);
    },
  });

  // Mutation para deletar empresa
  const deleteMutation = useMutation({
    mutationFn: CompanyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toastUtils.success('Empresa excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Erro ao excluir empresa';
      toastUtils.error(message);
    },
  });

  const filteredCompanies = companies.filter(
    (company: ICompanyResponse) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedCompany(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (company: ICompanyResponse) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      deleteMutation.mutate(uuid);
    }
  };

  const handleSubmit = async (data: ICreateCompany | Partial<ICompanyResponse>) => {
    if (selectedCompany) {
      // Atualizar empresa existente
      const updateData: IUpdateCompany = {
        uuid: selectedCompany.uuid,
        name: data.name || selectedCompany.name,
        description: data.description || selectedCompany.description,
      };

      updateMutation.mutate({ uuid: selectedCompany.uuid, data: updateData });
    } else {
      // Criar nova empresa
      createMutation.mutate(data as ICreateCompany);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <h2 className="mb-2 text-2xl font-bold">Erro ao Carregar Empresas</h2>
          <p className="text-red-100">
            Não foi possível carregar a lista de empresas. Verifique sua conexão e tente novamente.
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
            placeholder="Buscar empresas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Empresa</span>
        </button>
      </div>

      {/* Companies grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma empresa encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando uma nova empresa.'}
              </p>
            </div>
          </div>
        ) : (
          filteredCompanies.map((company) => (
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
                  disabled={deleteMutation.isPending}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(company.uuid)}
                  className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
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
