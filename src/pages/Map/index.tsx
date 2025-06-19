import React, { useState } from "react";
import { Search, Building, Utensils, Mic, PersonStanding } from "lucide-react";
import BottomNavBar from "../../components/BottomNavBar";
import MapView from "./components/MapView";

declare global {
  interface Window {
    L: any;
  }
}

const filters = [
  { name: "Stands", icon: Building },
  { name: "Comida", icon: Utensils },
  { name: "Shows", icon: Mic },
  { name: "WC", icon: PersonStanding },
];

const MapScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("Comida");

  return (
    <div className="bg-base-white text-base-black min-h-screen flex flex-col">
      <div className="p-4 pt-6 space-y-4">
        <div className="flex items-center bg-gray-100 p-2 rounded-lg">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none flex-1"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto no-scrollbar">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.name;
            return (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-500 text-base-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{filter.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 relative -mt-2">
        <MapView />
      </div>

      <BottomNavBar />
    </div>
  );
};

export default MapScreen;
