import React, { useState } from 'react';
import { Search, MapPin, Utensils, Music, Home } from 'lucide-react';
import MapView from './components/MapView';
import { FilterType } from './types';

const Map: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filters = [
    { 
      id: 'Stands' as FilterType, 
      label: 'Stands', 
      icon: <Home className="w-4 h-4" />,
      count: 0 // Será calculado dinamicamente
    },
    { 
      id: 'Comida' as FilterType, 
      label: 'Comida', 
      icon: <Utensils className="w-4 h-4" />,
      count: 0
    },
    { 
      id: 'Shows' as FilterType, 
      label: 'Shows', 
      icon: <Music className="w-4 h-4" />,
      count: 0
    }
  ];

  const handleFilterClick = (filterId: FilterType) => {
    setActiveFilter(activeFilter === filterId ? '' : filterId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mapa em fullscreen - camada base */}
      <div className="absolute inset-0 z-0">
        <MapView activeFilter={activeFilter} searchTerm={searchTerm} />
      </div>

      {/* Header estilo Google Maps - mais clean e organizado */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-3">
        {/* Barra de busca principal */}
        <div className="relative">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden floating-element">
            <div className="flex items-center px-4 py-3">
              <Search className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar local..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros organizados */}
        <div className="flex gap-2 overflow-x-auto pb-1 filter-scroll">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 floating-element
                ${activeFilter === filter.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 shadow-sm border border-gray-200 hover:shadow-md'
                }
              `}
            >
              {filter.icon}
              <span className="font-medium text-sm">{filter.label}</span>
            </button>
          ))}
          
          {/* Botão limpar - mais discreto */}
          {activeFilter && (
            <button
              onClick={() => setActiveFilter('')}
              className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md whitespace-nowrap flex-shrink-0 floating-element"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Status bar - redesenhado para combinar */}
      {(activeFilter || searchTerm) && (
        <div className="absolute bottom-24 left-4 right-4 z-30">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-3 floating-element">
            <div className="flex items-center justify-center text-sm text-gray-600">
              {activeFilter && `Filtro: ${activeFilter}`}
              {activeFilter && searchTerm && ' • '}
              {searchTerm && `Busca: "${searchTerm}"`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
