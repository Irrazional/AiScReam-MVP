
import React from "react";
import { LocationData } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { Progress } from "./ui/progress";

interface WeatherCardProps {
  location: LocationData;
  onClick: () => void;
  isSelected: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  onClick,
  isSelected,
}) => {
  if (!location.weather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-xl transition-shadow">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No weather data available
        </div>
      </div>
    );
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
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border transition-all cursor-pointer hover:shadow-xl ${
        isSelected
          ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800"
          : "border-gray-200 dark:border-gray-700"
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {location.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {location.type === "watergate" ? "Pintu Air" : "Daerah"}
            </p>
          </div>
          <WeatherIcon
            weatherCode={location.weather.weatherCode}
            className="w-12 h-12"
          />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Suhu
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {location.weather.temperature}°C
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Kelembaban
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {location.weather.humidity}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Curah Hujan
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {location.weather.precipitation.toFixed(3)}mm
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Kecepatan Angin
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {location.weather.windSpeed} km/h
            </span>
          </div>

          {location.weather.waterLevel !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tinggi Air
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {location.weather.waterLevel}m
              </span>
            </div>
          )}
        </div>

        <div
          className={`rounded-lg p-3 ${getRiskBgColor(
            location.weather.floodRisk
          )}`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Risiko Banjir
            </span>
            <span
              className={`text-sm font-bold ${getRiskColor(
                location.weather.floodRisk
              )}`}
            >
              {location.weather.floodRisk}%
            </span>
          </div>
          <Progress
            value={location.weather.floodRisk}
            className="h-2"
          />
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {location.weather.description}
          </p>
        </div>
      </div>
    </div>
  );
};
