
import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Droplets, Building2 } from 'lucide-react';

export interface FilterOptions {
  showWatergates: boolean;
  showVillages: boolean;
}

interface LocationFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleWatergateChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      showWatergates: checked,
    });
  };

  const handleVillageChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      showVillages: checked,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Filter Locations</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="watergates"
            checked={filters.showWatergates}
            onCheckedChange={handleWatergateChange}
            className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          />
          <label
            htmlFor="watergates"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>Watergates</span>
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <Checkbox
            id="villages"
            checked={filters.showVillages}
            onCheckedChange={handleVillageChange}
            className="border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <label
            htmlFor="villages"
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span>Villages</span>
          </label>
        </div>
      </div>
    </div>
  );
};
