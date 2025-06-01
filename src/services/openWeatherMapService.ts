
import { WeatherData } from '../types/weather';
import { getOpenWeatherDescription, mapOpenWeatherToWMO } from './weatherDescriptions';
import { calculateFloodRisk } from './floodRiskCalculator';

export const fetchFromOpenWeatherMap = async (latitude: number, longitude: number, dateTime?: Date): Promise<WeatherData> => {
  const apiKey = localStorage.getItem('openweather-api-key');
  
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key not found');
  }

  const now = new Date();
  const isCurrentWeather = !dateTime || Math.abs(dateTime.getTime() - now.getTime()) < 3600000; // Within 1 hour
  const isFuture = dateTime && dateTime > now;
  const isToday = dateTime && dateTime.toDateString() === now.toDateString();
  const isHistoricalSameDay = dateTime && dateTime < now && isToday;

  let url: string;
  
  if (isCurrentWeather) {
    // Current weather API
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  } else if (isFuture || isHistoricalSameDay) {
    // Use 5-day forecast API for future dates AND same-day historical data (3-hour intervals)
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  } else {
    // For historical data beyond today, OpenWeatherMap requires a paid plan, so we'll fall back to Open-Meteo
    throw new Error('Historical data beyond today not available in OpenWeatherMap free tier');
  }
  
  console.log('Fetching from OpenWeatherMap:', url.replace(apiKey, '***'));
  console.log('DateTime:', dateTime, 'isCurrentWeather:', isCurrentWeather, 'isFuture:', isFuture, 'isHistoricalSameDay:', isHistoricalSameDay);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`OpenWeatherMap API request failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('OpenWeatherMap response:', data);

  let weatherInfo;
  
  if ((isFuture || isHistoricalSameDay) && data.list) {
    // Find the closest forecast entry to the requested time
    const targetTime = dateTime!.getTime();
    
    // For same-day historical data, we need to find the closest available forecast entry
    // OpenWeatherMap forecast includes some recent data points
    const closestEntry = data.list.reduce((closest: any, current: any) => {
      const currentTime = new Date(current.dt * 1000).getTime();
      const closestTime = new Date(closest.dt * 1000).getTime();
      return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) ? current : closest;
    });
    
    console.log('Selected forecast entry:', closestEntry, 'for target time:', dateTime);
    weatherInfo = closestEntry;
  } else {
    weatherInfo = data;
  }

  const weatherCode = mapOpenWeatherToWMO(weatherInfo.weather[0].id);
  const precipitation = weatherInfo.rain?.['1h'] || weatherInfo.rain?.['3h'] || weatherInfo.snow?.['1h'] || weatherInfo.snow?.['3h'] || 0;

  const floodRisk = calculateFloodRisk({
    precipitation,
    humidity: weatherInfo.main.humidity,
    windSpeed: weatherInfo.wind.speed * 3.6, // Convert m/s to km/h
    weatherCode,
  });

  return {
    temperature: Math.round(weatherInfo.main.temp),
    humidity: weatherInfo.main.humidity,
    windSpeed: Math.round(weatherInfo.wind.speed * 3.6), // Convert m/s to km/h
    precipitation,
    description: getOpenWeatherDescription(weatherInfo.weather[0].id, weatherInfo.weather[0].description),
    floodRisk,
    weatherCode,
  };
};
