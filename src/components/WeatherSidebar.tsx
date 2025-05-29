
import React from 'react';
import { ChevronDown, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
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
    <div className="w-96 bg-gray-800 border-r border-gray-700 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Weather Report</h2>
        <p className="text-gray-400 text-sm mb-4">Jakarta Utara</p>
        
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'risk' | 'temperature')}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="risk">Sort by Flood Risk</option>
            <option value="temperature">Sort by Temperature</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
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
