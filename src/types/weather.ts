
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  description: string;
  floodRisk: number; // 0-100 percentage
  weatherCode?: number; // WMO weather code
}

export interface LocationData {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  weather?: WeatherData;
}

export interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
    precipitation: string;
  };
}
