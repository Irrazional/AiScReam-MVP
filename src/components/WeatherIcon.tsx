
import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Moon } from 'lucide-react';

interface WeatherIconProps {
  weatherCode: number;
  floodRisk: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode,
  floodRisk,
  className = "w-6 h-6",
}) => {
  const getRiskBasedColor = (risk: number) => {
    if (risk >= 80) return 'text-red-500';
    if (risk >= 60) return 'text-orange-500';
    if (risk >= 40) return 'text-yellow-500';
    return 'text-sky_blue-500';
  };

  const getWeatherIcon = (code: number) => {
    // Weather code mapping based on WMO codes
    if (code === 0 || code === 1) return Sun; // Clear/mainly clear
    if (code === 2 || code === 3) return Cloud; // Partly cloudy/overcast
    if ([51, 53, 55, 61, 63, 65].includes(code)) return CloudRain; // Drizzle/rain
    if ([95, 96, 99].includes(code)) return CloudLightning; // Thunderstorm
    if ([45, 48].includes(code)) return Cloud; // Fog
    if ([71, 73, 75].includes(code)) return Cloud; // Snow
    return Sun; // Default
  };

  const IconComponent = getWeatherIcon(weatherCode);
  const colorClass = getRiskBasedColor(floodRisk);

  return <IconComponent className={`${className} ${colorClass}`} />;
};
