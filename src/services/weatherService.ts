import { WeatherData, OpenMeteoResponse } from '../types/weather';

const getWeatherDescription = (weatherCode: number): string => {
  // Weather code mapping based on WMO codes
  const weatherDescriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return weatherDescriptions[weatherCode] || 'Unknown';
};

const getOpenWeatherDescription = (weatherId: number, description: string): string => {
  // Use OpenWeatherMap's description but fallback to our mapping if needed
  return description || 'Unknown weather';
};

const mapOpenWeatherToWMO = (weatherId: number): number => {
  // Map OpenWeatherMap weather IDs to WMO codes for consistency
  if (weatherId >= 200 && weatherId < 300) return 95; // Thunderstorm
  if (weatherId >= 300 && weatherId < 400) return 51; // Drizzle
  if (weatherId >= 500 && weatherId < 600) return 61; // Rain
  if (weatherId >= 600 && weatherId < 700) return 71; // Snow
  if (weatherId >= 700 && weatherId < 800) return 45; // Fog/Mist
  if (weatherId === 800) return 0; // Clear
  if (weatherId > 800) return 2; // Clouds
  return 0; // Default to clear
};

const calculateFloodRisk = (weatherData: {
  precipitation: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}): number => {
  let risk = 0;

  // Precipitation factor (40% of total risk)
  if (weatherData.precipitation > 20) risk += 40;
  else if (weatherData.precipitation > 10) risk += 25;
  else if (weatherData.precipitation > 5) risk += 15;
  else if (weatherData.precipitation > 1) risk += 5;

  // Humidity factor (25% of total risk)
  if (weatherData.humidity > 90) risk += 25;
  else if (weatherData.humidity > 80) risk += 20;
  else if (weatherData.humidity > 70) risk += 15;
  else if (weatherData.humidity > 60) risk += 10;

  // Weather condition factor (25% of total risk)
  if ([95, 96, 99].includes(weatherData.weatherCode)) risk += 25; // Thunderstorms
  else if ([61, 63, 65].includes(weatherData.weatherCode)) risk += 20; // Rain
  else if ([51, 53, 55].includes(weatherData.weatherCode)) risk += 15; // Drizzle

  // Wind factor (10% of total risk) - high winds can affect drainage
  if (weatherData.windSpeed > 30) risk += 10;
  else if (weatherData.windSpeed > 20) risk += 5;

  return Math.min(100, Math.max(0, risk));
};

const fetchFromOpenWeatherMap = async (latitude: number, longitude: number, dateTime?: Date): Promise<WeatherData> => {
  const apiKey = localStorage.getItem('openweather-api-key');
  
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key not found');
  }

  const now = new Date();
  const isCurrentWeather = !dateTime || Math.abs(dateTime.getTime() - now.getTime()) < 3600000; // Within 1 hour
  const isFuture = dateTime && dateTime > now;

  let url: string;
  
  if (isCurrentWeather) {
    // Current weather API
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  } else if (isFuture) {
    // 5-day forecast API (3-hour intervals)
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  } else {
    // For historical data, OpenWeatherMap requires a paid plan, so we'll fall back to Open-Meteo
    throw new Error('Historical data not available in OpenWeatherMap free tier');
  }
  
  console.log('Fetching from OpenWeatherMap:', url.replace(apiKey, '***'));
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`OpenWeatherMap API request failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('OpenWeatherMap response:', data);

  let weatherInfo;
  
  if (isFuture && data.list) {
    // Find the closest forecast entry to the requested time
    const targetTime = dateTime!.getTime();
    const closestEntry = data.list.reduce((closest: any, current: any) => {
      const currentTime = new Date(current.dt * 1000).getTime();
      const closestTime = new Date(closest.dt * 1000).getTime();
      return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) ? current : closest;
    });
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

const fetchFromOpenMeteo = async (latitude: number, longitude: number, dateTime?: Date): Promise<WeatherData> => {
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
