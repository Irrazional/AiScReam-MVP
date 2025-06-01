
import { WeatherData } from '../types/weather';
import { fetchFromOpenWeatherMap } from './openWeatherMapService';
import { fetchFromOpenMeteo } from './openMeteoService';
import { getWeatherDescription } from './weatherDescriptions';

export const fetchWeatherData = async (
  latitude: number, 
  longitude: number, 
  dateTime?: Date
): Promise<WeatherData> => {
  try {
    // Always try OpenWeatherMap first
    try {
      return await fetchFromOpenWeatherMap(latitude, longitude, dateTime);
    } catch (error) {
      console.warn('OpenWeatherMap failed, falling back to Open-Meteo:', error);
      // Fall back to Open-Meteo
      return await fetchFromOpenMeteo(latitude, longitude, dateTime);
    }
  } catch (error) {
    console.error('Error fetching weather data from both APIs:', error);
    
    // Return mock data with some randomization for demonstration
    const mockRisk = Math.floor(Math.random() * 100);
    const mockWeatherCode = [0, 1, 2, 3, 61, 63, 95][Math.floor(Math.random() * 7)];
    return {
      temperature: 25 + Math.floor(Math.random() * 10),
      humidity: 60 + Math.floor(Math.random() * 30),
      windSpeed: 5 + Math.floor(Math.random() * 15),
      precipitation: Math.random() * 10,
      description: getWeatherDescription(mockWeatherCode),
      floodRisk: mockRisk,
      weatherCode: mockWeatherCode,
    };
  }
};
