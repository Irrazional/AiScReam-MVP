
import React from 'react';
import { MapPin, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
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

  const isWatergate = location.type === 'watergate';
  
  const getBorderStyle = () => {
    if (isSelected) {
      return isWatergate 
        ? 'border-sky_blue-500 bg-paynes_gray-300 dark:bg-rich_black-300' 
        : 'border-sky_blue-500 bg-paynes_gray-300 dark:bg-rich_black-300';
    }
    
    return isWatergate
      ? 'border-sky_blue-400 hover:border-sky_blue-300 hover:bg-paynes_gray-350 dark:border-sky_blue-500 dark:hover:border-sky_blue-400'
      : 'border-paynes_gray-300 hover:border-paynes_gray-200 hover:bg-paynes_gray-350 dark:border-rich_black-300 dark:hover:border-rich_black-200';
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-paynes_gray-400 rounded-lg p-4 cursor-pointer transition-all duration-200 border dark:bg-rich_black-400 ${getBorderStyle()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          {location.weather && (
            <WeatherIcon
              weatherCode={location.weather.weatherCode || 0}
              floodRisk={location.weather.floodRisk}
              className="w-8 h-8 mt-1"
            />
          )}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              {isWatergate ? (
                <Droplets className="w-4 h-4 text-sky_blue-500" />
              ) : (
                <MapPin className="w-4 h-4 text-beige-400" />
              )}
              <h3 className="text-mint_cream-500 font-medium">{location.name}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${isWatergate ? 'bg-sky_blue-900/30 text-sky_blue-400' : 'bg-beige-900/30 text-beige-400'}`}>
                {isWatergate ? 'Watergate' : 'Village'}
              </span>
            </div>
            <p className="text-beige-400 text-sm mt-1">
              {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
            </p>
          </div>
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
              <Thermometer className="w-4 h-4 text-sky_blue-500" />
              <span className="text-mint_cream-400 text-sm">{location.weather.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-sky_blue-500" />
              <span className="text-mint_cream-400 text-sm">{location.weather.humidity}%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-sky_blue-500" />
              <span className="text-mint_cream-400 text-sm">{location.weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-sky_blue-500" />
              <span className="text-mint_cream-400 text-sm">{location.weather.precipitation}mm</span>
            </div>
          </div>

          <div className="pt-2 border-t border-paynes_gray-300 dark:border-rich_black-300">
            <p className="text-mint_cream-400 text-sm">
              <span className="text-beige-400">Weather:</span> {location.weather.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-beige-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Weather data unavailable</span>
        </div>
      )}
    </div>
  );
};
