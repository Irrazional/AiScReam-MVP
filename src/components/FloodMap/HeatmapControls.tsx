
import React from 'react';
import { Button } from '../ui/button';
import { Thermometer, Map, Waves } from 'lucide-react';

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
      <h4 className="text-gray-900 dark:text-white font-semibold mb-3 flex items-center gap-2">
        <Waves className="w-4 h-4" />
        Mode Tampilan
      </h4>
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
          <span>Heatmap Risiko</span>
        </Button>
      </div>
      
      {showHeatmap && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Area dengan warna lebih merah menunjukkan risiko banjir yang lebih tinggi
          </p>
        </div>
      )}
    </div>
  );
};
