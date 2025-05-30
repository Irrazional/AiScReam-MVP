
import React from 'react';
import { Button } from './ui/button';
import { Map, Radar } from 'lucide-react';

interface ViewToggleProps {
  currentView: 'basic' | 'advanced';
  onViewChange: (view: 'basic' | 'advanced') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
      <Button
        variant={currentView === 'basic' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('basic')}
        className="flex items-center space-x-2"
      >
        <Map className="w-4 h-4" />
        <span>Sederhana</span>
      </Button>
      <Button
        variant={currentView === 'advanced' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('advanced')}
        className="flex items-center space-x-2"
      >
        <Radar className="w-4 h-4" />
        <span>Detail</span>
      </Button>
    </div>
  );
};
