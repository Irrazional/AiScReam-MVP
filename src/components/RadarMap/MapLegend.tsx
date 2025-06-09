import React from "react";
import { WeatherLayerType } from "./weatherLayers";

interface MapLegendProps {
  activeLayer: WeatherLayerType;
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeLayer }) => {
  return (
    <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-md:bottom-4 max-md:left-4 max-md:text-[10px] max-md:p-2 p-3">
      <h4 className="text-gray-900 dark:text-white text-sm font-semibold mb-3 max-md:text-xs max-md:mb-2">
        Tingkat Resiko Banjir
      </h4>
      <div className="space-y-2 mb-4 max-md:space-y-1.5 max-md:mb-3">
        <div className="flex items-center space-x-3 max-md:space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-500 max-md:w-2.5 max-md:h-2.5"></div>
          <span className="text-gray-700 dark:text-gray-300 text-xs max-md:text-[10px]">
            Risiko Tinggi (80%+)
          </span>
        </div>
        <div className="flex items-center space-x-3 max-md:space-x-2">
          <div className="w-4 h-4 rounded-full bg-orange-500 max-md:w-2.5 max-md:h-2.5"></div>
          <span className="text-gray-700 dark:text-gray-300 text-xs max-md:text-[10px]">
            Risiko Sedang (60-79%)
          </span>
        </div>
        <div className="flex items-center space-x-3 max-md:space-x-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500 max-md:w-2.5 max-md:h-2.5"></div>
          <span className="text-gray-700 dark:text-gray-300 text-xs max-md:text-[10px]">
            Risiko Rendah (40-59%)
          </span>
        </div>
        <div className="flex items-center space-x-3 max-md:space-x-2">
          <div className="w-4 h-4 rounded-full bg-green-500 max-md:w-2.5 max-md:h-2.5"></div>
          <span className="text-gray-700 dark:text-gray-300 text-xs max-md:text-[10px]">
            Risiko Minimal (0-39%)
          </span>
        </div>
      </div>

      <h4 className="text-gray-900 dark:text-white text-sm font-semibold mb-3 max-md:text-xs max-md:mb-2">
        Jenis Lokasi
      </h4>
      <div className="space-y-2 max-md:space-y-1.5">
        <div className="flex items-center space-x-3 max-md:space-x-2">
          <div
            className="w-5 h-5 bg-blue-500 border-2 border-blue-600 transform rotate-45 max-md:w-3 max-md:h-3 max-md:border"
            style={{ borderRadius: "50% 50% 50% 0%" }}
          ></div>
          <span className="text-gray-700 dark:text-gray-300 text-xs max-md:text-[10px]">
            Pintu Air
          </span>
        </div>
        <div className="flex items-center space-x-3 max-md:space-x-2">
          <div className="w-4 h-4 bg-emerald-500 border-2 border-emerald-600 rounded-sm max-md:w-2.5 max-md:h-2.5 max-md:border"></div>
          <span className="text-gray-700 dark:text-gray-300 text-xs max-md:text-[10px]">
            Daerah
          </span>
        </div>
      </div>
    </div>
  );
};
