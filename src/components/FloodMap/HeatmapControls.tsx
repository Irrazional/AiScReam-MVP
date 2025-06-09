
import React from 'react';
import { Button } from '../ui/button';
import { Thermometer, Map } from 'lucide-react';

interface HeatmapControlsProps {
  showHeatmap: boolean;
  onToggleHeatmap: (show: boolean) => void;
}

export const HeatmapControls: React.FC<HeatmapControlsProps> = ({
  showHeatmap,
  onToggleHeatmap,
}) => {
  return (
    <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
      <h4 className="text-gray-900 dark:text-white font-semibold mb-3">Mode Tampilan</h4>
      <div className="flex flex-col space-y-2">
        <Button
          variant={!showHeatmap ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleHeatmap(false)}
          className="flex items-center space-x-2 justify-start"
        >
          <Map className="w-4 h-4" />
          <span>Marker</span>
        </Button>
        <Button
          variant={showHeatmap ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleHeatmap(true)}
          className="flex items-center space-x-2 justify-start"
        >
          <Thermometer className="w-4 h-4" />
          <span>Heatmap Banjir</span>
        </Button>
      </div>
    </div>
  );
};
