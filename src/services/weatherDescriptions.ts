
export const getWeatherDescription = (weatherCode: number): string => {
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

export const getOpenWeatherDescription = (weatherId: number, description: string): string => {
  // Use OpenWeatherMap's description but fallback to our mapping if needed
  return description || 'Unknown weather';
};

export const mapOpenWeatherToWMO = (weatherId: number): number => {
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
