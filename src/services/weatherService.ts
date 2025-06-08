
import { WeatherData } from '../types/weather';
import { fetchFromOpenWeatherMap } from './openWeatherMapService';
import { fetchFromOpenMeteo } from './openMeteoService';
import { getWeatherDescription } from './weatherDescriptions';

export const fetchWeatherData = async (
  latitude: number, 
  longitude: number, 
  dateTime?: Date,
  locationType?: string,
  locationId?: string,
  isRealTime?: boolean
): Promise<WeatherData> => {
  try {
    // Always try OpenWeatherMap first
    let weatherData: WeatherData;
    try {
      weatherData = await fetchFromOpenWeatherMap(latitude, longitude, dateTime);
    } catch (error) {
      console.warn('OpenWeatherMap failed, falling back to Open-Meteo:', error);
      // Fall back to Open-Meteo
      weatherData = await fetchFromOpenMeteo(latitude, longitude, dateTime);
    }

    // Add water level data for watergates
    if (locationType === 'watergate') {
      if (isRealTime) {
        // For real-time, the water level will be managed by the context
        // Set a placeholder that will be overridden by the context
        weatherData.waterLevel = 0;
      } else {
        // For historical/predictive data, use static calculation
        const baseWaterLevel = 1.5 + (weatherData.floodRisk / 100) * 2;
        const precipitationEffect = (weatherData.precipitation / 10) * 0.5;
        const staticVariation = locationId ? 
          (locationId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 100) / 1000 :
          Math.random() * 0.3;
        
        weatherData.waterLevel = Math.max(0.5, baseWaterLevel + precipitationEffect + staticVariation);
        weatherData.waterLevel = Math.round(weatherData.waterLevel * 100) / 100;
      }
    }

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data from both APIs:', error);
    
    // Return mock data with some randomization for demonstration
    const mockRisk = Math.floor(Math.random() * 100);
    const mockWeatherCode = [0, 1, 2, 3, 61, 63, 95][Math.floor(Math.random() * 7)];
    const weatherData: WeatherData = {
      temperature: 25 + Math.floor(Math.random() * 10),
      humidity: 60 + Math.floor(Math.random() * 30),
      windSpeed: 5 + Math.floor(Math.random() * 15),
      precipitation: Math.random() * 10,
      description: getWeatherDescription(mockWeatherCode),
      floodRisk: mockRisk,
      weatherCode: mockWeatherCode,
    };

    // Add water level for watergates
    if (locationType === 'watergate') {
      if (isRealTime) {
        weatherData.waterLevel = 0; // Will be overridden by context
      } else {
        const baseWaterLevel = 1.5 + (mockRisk / 100) * 2;
        const precipitationEffect = (weatherData.precipitation / 10) * 0.5;
        const staticVariation = locationId ? 
          (locationId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 100) / 1000 :
          Math.random() * 0.3;
        
        weatherData.waterLevel = Math.max(0.5, baseWaterLevel + precipitationEffect + staticVariation);
        weatherData.waterLevel = Math.round(weatherData.waterLevel * 100) / 100;
      }
    }

    return weatherData;
  }
};
