
import { WeatherData } from '../types/weather';
import { getWeatherDescription } from './weatherDescriptions';
import { calculateFloodRisk } from './floodRiskCalculator';

export const fetchFromOpenMeteo = async (latitude: number, longitude: number, dateTime?: Date): Promise<WeatherData> => {
  const now = new Date();
  const isHistorical = dateTime && dateTime < now;
  const isFuture = dateTime && dateTime > now;
  let url: string;

  if (isHistorical) {
    // Format date for historical API (YYYY-MM-DD)
    const date = dateTime.toISOString().split('T')[0];
    url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=Asia%2FBangkok`;
  } else if (isFuture) {
    // Use forecast API for future dates (up to 7 days)
    url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,relative_humidity_2m,dew_point_2m,rain&timezone=Asia%2FBangkok`;
  } else {
    // Current weather API
    url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=Asia%2FBangkok`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo API request failed: ${response.status}`);
  }

  const data = await response.json();

  let weatherData;
  if ((isHistorical || isFuture) && data.hourly) {
    // For historical or future data, find the closest hour
    const targetHour = dateTime!.getHours();
    const targetDate = dateTime!.toISOString().split('T')[0];
    
    // Find the correct day and hour index
    const timeArray = data.hourly.time;
    const targetIndex = timeArray.findIndex((time: string) => {
      const timeDate = time.split('T')[0];
      const timeHour = parseInt(time.split('T')[1].split(':')[0]);
      return timeDate === targetDate && timeHour === targetHour;
    });
    
    const index = targetIndex >= 0 ? targetIndex : 0;
    
    weatherData = {
      temperature_2m: data.hourly.temperature_2m[index] || data.hourly.temperature_2m[0],
      relative_humidity_2m: data.hourly.relative_humidity_2m[index] || data.hourly.relative_humidity_2m[0],
      wind_speed_10m: 10, // Default wind speed as it's not in forecast API
      precipitation: data.hourly.rain ? data.hourly.rain[index] || 0 : 0,
      weather_code: data.hourly.weather_code[index] || data.hourly.weather_code[0],
    };
  } else {
    weatherData = data.current;
  }

  const floodRisk = calculateFloodRisk({
    precipitation: weatherData.precipitation,
    humidity: weatherData.relative_humidity_2m,
    windSpeed: weatherData.wind_speed_10m || 10,
    weatherCode: weatherData.weather_code,
  });

  return {
    temperature: Math.round(weatherData.temperature_2m),
    humidity: weatherData.relative_humidity_2m,
    windSpeed: Math.round(weatherData.wind_speed_10m || 10),
    precipitation: weatherData.precipitation,
    description: getWeatherDescription(weatherData.weather_code),
    floodRisk,
    weatherCode: weatherData.weather_code,
  };
};
