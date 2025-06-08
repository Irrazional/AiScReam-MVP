import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationData } from "../types/weather";
import { RealTimeStats } from "./RealTimeStats";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

interface RadarMapProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onLocationSelect: (location: LocationData | null) => void;
}

export const RadarMap: React.FC<RadarMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const weatherLayersRef = useRef<L.TileLayer[]>([]);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const [openWeatherKey, setOpenWeatherKey] = useState<string>(() => {
    return localStorage.getItem("openweather-api-key") || "";
  });
  const [activeLayer, setActiveLayer] = useState<
    "precipitation" | "temperature" | "wind" | "pressure"
  >("precipitation");
  const [isLoading, setIsLoading] = useState(false);
  const [showRealTimeStats, setShowRealTimeStats] = useState(false);
  const { theme } = useTheme();

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "#ef4444";
    if (risk >= 60) return "#f97316";
    if (risk >= 40) return "#eab308";
    return "#22c55e";
  };

  const createWatergateIcon = (color: string, isSelected: boolean = false) => {
    const size = isSelected ? 28 : 22;
    return L.divIcon({
      className: "custom-watergate-marker",
      html: `<div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${color}; 
        border: 3px solid #2563eb; 
        border-radius: 50% 50% 50% 0%;
        transform: rotate(-45deg);
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        ${
          isSelected
            ? "transform: rotate(-45deg) scale(1.2); border-width: 4px;"
            : ""
        }
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const createVillageIcon = (color: string, isSelected: boolean = false) => {
    const size = isSelected ? 24 : 18;
    return L.divIcon({
      className: "custom-village-marker",
      html: `<div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${color}; 
        border: 3px solid #059669; 
        border-radius: 4px; 
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        ${isSelected ? "transform: scale(1.2); border-width: 4px;" : ""}
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Update base layer based on theme
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (baseLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseLayerRef.current);
    }

    const tileUrl = theme === 'dark' 
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    
    const attribution = theme === 'dark'
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    baseLayerRef.current = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 16,
    });

    baseLayerRef.current.addTo(mapInstanceRef.current);
  }, [theme]);

  const addWeatherLayer = (
    layerType: "precipitation" | "temperature" | "wind" | "pressure"
  ) => {
    if (!mapInstanceRef.current || !openWeatherKey) return;

    console.log(
      "Adding weather layer:",
      layerType,
      "with API key:",
      openWeatherKey.substring(0, 8) + "..."
    );
    setIsLoading(true);

    // Remove existing weather layers
    weatherLayersRef.current.forEach((layer) => {
      mapInstanceRef.current?.removeLayer(layer);
    });
    weatherLayersRef.current = [];

    let weatherUrl = "";
    
    switch (layerType) {
      case "precipitation":
        weatherUrl = `https://maps.openweathermap.org/maps/2.0/weather/PA0/{z}/{x}/{y}?appid=${openWeatherKey}`;
        break;
      case "temperature":
        weatherUrl = `http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid=${openWeatherKey}&fill_bound=true&opacity=0.6&palette=-65:821692;-55:821692;-45:821692;-40:821692;-30:8257db;-20:208cec;-10:20c4e8;0:23dddd;10:c2ff28;20:fff028;25:ffc228;30:fc8014`;
        break;
      case "wind":
        weatherUrl = `https://maps.openweathermap.org/maps/2.0/weather/WND/{z}/{x}/{y}?appid=${openWeatherKey}`;
        break;
      case "pressure":
        weatherUrl = `https://maps.openweathermap.org/maps/2.0/weather/APM/{z}/{x}/{y}?appid=${openWeatherKey}`;
        break;
    }

    const weatherLayer = L.tileLayer(weatherUrl, {
      maxZoom: 16,
      opacity: layerType === "temperature" ? 1 : 0.6, // Use full opacity for temperature since it's already set in URL
      attribution:
        '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
    });

    weatherLayer.on("loading", () => {
      console.log("Weather layer loading...");
    });

    weatherLayer.on("load", () => {
      console.log("Weather layer loaded successfully");
      setIsLoading(false);
    });

    weatherLayer.on("tileerror", (e) => {
      console.error("Weather layer tile error:", e);
      setIsLoading(false);
    });

    weatherLayer.addTo(mapInstanceRef.current);
    weatherLayersRef.current.push(weatherLayer);

    // Set loading to false after a timeout as backup
    setTimeout(() => setIsLoading(false), 3000);
  };

  const handleApiKeySubmit = (key: string) => {
    console.log("Setting API key:", key.substring(0, 8) + "...");
    setOpenWeatherKey(key);
    localStorage.setItem("openweather-api-key", key);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Expanded bounds to cover the new area from Bogor to Jakarta
    const expandedBounds = L.latLngBounds(
      L.latLng(-6.7, 106.6), // Southwest coordinates (further south to include Bogor)
      L.latLng(-6.0, 107.0)  // Northeast coordinates
    );

    const map = L.map(mapRef.current, {
      maxBounds: expandedBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 9,
      maxZoom: 16,
    }).setView([-6.35, 106.82], 10); // Centered to cover all locations

    if (mapRef.current) {
      mapRef.current.style.zIndex = "1";
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (openWeatherKey) {
      console.log("API key available, adding weather layer...");
      addWeatherLayer(activeLayer);
    }
  }, [openWeatherKey, activeLayer]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    locations.forEach((location) => {
      if (!location.weather) return;

      const color = getRiskColor(location.weather.floodRisk);
      const isSelected = selectedLocation?.id === location.id;
      const isWatergate = location.type === "watergate";

      const icon = isWatergate
        ? createWatergateIcon(color, isSelected)
        : createVillageIcon(color, isSelected);

      const marker = L.marker(
        [location.coordinates[0], location.coordinates[1]],
        { icon }
      )
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `
          <div class="p-2">
            <h3 class="font-medium text-gray-900">${location.name}</h3>
            <p class="text-sm text-gray-600">Jenis: ${
              isWatergate ? "Pintu Air" : "Daerah"
            }</p>
            <p class="text-sm text-gray-600">Risiko Banjir: ${
              location.weather.floodRisk
            }%</p>
            <p class="text-sm text-gray-600">Suhu: ${
              location.weather.temperature
            }°C</p>
            <p class="text-sm text-gray-600">${location.weather.description}</p>
          </div>
        `
        )
        .on("click", () => {
          onLocationSelect(location);
        });

      markersRef.current.push(marker);
    });
  }, [locations, selectedLocation, onLocationSelect]);

  if (!openWeatherKey) {
    return (
      <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-md">
          <h3 className="text-gray-900 font-semibold mb-4">
            OpenWeatherMap API Key Required
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Please enter your OpenWeatherMap API key to display the radar map.
            You can get one for free at{" "}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              openweathermap.org
            </a>
          </p>
          <input
            type="text"
            placeholder="Enter OpenWeatherMap API Key"
            defaultValue="5ba2d8c0aa9c463b17bcd00fc60c7bed"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleApiKeySubmit((e.target as HTMLInputElement).value);
              }
            }}
          />
          <Button
            onClick={() => {
              const input = document.querySelector(
                'input[placeholder="Enter OpenWeatherMap API Key"]'
              ) as HTMLInputElement;
              if (input?.value) {
                handleApiKeySubmit(input.value);
              }
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            Load Radar Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full z-0" style={{ zIndex: 1 }} />

      {/* Real-time Stats Modal */}
      {showRealTimeStats && (
        <RealTimeStats onClose={() => setShowRealTimeStats(false)} />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg z-20">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Loading weather data...</span>
          </div>
        </div>
      )}

      {/* Layer Control */}
      <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
        <h4 className="text-gray-900 dark:text-white font-semibold mb-3">Layer Cuaca</h4>
        <div className="space-y-2">
          <button
            onClick={() => setActiveLayer("precipitation")}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === "precipitation"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Curah Hujan
          </button>
          <button
            onClick={() => setActiveLayer("temperature")}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === "temperature"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Suhu
          </button>
          <button
            onClick={() => setActiveLayer("wind")}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === "wind"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Angin
          </button>
          <button
            onClick={() => setActiveLayer("pressure")}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === "pressure"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Tekanan
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>

        {/* Real-time Stats Button */}
        <button
          onClick={() => setShowRealTimeStats(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Real Time Statistik</span>
        </button>

        {/* API Key management */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => {
              localStorage.removeItem("openweather-api-key");
              setOpenWeatherKey("");
            }}
            className="w-full text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2"
          >
            Reset API Key
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
        <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
          Tingkat Risiko Banjir
        </h4>
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Risiko Tinggi (80%+)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Risiko Sedang (60-79%)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Risiko Rendah (40-59%)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              Risiko Minimal (0-39%)
            </span>
          </div>
        </div>

        <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Jenis Lokasi</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-5 h-5 bg-blue-500 border-2 border-blue-600 transform rotate-45"
              style={{ borderRadius: "50% 50% 50% 0%" }}
            ></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Pintu Air</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-emerald-500 border-2 border-emerald-600 rounded-sm"></div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Daerah</span>
          </div>
        </div>
      </div>
    </div>
  );
};
