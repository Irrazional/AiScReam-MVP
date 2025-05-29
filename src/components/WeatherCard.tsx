
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
  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800';
    if (risk >= 60) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800';
    if (risk >= 40) return 'text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800';
    return 'text-green-700 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800';
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 80) return 'High Risk';
    if (risk >= 60) return 'Moderate Risk';
    if (risk >= 40) return 'Low Risk';
    return 'Minimal Risk';
  };

  const isWatergate = location.type === 'watergate';
  
  const getCardStyle = () => {
    const baseClasses = "bg-white dark:bg-gray-800 rounded-xl p-5 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md";
    
    if (isSelected) {
      return `${baseClasses} ring-2 ring-blue-500 shadow-lg`;
    }
    
    return `${baseClasses} border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600`;
  };

  const getTypeIndicator = () => {
    if (isWatergate) {
      return (
        <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
          <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">Pintu Air</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
          <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Daerah</span>
        </div>
      );
    }
  };

  return (
    <div
      onClick={onSelect}
      className={getCardStyle()}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {location.weather && (
            <WeatherIcon
              weatherCode={location.weather.weatherCode || 0}
              floodRisk={location.weather.floodRisk}
              className="w-8 h-8 mt-1"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{location.name}</h3>
            </div>
            {getTypeIndicator()}
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
            </p>
          </div>
        </div>
        {location.weather && (
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRiskColor(location.weather.floodRisk)}`}>
            {getRiskLabel(location.weather.floodRisk)} ({location.weather.floodRisk}%)
          </div>
        )}
      </div>

      {location.weather ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2" title="Temperature">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{location.weather.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2" title="Humidity">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{location.weather.humidity}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2" title="Wind Speed">
              <Wind className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{location.weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center space-x-2" title="Precipitation">
              <CloudRain className="w-4 h-4 text-indigo-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{location.weather.precipitation}mm</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Weather:</span> {location.weather.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Weather data unavailable</span>
        </div>
      )}
    </div>
  );
};
