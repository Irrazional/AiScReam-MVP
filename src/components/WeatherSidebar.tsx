
import React from "react";
import { LocationData } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { Progress } from "./ui/progress";
import { X } from "lucide-react";

interface WeatherSidebarProps {
  location: LocationData | null;
  onClose: () => void;
}

export const WeatherSidebar: React.FC<WeatherSidebarProps> = ({
  location,
  onClose,
}) => {
  if (!location || !location.weather) {
    return null;
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "text-red-600 dark:text-red-400";
    if (risk >= 60) return "text-orange-600 dark:text-orange-400";
    if (risk >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getRiskBgColor = (risk: number) => {
    if (risk >= 80) return "bg-red-100 dark:bg-red-900/20";
    if (risk >= 60) return "bg-orange-100 dark:bg-orange-900/20";
    if (risk >= 40) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-green-100 dark:bg-green-900/20";
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Detail Cuaca
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {location.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {location.type === "watergate" ? "Pintu Air" : "Daerah"}
            </p>
            <WeatherIcon
              weatherCode={location.weather.weatherCode}
              floodRisk={location.weather.floodRisk}
              className="w-16 h-16 mx-auto mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400">
              {location.weather.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Kondisi Cuaca
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Suhu</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {location.weather.temperature}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Kelembaban
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {location.weather.humidity}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Curah Hujan
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {location.weather.precipitation.toFixed(3)}mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Kecepatan Angin
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {location.weather.windSpeed} km/h
                  </span>
                </div>
                {location.weather.waterLevel !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tinggi Air
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {location.weather.waterLevel}m
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`rounded-lg p-4 ${getRiskBgColor(
                location.weather.floodRisk
              )}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Risiko Banjir
                </h4>
                <span
                  className={`text-lg font-bold ${getRiskColor(
                    location.weather.floodRisk
                  )}`}
                >
                  {location.weather.floodRisk}%
                </span>
              </div>
              <Progress
                value={location.weather.floodRisk}
                className="h-3 mb-2"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {location.weather.floodRisk >= 80
                  ? "Risiko sangat tinggi - Siaga darurat"
                  : location.weather.floodRisk >= 60
                  ? "Risiko tinggi - Waspada"
                  : location.weather.floodRisk >= 40
                  ? "Risiko sedang - Pantau kondisi"
                  : "Risiko rendah - Kondisi normal"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
