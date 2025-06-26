import { Building, Mic, PersonStanding, Search, Utensils } from 'lucide-react';
import { useState } from 'react';
import MapView from './components/MapView';

declare global {
  interface Window {
    L: any;
  }
}

const filters = [
  { name: 'Stands', icon: Building },
  { name: 'Comida', icon: Utensils },
  { name: 'Shows', icon: Mic },
  { name: 'WC', icon: PersonStanding },
];

export function MapScreen() {
  const [activeFilter, setActiveFilter] = useState('Comida');

  return (
    <main className="flex min-h-screen flex-col bg-base-white text-base-black">
      <div className="space-y-4 p-4 pt-6">
        <div className="flex items-center rounded-lg bg-gray-100 p-2">
          <Search className="mr-2 h-5 w-5 text-gray-500" />
          <input type="text" placeholder="Search" className="w-full bg-transparent focus:outline-none" />
        </div>
        <div className="no-scrollbar flex space-x-2 overflow-x-auto">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.name;
            return (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className={`flex shrink-0 items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-500 text-base-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{filter.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex-1">
        <MapView />
      </div>
    </main>
  );
}
