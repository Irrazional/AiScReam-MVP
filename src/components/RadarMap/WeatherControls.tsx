
import React from "react";
import { WeatherLayerType } from "./weatherLayers";

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
  const layerButtons = [
    { key: "precipitation" as const, label: "Curah Hujan" },
    { key: "temperature" as const, label: "Suhu (Heatmap)" },
    { key: "wind" as const, label: "Angin" },
    { key: "pressure" as const, label: "Tekanan" },
  ];

  return (
    <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
      <h4 className="text-gray-900 dark:text-white font-semibold mb-3">Layer Cuaca</h4>
      <div className="space-y-2">
        {layerButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onLayerChange(key)}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === key
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>

      <button
        onClick={onShowRealTimeStats}
        className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>Real Time Statistik</span>
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onResetApiKey}
          className="w-full text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2"
        >
          Reset API Key
        </button>
      </div>
    </div>
  );
};
