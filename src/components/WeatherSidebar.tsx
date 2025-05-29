
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { LocationData } from '../types/weather';
import { WeatherCard } from './WeatherCard';

interface WeatherSidebarProps {
  locations: LocationData[];
  loading: boolean;
  sortBy: 'name' | 'risk' | 'temperature';
  onSortChange: (sortBy: 'name' | 'risk' | 'temperature') => void;
  onLocationSelect: (location: LocationData | null) => void;
  selectedLocation: LocationData | null;
}

export const WeatherSidebar: React.FC<WeatherSidebarProps> = ({
  locations,
  loading,
  sortBy,
  onSortChange,
  onLocationSelect,
  selectedLocation,
}) => {
  return (
    <div className="w-96 bg-paynes_gray-500 border-r border-paynes_gray-400 overflow-hidden flex flex-col dark:bg-rich_black-500 dark:border-rich_black-300">
      <div className="p-6 border-b border-paynes_gray-400 dark:border-rich_black-300">
        <h2 className="text-xl font-semibold text-mint_cream-500 mb-4">Weather Report</h2>
        <p className="text-beige-400 text-sm mb-4">Jakarta Utara</p>
        
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'risk' | 'temperature')}
            className="w-full bg-paynes_gray-400 border border-paynes_gray-300 rounded-lg px-4 py-2 text-mint_cream-500 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky_blue-500 dark:bg-rich_black-400 dark:border-rich_black-300"
          >
            <option value="name">Sort by Name</option>
            <option value="risk">Sort by Flood Risk</option>
            <option value="temperature">Sort by Temperature</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-beige-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky_blue-500"></div>
          </div>
        ) : (
          locations.map((location) => (
            <WeatherCard
              key={location.id}
              location={location}
              isSelected={selectedLocation?.id === location.id}
              onSelect={() => onLocationSelect(location)}
            />
          ))
        )}
      </div>
    </div>
  );
};
