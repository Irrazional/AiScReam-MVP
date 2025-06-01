
import React from 'react';
import { MapPin, Thermometer, Droplets, Wind, AlertTriangle, Building2, CloudRain } from 'lucide-react';
import { LocationData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  location: LocationData;
  isSelected: boolean;
  onSelect: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  isSelected,
  onSelect,
}) => {
  const getRiskColorScheme = (risk: number) => {
    if (risk >= 80) return {
      bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30',
      border: 'border-red-200 dark:border-red-700',
      shadow: 'shadow-red-100 dark:shadow-red-900/20',
      accent: 'bg-red-500',
      text: 'text-red-700 dark:text-red-300',
      badgeBg: 'bg-red-500/10 border-red-300 dark:border-red-600',
      badgeText: 'text-red-700 dark:text-red-300'
    };
    if (risk >= 60) return {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30',
      border: 'border-orange-200 dark:border-orange-700',
      shadow: 'shadow-orange-100 dark:shadow-orange-900/20',
      accent: 'bg-orange-500',
      text: 'text-orange-700 dark:text-orange-300',
      badgeBg: 'bg-orange-500/10 border-orange-300 dark:border-orange-600',
      badgeText: 'text-orange-700 dark:text-orange-300'
    };
    if (risk >= 40) return {
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30',
      border: 'border-yellow-200 dark:border-yellow-700',
      shadow: 'shadow-yellow-100 dark:shadow-yellow-900/20',
      accent: 'bg-yellow-500',
      text: 'text-yellow-700 dark:text-yellow-300',
      badgeBg: 'bg-yellow-500/10 border-yellow-300 dark:border-yellow-600',
      badgeText: 'text-yellow-700 dark:text-yellow-300'
    };
    return {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30',
      border: 'border-emerald-200 dark:border-emerald-700',
      shadow: 'shadow-emerald-100 dark:shadow-emerald-900/20',
      accent: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-300',
      badgeBg: 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-600',
      badgeText: 'text-emerald-700 dark:text-emerald-300'
    };
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 80) return 'High Risk';
    if (risk >= 60) return 'Moderate Risk';
    if (risk >= 40) return 'Low Risk';
    return 'Minimal Risk';
  };

  const isWatergate = location.type === 'watergate';
  const riskColors = location.weather ? getRiskColorScheme(location.weather.floodRisk) : getRiskColorScheme(0);
  
  const getCardStyle = () => {
    const baseClasses = `relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${riskColors.bg} ${riskColors.border} border-2`;
    
    if (isSelected) {
      return `${baseClasses} ring-4 ring-blue-400/50 shadow-2xl ${riskColors.shadow} scale-[1.02]`;
    }
    
    return `${baseClasses} shadow-lg hover:shadow-xl ${riskColors.shadow}`;
  };

  const getTypeIndicator = () => {
    if (isWatergate) {
      return (
        <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-300 dark:border-blue-600 px-3 py-2 rounded-full backdrop-blur-sm">
          <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 text-sm font-semibold">Pintu Air</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-300 dark:border-emerald-600 px-3 py-2 rounded-full backdrop-blur-sm">
          <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-emerald-700 dark:text-emerald-300 text-sm font-semibold">Daerah</span>
        </div>
      );
    }
  };

  return (
    <div onClick={onSelect} className={getCardStyle()}>
      {/* Risk accent bar */}
      {location.weather && (
        <div className={`absolute top-0 left-0 right-0 h-1 ${riskColors.accent}`} />
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start space-x-4 flex-1">
            {location.weather && (
              <div className="relative">
                <WeatherIcon
                  weatherCode={location.weather.weatherCode || 0}
                  floodRisk={location.weather.floodRisk}
                  className="w-10 h-10 mt-1"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${riskColors.accent} border-2 border-white dark:border-gray-800`} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">{location.name}</h3>
              </div>
              {getTypeIndicator()}
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 font-medium">
                {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
              </p>
            </div>
          </div>
          {location.weather && (
            <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${riskColors.badgeBg} ${riskColors.badgeText} backdrop-blur-sm`}>
              <div className="text-center">
                <div className="text-xs opacity-75">{getRiskLabel(location.weather.floodRisk)}</div>
                <div className="text-lg font-black">{location.weather.floodRisk}%</div>
              </div>
            </div>
          )}
        </div>

        {location.weather ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm" title="Temperature">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Thermometer className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Temperature</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{location.weather.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm" title="Humidity">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Humidity</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{location.weather.humidity}%</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm" title="Wind Speed">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Wind className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Wind</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{location.weather.windSpeed} km/h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm" title="Precipitation">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <CloudRain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rain</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{location.weather.precipitation}mm</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/30 dark:border-gray-600">
              <div className="bg-white/30 dark:bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Weather:</span>
                  <br />
                  <span className="font-semibold">{location.weather.description}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3 text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-black/20 rounded-xl p-6 backdrop-blur-sm">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Weather data unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
};
