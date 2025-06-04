import React from "react";
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Building2,
  CloudRain,
  Waves,
} from "lucide-react";
import { LocationData } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";
import { useWaterLevel } from "../contexts/WaterLevelContext";

interface WeatherCardProps {
  location: LocationData;
  isSelected: boolean;
  onSelect: () => void;
  isRealTime: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  isSelected,
  onSelect,
  isRealTime,
}) => {
  const { waterLevels } = useWaterLevel();

  const getRiskColorScheme = (risk: number) => {
    if (risk >= 80)
      return {
        bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30",
        border: "border-red-200 dark:border-red-700",
        shadow: "shadow-red-100 dark:shadow-red-900/20",
        accent: "bg-red-500",
        text: "text-red-700 dark:text-red-300",
        badgeBg: "bg-red-500/10 border-red-300 dark:border-red-600",
        badgeText: "text-red-700 dark:text-red-300",
      };
    if (risk >= 60)
      return {
        bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30",
        border: "border-orange-200 dark:border-orange-700",
        shadow: "shadow-orange-100 dark:shadow-orange-900/20",
        accent: "bg-orange-500",
        text: "text-orange-700 dark:text-orange-300",
        badgeBg: "bg-orange-500/10 border-orange-300 dark:border-orange-600",
        badgeText: "text-orange-700 dark:text-orange-300",
      };
    if (risk >= 40)
      return {
        bg: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30",
        border: "border-yellow-200 dark:border-yellow-700",
        shadow: "shadow-yellow-100 dark:shadow-yellow-900/20",
        accent: "bg-yellow-500",
        text: "text-yellow-700 dark:text-yellow-300",
        badgeBg: "bg-yellow-500/10 border-yellow-300 dark:border-yellow-600",
        badgeText: "text-yellow-700 dark:text-yellow-300",
      };
    return {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30",
      border: "border-emerald-200 dark:border-emerald-700",
      shadow: "shadow-emerald-100 dark:shadow-emerald-900/20",
      accent: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-300",
      badgeBg: "bg-emerald-500/10 border-emerald-300 dark:border-emerald-600",
      badgeText: "text-emerald-700 dark:text-emerald-300",
    };
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 80) return "Tinggi";
    if (risk >= 60) return "Sedang";
    if (risk >= 40) return "Rendah";
    return "Minim";
  };

  const isWatergate = location.type === "watergate";
  const riskColors = location.weather
    ? getRiskColorScheme(location.weather.floodRisk)
    : getRiskColorScheme(0);

  // Get water level - use real-time data if available and in real-time mode
  const getWaterLevel = () => {
    if (!isWatergate || !location.weather?.waterLevel) return null;
    
    if (isRealTime && waterLevels[location.id]) {
      return waterLevels[location.id];
    }
    
    return location.weather.waterLevel;
  };

  const waterLevel = getWaterLevel();

  const getCardStyle = () => {
    const baseClasses = `relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${riskColors.bg} ${riskColors.border} border`;

    if (isSelected) {
      return `${baseClasses} ring-2 ring-blue-400/50 shadow-lg ${riskColors.shadow} scale-[1.01]`;
    }

    return `${baseClasses} shadow-md hover:shadow-lg ${riskColors.shadow}`;
  };

  const getTypeIndicator = () => {
    if (isWatergate) {
      return (
        <div className="flex items-center space-x-1 bg-blue-500/10 border border-blue-300 dark:border-blue-600 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
          <Droplets className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 text-[10px] font-medium">
            Pintu Air
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-300 dark:border-emerald-600 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
          <Building2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-emerald-700 dark:text-emerald-300 text-[10px] font-medium">
            Daerah
          </span>
        </div>
      );
    }
  };

  return (
    <div onClick={onSelect} className={getCardStyle()}>
      {/* Risk accent bar */}
      {location.weather && (
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 ${riskColors.accent}`}
        />
      )}

      <div className="p-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start space-x-2 flex-1 min-w-0">
            {location.weather && (
              <div className="relative flex-shrink-0">
                <WeatherIcon
                  weatherCode={location.weather.weatherCode || 0}
                  floodRisk={location.weather.floodRisk}
                  className="w-5 h-5"
                />
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${riskColors.accent} border border-white dark:border-gray-800`}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 dark:text-white font-bold text-xs leading-tight truncate">
                {location.name}
              </h3>
              <div className="mt-0.5">{getTypeIndicator()}</div>
            </div>
          </div>
          {location.weather && (
            <div
              className={`px-1.5 py-1 ml-1 rounded-lg text-xs font-bold border ${riskColors.badgeBg} ${riskColors.badgeText} backdrop-blur-sm flex-shrink-0`}
            >
              <div className="text-center">
                <div className="text-[9px] opacity-75">
                  {getRiskLabel(location.weather.floodRisk)}
                </div>
                <div className="text-xs font-black">
                  {location.weather.floodRisk}%
                </div>
              </div>
            </div>
          )}
        </div>

        {location.weather ? (
          <div className="space-y-1.5">
            {/* Water Level for Watergates */}
            {isWatergate && waterLevel && (
              <div className="bg-blue-500/10 border border-blue-300 dark:border-blue-600 rounded-lg p-1.5 backdrop-blur-sm mb-2">
                <div className="flex items-center space-x-1.5">
                  <div className="p-0.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <Waves className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] text-blue-600 dark:text-blue-400 font-medium">
                      Tinggi Air {isRealTime ? "Real-time" : "Historis"}
                    </p>
                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300">
                      {waterLevel.toFixed(2)}m
                    </p>
                  </div>
                  {isRealTime && (
                    <div className="text-[8px] text-blue-500 dark:text-blue-400 font-medium">
                      LIVE
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center space-x-1.5 bg-white/50 dark:bg-black/20 rounded-lg p-1.5 backdrop-blur-sm">
                <div className="p-0.5 bg-red-100 dark:bg-red-900/30 rounded">
                  <Thermometer className="w-2.5 h-2.5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">
                    Suhu
                  </p>
                  <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                    {location.weather.temperature}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/50 dark:bg-black/20 rounded-lg p-1.5 backdrop-blur-sm">
                <div className="p-0.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                  <Droplets className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">
                    Kelembaban
                  </p>
                  <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                    {location.weather.humidity}%
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center space-x-1.5 bg-white/50 dark:bg-black/20 rounded-lg p-1.5 backdrop-blur-sm">
                <div className="p-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                  <Wind className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">
                    Angin
                  </p>
                  <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                    {location.weather.windSpeed}km/h
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/50 dark:bg-black/20 rounded-lg p-1.5 backdrop-blur-sm">
                <div className="p-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded">
                  <CloudRain className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">
                    Curah Hujan
                  </p>
                  <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                    {location.weather.precipitation}mm
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/30 dark:bg-black/20 rounded-lg p-1.5 backdrop-blur-sm">
              <p className="text-gray-700 dark:text-gray-300 text-[10px]">
                <span className="text-gray-500 dark:text-gray-400">
                  Cuaca:{" "}
                </span>
                <span className="font-medium">
                  {location.weather.description}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-1.5 text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-black/20 rounded-lg p-2 backdrop-blur-sm">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[10px] font-medium">
              Weather data unavailable
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
