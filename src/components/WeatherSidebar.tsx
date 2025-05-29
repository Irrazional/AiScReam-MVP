
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LocationData } from '../types/weather';
import { WeatherCard } from './WeatherCard';
import { LocationFilter } from './LocationFilter';

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
  const [showWatergates, setShowWatergates] = useState(true);
  const [showVillages, setShowVillages] = useState(true);

  // Filter locations based on checkboxes
  const filteredLocations = locations.filter(location => {
    if (location.type === 'watergate' && !showWatergates) return false;
    if (location.type === 'village' && !showVillages) return false;
    return true;
  });

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    switch (sortBy) {
      case 'risk':
        return (b.weather?.floodRisk || 0) - (a.weather?.floodRisk || 0);
      case 'temperature':
        return (b.weather?.temperature || 0) - (a.weather?.temperature || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="w-96 bg-background border-r border-border overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">Weather Report</h2>
        <p className="text-muted-foreground text-sm mb-4">Jakarta Utara</p>
        
        <div className="space-y-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'name' | 'risk' | 'temperature')}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-naples_yellow-500"
            >
              <option value="name">Sort by Name</option>
              <option value="risk">Sort by Flood Risk</option>
              <option value="temperature">Sort by Temperature</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          <LocationFilter
            showWatergates={showWatergates}
            showVillages={showVillages}
            onWatergateToggle={setShowWatergates}
            onVillageToggle={setShowVillages}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-naples_yellow-500"></div>
          </div>
        ) : (
          sortedLocations.map((location) => (
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
