import React, { useState } from "react";
import { Button } from "../ui/button";
import { Thermometer, Map, Waves, Settings, X } from "lucide-react";

interface HeatmapControlsProps {
  showHeatmap: boolean;
  onToggleHeatmap: (show: boolean) => void;
}

export const HeatmapControls: React.FC<HeatmapControlsProps> = ({
  showHeatmap,
  onToggleHeatmap,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-24 right-4 md:hidden z-10 bg-white/90 backdrop-blur-sm shadow-lg"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
      </Button>

      {/* Controls Panel */}
      <div
        className={`
          absolute top-24 right-4 bg-white dark:bg-gray-800 rounded-xl p-4 
          shadow-lg border border-gray-200 dark:border-gray-700 z-10
          transition-all duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-[200%]"}
        `}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
            Mode Tampilan
          </h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="md:hidden -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onToggleHeatmap(false)}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !showHeatmap
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Marker
          </button>
          <button
            onClick={() => onToggleHeatmap(true)}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showHeatmap
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Resiko Banjir
          </button>
        </div>

        {showHeatmap && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              🚰 Data bergantung pada status terkini Pintu Air
            </p>
          </div>
        )}
      </div>
    </>
  );
};
