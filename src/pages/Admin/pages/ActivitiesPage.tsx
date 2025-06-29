import { Calendar, Clock, Edit2, MapPin, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { Activity, Category, Company, CreateActivity } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: Activity;
  onSubmit: (data: CreateActivity | Partial<Activity>) => void;
  isLoading: boolean;
  companies: Company[];
  categories: Category[];
}

function ActivityModal({ isOpen, onClose, activity, onSubmit, isLoading, companies, categories }: ActivityModalProps) {
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    description: activity?.description || '',
    categoryId: activity?.categoryId || '',
    latitude: activity?.latitude || 0,
    longitude: activity?.longitude || 0,
    imageUrl: activity?.imageUrl || '',
    companyId: activity?.companyId || '',
    date: activity?.date || '',
    startTime: activity?.startTime || '',
    endTime: activity?.endTime || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{activity ? 'Editar Atividade' : 'Nova Atividade'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nome da Atividade</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="input"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.uuid} value={category.uuid}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Empresa</label>
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="input"
                required
              >
                <option value="">Selecione uma empresa</option>
                {companies.map((company) => (
                  <option key={company.uuid} value={company.uuid}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Horário de Início</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Horário de Término</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">URL da Imagem (opcional)</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="input"
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

export function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data para desenvolvimento
  const [activities, setActivities] = useState<Activity[]>([
    {
      uuid: '1',
      name: 'Workshop de Agricultura Sustentável',
      description: 'Aprenda técnicas modernas de agricultura sustentável',
      categoryId: '1',
      latitude: -23.5505,
      longitude: -46.6333,
      imageUrl: 'https://via.placeholder.com/300x200',
      companyId: '1',
      date: '2024-03-15',
      startTime: '09:00',
      endTime: '12:00',
    },
    {
      uuid: '2',
      name: 'Demonstração de Equipamentos',
      description: 'Veja os equipamentos mais modernos do agronegócio',
      categoryId: '2',
      latitude: -23.5505,
      longitude: -46.6333,
      companyId: '2',
      date: '2024-03-16',
      startTime: '14:00',
      endTime: '17:00',
    },
  ]);

  const companies: Company[] = [
    { uuid: '1', name: 'AgroPec Soluções', description: 'Empresa tech' },
    { uuid: '2', name: 'Verde Campo Ltda', description: 'Equipamentos' },
  ];

  const categories: Category[] = [
    { uuid: '1', name: 'Agricultura Sustentável' },
    { uuid: '2', name: 'Máquinas Agrícolas' },
  ];

  const filteredActivities = activities.filter(
    (activity: Activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedActivity(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      setIsSubmitting(true);
      setTimeout(() => {
        setActivities((prev) => prev.filter((activity) => activity.uuid !== uuid));
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleSubmit = async (data: CreateActivity | Partial<Activity>) => {
    setIsSubmitting(true);

    setTimeout(() => {
      if (selectedActivity) {
        setActivities((prev) =>
          prev.map((activity) => (activity.uuid === selectedActivity.uuid ? { ...activity, ...data } : activity)),
        );
      } else {
        const newActivity: Activity = {
          uuid: Math.random().toString(36).substr(2, 9),
          ...(data as CreateActivity),
        };
        setActivities((prev) => [...prev, newActivity]);
      }
      setIsModalOpen(false);
      setSelectedActivity(undefined);
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
            {activity.imageUrl && (
              <img src={activity.imageUrl} alt={activity.name} className="h-48 w-full rounded-t-lg object-cover" />
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
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>
                    {activity.latitude.toFixed(4)}, {activity.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-gray-200 p-4">
              <button
                onClick={() => handleEdit(activity)}
                className="text-admin-primary-600 hover:text-admin-primary-900 hover:bg-admin-primary-50 rounded-md p-2"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(activity.uuid)}
                className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
              </button>
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

      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(undefined);
        }}
        activity={selectedActivity}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        companies={companies}
        categories={categories}
      />
    </div>
  );
}
