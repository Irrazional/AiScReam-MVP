
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { LocationData } from '../types/weather';
import { WeatherCard } from './WeatherCard';
import { LocationFilter, FilterOptions } from './LocationFilter';

interface WeatherSidebarProps {
  locations: LocationData[];
  loading: boolean;
  sortBy: 'name' | 'risk' | 'temperature';
  onSortChange: (sortBy: 'name' | 'risk' | 'temperature') => void;
  onLocationSelect: (location: LocationData | null) => void;
  selectedLocation: LocationData | null;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const WeatherSidebar: React.FC<WeatherSidebarProps> = ({
  locations,
  loading,
  sortBy,
  onSortChange,
  onLocationSelect,
  selectedLocation,
  filters,
  onFilterChange,
}) => {
  const filteredLocations = locations.filter(location => {
    if (location.type === 'watergate') {
      return filters.showWatergates;
    } else {
      return filters.showVillages;
    }
  });

  return (
    <div className="w-96 bg-gray-50 border-r border-gray-200 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Weather Report</h2>
        <p className="text-gray-600 text-sm mb-6">Jakarta Utara</p>
        
        <div className="relative mb-6">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'risk' | 'temperature')}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="risk">Sort by Flood Risk</option>
            <option value="temperature">Sort by Temperature</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <LocationFilter 
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          filteredLocations.map((location) => (
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
