
import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Droplets, MapPin } from 'lucide-react';

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
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-mint_cream-500">Filter Locations</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="watergates"
            checked={filters.showWatergates}
            onCheckedChange={handleWatergateChange}
            className="border-paynes_gray-300 data-[state=checked]:bg-sky_blue-500 data-[state=checked]:border-sky_blue-500"
          />
          <label
            htmlFor="watergates"
            className="flex items-center space-x-2 text-sm font-medium text-mint_cream-400 cursor-pointer"
          >
            <Droplets className="w-4 h-4 text-sky_blue-500" />
            <span>Watergates</span>
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="villages"
            checked={filters.showVillages}
            onCheckedChange={handleVillageChange}
            className="border-paynes_gray-300 data-[state=checked]:bg-sky_blue-500 data-[state=checked]:border-sky_blue-500"
          />
          <label
            htmlFor="villages"
            className="flex items-center space-x-2 text-sm font-medium text-mint_cream-400 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-sky_blue-500" />
            <span>Villages</span>
          </label>
        </div>
      </div>
    </div>
  );
};
