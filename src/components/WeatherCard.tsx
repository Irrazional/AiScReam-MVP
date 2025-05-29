
import React from 'react';
import { MapPin, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { LocationData } from '../types/weather';

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
    if (risk >= 80) return 'text-red-400 bg-red-900/20';
    if (risk >= 60) return 'text-orange-400 bg-orange-900/20';
    if (risk >= 40) return 'text-yellow-400 bg-yellow-900/20';
    return 'text-green-400 bg-green-900/20';
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 80) return 'High Risk';
    if (risk >= 60) return 'Moderate Risk';
    if (risk >= 40) return 'Low Risk';
    return 'Minimal Risk';
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'border-blue-500 bg-gray-600'
          : 'border-gray-600 hover:border-gray-500 hover:bg-gray-650'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <h3 className="text-white font-medium">{location.name}</h3>
          </div>
          <p className="text-gray-400 text-sm">
            {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
          </p>
        </div>
        {location.weather && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(location.weather.floodRisk)}`}>
            {getRiskLabel(location.weather.floodRisk)}
          </div>
        )}
      </div>

      {location.weather ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">{location.weather.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">{location.weather.humidity}%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">{location.weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">{location.weather.precipitation}mm</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-600">
            <p className="text-gray-300 text-sm">
              <span className="text-gray-400">Weather:</span> {location.weather.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-gray-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Weather data unavailable</span>
        </div>
      )}
    </div>
  );
};
