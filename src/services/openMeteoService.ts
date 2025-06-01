
import { WeatherData } from '../types/weather';
import { getWeatherDescription } from './weatherDescriptions';
import { calculateFloodRisk } from './floodRiskCalculator';

export const fetchFromOpenMeteo = async (latitude: number, longitude: number, dateTime?: Date): Promise<WeatherData> => {
  const now = new Date();
  const isHistorical = dateTime && dateTime < now;
  const isFuture = dateTime && dateTime > now;
  const isToday = dateTime && dateTime.toDateString() === now.toDateString();
  
  let url: string;

  if (isHistorical && !isToday) {
    // Historical data beyond today
    const date = dateTime.toISOString().split('T')[0];
    url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=Asia%2FBangkok`;
  } else if (isFuture) {
    // Future forecast data
    url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,relative_humidity_2m,dew_point_2m,rain&timezone=Asia%2FBangkok`;
  } else {
    // Current weather or same-day data (including historical same-day)
    if (isToday && isHistorical) {
      // For same-day historical data, use forecast API which includes recent hourly data
      url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation&past_days=1&timezone=Asia%2FBangkok`;
    } else {
      // Current weather
      url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=Asia%2FBangkok`;
    }
  }

  console.log('Open-Meteo URL:', url);
  console.log('DateTime analysis:', { dateTime, isHistorical, isFuture, isToday });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo API request failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('Open-Meteo response:', data);

  let weatherData;
  if (((isHistorical && !isToday) || isFuture || (isToday && isHistorical)) && data.hourly) {
    // For historical, future, or same-day historical data, find the closest hour
    const targetHour = dateTime!.getHours();
    const targetDate = dateTime!.toISOString().split('T')[0];
    
    // Find the correct day and hour index
    const timeArray = data.hourly.time;
    let targetIndex = timeArray.findIndex((time: string) => {
      const timeDate = time.split('T')[0];
      const timeHour = parseInt(time.split('T')[1].split(':')[0]);
      return timeDate === targetDate && timeHour === targetHour;
    });
    
    // If exact hour not found, find the closest available time
    if (targetIndex === -1) {
      const targetTime = dateTime!.getTime();
      targetIndex = timeArray.reduce((closestIndex: number, time: string, index: number) => {
        const currentTime = new Date(time).getTime();
        const closestTime = new Date(timeArray[closestIndex]).getTime();
        return Math.abs(currentTime - targetTime) < Math.abs(closestTime - targetTime) ? index : closestIndex;
      }, 0);
    }
    
    console.log('Selected time index:', targetIndex, 'for target time:', dateTime);
    
    weatherData = {
      temperature_2m: data.hourly.temperature_2m[targetIndex] || data.hourly.temperature_2m[0],
      relative_humidity_2m: data.hourly.relative_humidity_2m[targetIndex] || data.hourly.relative_humidity_2m[0],
      wind_speed_10m: data.hourly.wind_speed_10m ? data.hourly.wind_speed_10m[targetIndex] || 10 : 10,
      precipitation: data.hourly.precipitation ? data.hourly.precipitation[targetIndex] || 0 : (data.hourly.rain ? data.hourly.rain[targetIndex] || 0 : 0),
      weather_code: data.hourly.weather_code[targetIndex] || data.hourly.weather_code[0],
    };
  } else {
    // Current weather data
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
