import React, { useState } from "react";
import { WeatherLayerType } from "./weatherLayers";
import { Settings, X } from "lucide-react";
import { Button } from "../ui/button";

interface WeatherControlsProps {
  activeLayer: WeatherLayerType;
  onLayerChange: (layer: WeatherLayerType) => void;
  onShowRealTimeStats: () => void;
  onResetApiKey: () => void;
}

export const WeatherControls: React.FC<WeatherControlsProps> = ({
  activeLayer,
  onLayerChange,
  onShowRealTimeStats,
  onResetApiKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const layerButtons = [
    { key: "precipitation" as const, label: "Curah Hujan" },
    { key: "temperature" as const, label: "Suhu (Heatmap)" },
    { key: "wind" as const, label: "Angin" },
  ];

  const content = (
    <>
      <h4 className="text-gray-900 dark:text-white font-semibold mb-3 md:mb-4">
        Layer Cuaca
      </h4>
      <div className="space-y-2">
        {layerButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onLayerChange(key)}
            className={`w-full px-3 py-2 rounded-lg md:text-sm text-xs font-medium transition-colors ${
              activeLayer === key
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 my-3 md:my-4"></div>

      <button
        onClick={onShowRealTimeStats}
        className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg md:text-sm text-xs font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
        <span>Real Time Statistik</span>
      </button>

      <div className="mt-3 pt-3 md:mt-4 md:pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onResetApiKey}
          className="w-full text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-1 md:py-2"
        >
          Reset API Key
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="absolute top-24 right-4 md:hidden z-10 bg-white/90 backdrop-blur-sm shadow-lg"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop panel */}
      <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 z-10 hidden md:block">
        {content}
      </div>

      {/* Mobile panel */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 ease-in-out p-3 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-gray-900 dark:text-white font-semibold text-sm">
            {/* Layer Cuaca */}
          </h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="-mr-1.5"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        {content}
      </div>
    </>
  );
};
