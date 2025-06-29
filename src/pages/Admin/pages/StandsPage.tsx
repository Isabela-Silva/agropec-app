import { Clock, Edit2, MapPin, Plus, Search, Store, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Stand } from '../types';

export function StandsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stands] = useState<Stand[]>([
    {
      uuid: '1',
      name: 'Stand AgroPec Tech',
      description: 'Tecnologias inovadoras para o agronegócio',
      categoryId: '1',
      latitude: -23.5505,
      longitude: -46.6333,
      imageUrl: 'https://via.placeholder.com/300x200',
      date: '2024-03-15',
      companyId: '1',
      openingHours: {
        openingTime: '08:00',
        closingTime: '18:00',
      },
    },
    {
      uuid: '2',
      name: 'Stand Verde Campo',
      description: 'Equipamentos e soluções para agricultura',
      categoryId: '2',
      latitude: -23.5505,
      longitude: -46.6333,
      imageUrl: 'https://via.placeholder.com/300x200',
      date: '2024-03-15',
      companyId: '2',
      openingHours: {
        openingTime: '09:00',
        closingTime: '17:00',
      },
    },
  ]);

  const filteredStands = stands.filter(
    (stand: Stand) =>
      stand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stand.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Stand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStands.map((stand) => (
          <div key={stand.uuid} className="card">
            <img src={stand.imageUrl} alt={stand.name} className="h-48 w-full rounded-t-lg object-cover" />
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
                    {stand.openingHours.openingTime} - {stand.openingHours.closingTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>
                    {stand.latitude.toFixed(4)}, {stand.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-gray-200 p-4">
              <button className="text-admin-primary-600 hover:text-admin-primary-900 hover:bg-admin-primary-50 rounded-md p-2">
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-900">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
