
import React from 'react';
import { Checkbox } from './ui/checkbox';

interface LocationFilterProps {
  showWatergates: boolean;
  showVillages: boolean;
  onWatergateToggle: (checked: boolean) => void;
  onVillageToggle: (checked: boolean) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  showWatergates,
  showVillages,
  onWatergateToggle,
  onVillageToggle,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Filter Locations</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="watergates"
            checked={showWatergates}
            onCheckedChange={onWatergateToggle}
          />
          <label htmlFor="watergates" className="text-sm text-muted-foreground cursor-pointer">
            Watergates
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="villages"
            checked={showVillages}
            onCheckedChange={onVillageToggle}
          />
          <label htmlFor="villages" className="text-sm text-muted-foreground cursor-pointer">
            Villages
          </label>
        </div>
      </div>
    </div>
  );
};
