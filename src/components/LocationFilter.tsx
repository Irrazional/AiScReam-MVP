
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
  watergateCount: number;
  villageCount: number;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  filters,
  onFilterChange,
  watergateCount,
  villageCount,
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
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Checkbox
          id="watergates"
          checked={filters.showWatergates}
          onCheckedChange={handleWatergateChange}
        />
        <label
          htmlFor="watergates"
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          <Droplets className="w-4 h-4 text-blue-500" />
          <span>Pintu Air ({watergateCount})</span>
        </label>
      </div>
      
      <div className="flex items-center space-x-3">
        <Checkbox
          id="villages"
          checked={filters.showVillages}
          onCheckedChange={handleVillageChange}
        />
        <label
          htmlFor="villages"
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>Daerah ({villageCount})</span>
        </label>
      </div>
    </div>
  );
};
