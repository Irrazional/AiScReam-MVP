
import React from 'react';
import { Droplets, Building2 } from 'lucide-react';
import { Button } from './ui/button';

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
  const handleWatergateToggle = () => {
    onFilterChange({
      ...filters,
      showWatergates: !filters.showWatergates,
    });
  };

  const handleVillageToggle = () => {
    onFilterChange({
      ...filters,
      showVillages: !filters.showVillages,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={filters.showWatergates ? "default" : "outline"}
        size="sm"
        onClick={handleWatergateToggle}
        className="flex items-center space-x-2"
      >
        <Droplets className="w-4 h-4" />
        <span>Pintu Air ({watergateCount})</span>
      </Button>
      
      <Button
        variant={filters.showVillages ? "default" : "outline"}
        size="sm"
        onClick={handleVillageToggle}
        className="flex items-center space-x-2"
      >
        <Building2 className="w-4 h-4" />
        <span>Daerah ({villageCount})</span>
      </Button>
    </div>
  );
};
