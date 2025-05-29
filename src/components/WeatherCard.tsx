
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

  return (
    <div
      onClick={onSelect}
      className={`bg-card rounded-lg p-4 cursor-pointer transition-all duration-200 border-2 ${
        isWatergate 
          ? 'border-naples_yellow-400' 
          : 'border-sage-300'
      } ${
        isSelected
          ? 'border-naples_yellow-500 bg-accent/10'
          : 'hover:border-naples_yellow-300 hover:bg-accent/5'
      }`}
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
              <MapPin className="w-4 h-4 text-naples_yellow-500" />
              <h3 className="text-foreground font-medium">{location.name}</h3>
              {isWatergate && (
                <span className="px-2 py-1 bg-naples_yellow-100 text-naples_yellow-700 text-xs rounded-full font-medium">
                  Watergate
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
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
              <Thermometer className="w-4 h-4 text-naples_yellow-500" />
              <span className="text-foreground text-sm">{location.weather.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-naples_yellow-500" />
              <span className="text-foreground text-sm">{location.weather.humidity}%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-naples_yellow-500" />
              <span className="text-foreground text-sm">{location.weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-naples_yellow-500" />
              <span className="text-foreground text-sm">{location.weather.precipitation}mm</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-foreground text-sm">
              <span className="text-muted-foreground">Weather:</span> {location.weather.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Weather data unavailable</span>
        </div>
      )}
    </div>
  );
};
