
import React from "react";
import { WeatherLayerType } from "./weatherLayers";

interface MapLegendProps {
  activeLayer: WeatherLayerType;
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeLayer }) => {
  return (
    <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
      <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
        Tingkat Risiko Banjir
      </h4>
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-gray-700 dark:text-gray-300 text-sm">Risiko Tinggi (80%+)</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            Risiko Sedang (60-79%)
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            Risiko Rendah (40-59%)
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            Risiko Minimal (0-39%)
          </span>
        </div>
      </div>

      {activeLayer === "temperature" && (
        <div className="mb-6">
          <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
            Skala Suhu
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-gray-700 dark:text-gray-300 text-sm">0°C - Dingin</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-cyan-400"></div>
              <span className="text-gray-700 dark:text-gray-300 text-sm">10°C - Sejuk</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-700 dark:text-gray-300 text-sm">20°C - Normal</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-gray-700 dark:text-gray-300 text-sm">30°C - Hangat</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-gray-700 dark:text-gray-300 text-sm">40°C+ - Panas</span>
            </div>
          </div>
        </div>
      )}

      <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Jenis Lokasi</h4>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-5 h-5 bg-blue-500 border-2 border-blue-600 transform rotate-45"
            style={{ borderRadius: "50% 50% 50% 0%" }}
          ></div>
          <span className="text-gray-700 dark:text-gray-300 text-sm">Pintu Air</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-emerald-500 border-2 border-emerald-600 rounded-sm"></div>
          <span className="text-gray-700 dark:text-gray-300 text-sm">Daerah</span>
        </div>
      </div>
    </div>
  );
};
