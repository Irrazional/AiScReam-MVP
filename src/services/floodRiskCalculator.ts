
export const calculateFloodRisk = (weatherData: {
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
