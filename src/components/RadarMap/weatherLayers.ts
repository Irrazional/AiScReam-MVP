
import L from "leaflet";

export type WeatherLayerType = "precipitation" | "temperature" | "wind" | "pressure";

export const createWeatherLayer = (
  layerType: WeatherLayerType,
  openWeatherKey: string
): L.TileLayer => {
  let weatherUrl = "";
  let opacity = 0.6;
  
  switch (layerType) {
    case "precipitation":
      weatherUrl = `https://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?appid=${openWeatherKey}`;
      break;
    case "temperature":
      weatherUrl = `https://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid=${openWeatherKey}&fill_bound=true&opacity=0.7&palette=0:0000ff;10:00ffff;20:00ff00;30:ffff00;40:ff0000`;
      opacity = 0.8;
      break;
    case "wind":
      weatherUrl = `https://maps.openweathermap.org/maps/2.0/weather/WND/{z}/{x}/{y}?appid=${openWeatherKey}`;
      break;
    case "pressure":
      weatherUrl = `https://maps.openweathermap.org/maps/2.0/weather/APM/{z}/{x}/{y}?appid=${openWeatherKey}`;
      break;
  }

  return L.tileLayer(weatherUrl, {
    maxZoom: 16,
    opacity,
    attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
  });
};

export const createBaseLayer = (theme: 'light' | 'dark'): L.TileLayer => {
  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  
  const attribution = theme === 'dark'
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return L.tileLayer(tileUrl, {
    attribution,
    maxZoom: 16,
  });
};
