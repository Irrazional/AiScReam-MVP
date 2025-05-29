
import React from 'react';
import { MapPin, Thermometer, Droplets, Wind, AlertTriangle, Building2 } from 'lucide-react';
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
    if (risk >= 80) return 'text-red-500 bg-red-50 border border-red-200';
    if (risk >= 60) return 'text-orange-500 bg-orange-50 border border-orange-200';
    if (risk >= 40) return 'text-yellow-600 bg-yellow-50 border border-yellow-200';
    return 'text-green-600 bg-green-50 border border-green-200';
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 80) return 'High Risk';
    if (risk >= 60) return 'Moderate Risk';
    if (risk >= 40) return 'Low Risk';
    return 'Minimal Risk';
  };

  const isWatergate = location.type === 'watergate';
  
  const getCardStyle = () => {
    const baseClasses = "bg-white rounded-xl p-5 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md";
    
    if (isSelected) {
      return `${baseClasses} ring-2 ring-blue-500 shadow-lg`;
    }
    
    return `${baseClasses} border border-gray-200 hover:border-gray-300`;
  };

  const getTypeIndicator = () => {
    if (isWatergate) {
      return (
        <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1.5 rounded-full">
          <Droplets className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700 text-sm font-medium">Watergate</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-1.5 rounded-full">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700 text-sm font-medium">Village</span>
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
              <h3 className="text-gray-900 font-semibold text-lg">{location.name}</h3>
            </div>
            {getTypeIndicator()}
            <p className="text-gray-500 text-sm mt-2">
              {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
            </p>
          </div>
        </div>
        {location.weather && (
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRiskColor(location.weather.floodRisk)}`}>
            {getRiskLabel(location.weather.floodRisk)}
          </div>
        )}
      </div>

      {location.weather ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700 text-sm font-medium">{location.weather.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700 text-sm font-medium">{location.weather.humidity}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700 text-sm font-medium">{location.weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700 text-sm font-medium">{location.weather.precipitation}mm</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-gray-700 text-sm">
              <span className="text-gray-500">Weather:</span> {location.weather.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-gray-500">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Weather data unavailable</span>
        </div>
      )}
    </div>
  );
};
