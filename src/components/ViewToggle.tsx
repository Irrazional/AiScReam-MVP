
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
    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/30">
      <Button
        variant={currentView === 'basic' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('basic')}
        className={`flex items-center space-x-2 transition-all duration-200 ${
          currentView === 'basic' 
            ? 'bg-white text-blue-600 hover:bg-white/90' 
            : 'text-white hover:bg-white/20'
        }`}
      >
        <Map className="w-4 h-4" />
        <span>Sederhana</span>
      </Button>
      <Button
        variant={currentView === 'advanced' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('advanced')}
        className={`flex items-center space-x-2 transition-all duration-200 ${
          currentView === 'advanced' 
            ? 'bg-white text-blue-600 hover:bg-white/90' 
            : 'text-white hover:bg-white/20'
        }`}
      >
        <Radar className="w-4 h-4" />
        <span>Detail</span>
      </Button>
    </div>
  );
};
