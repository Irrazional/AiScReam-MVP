
import React, { useState } from 'react';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { LocationData } from '../types/weather';
import { WeatherCard } from './WeatherCard';
import { LocationFilter, FilterOptions } from './LocationFilter';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredLocations = locations.filter(location => {
    if (location.type === 'watergate') {
      return filters.showWatergates;
    } else {
      return filters.showVillages;
    }
  });

  const getSortLabel = (sortType: string) => {
    switch (sortType) {
      case 'name': return 'Sort by Name';
      case 'risk': return 'Sort by Flood Risk';
      case 'temperature': return 'Sort by Temperature';
      default: return 'Sort by Name';
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="w-6 h-6"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Weather Report</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Jakarta Utara</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="w-8 h-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 dark:hover:text-blue-300">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Filter & Sort</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onSortChange('name')}>
                Sort by Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('risk')}>
                Sort by Flood Risk
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange('temperature')}>
                Sort by Temperature
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <div className="p-2">
                <LocationFilter 
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
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
