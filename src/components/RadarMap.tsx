import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationData } from "../types/weather";
import { RealTimeStats } from "./RealTimeStats";
import { Button } from "./ui/button";

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
  const [openWeatherKey, setOpenWeatherKey] = useState<string>(() => {
    return localStorage.getItem("openweather-api-key") || "";
  });
  const [activeLayer, setActiveLayer] = useState<
    "precipitation" | "temperature" | "wind" | "pressure"
  >("precipitation");
  const [isLoading, setIsLoading] = useState(false);
  const [showRealTimeStats, setShowRealTimeStats] = useState(false);

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

    let layerCode = "";
    switch (layerType) {
      case "precipitation":
        layerCode = "PA0"; // Convective precipitation
        break;
      case "temperature":
        layerCode = "TA2"; // Air temperature at 2 meters
        break;
      case "wind":
        layerCode = "WND"; // Wind speed and direction
        break;
      case "pressure":
        layerCode = "APM"; // Atmospheric pressure on mean sea level
        break;
    }

    const weatherLayer = L.tileLayer(
      `https://maps.openweathermap.org/maps/2.0/weather/${layerCode}/{z}/{x}/{y}?appid=${openWeatherKey}`,
      {
        maxZoom: 16,
        opacity: 0.6,
        attribution:
          '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      }
    );

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

    const jakartaBounds = L.latLngBounds(
      L.latLng(-6.4, 106.6),
      L.latLng(-5.9, 107.1)
    );

    const map = L.map(mapRef.current, {
      maxBounds: jakartaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 10,
      maxZoom: 16,
    }).setView([-6.2, 106.85], 11);

    // Base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 16,
    }).addTo(map);

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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 shadow-lg z-20">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-700">Loading weather data...</span>
          </div>
        </div>
      )}

      {/* Layer Control */}
      <div className="absolute top-6 right-6 bg-white rounded-xl p-4 shadow-lg border border-gray-200 z-10">
        <h4 className="text-gray-900 font-semibold mb-3">Layer Cuaca</h4>
        <div className="space-y-2">
          <button
            onClick={() => setActiveLayer("precipitation")}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === "precipitation"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Curah Hujan
          </button>
          <button
            onClick={() => setActiveLayer("temperature")}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === "temperature"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Suhu
          </button>
          <button
            onClick={() => setActiveLayer("wind")}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === "wind"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Angin
          </button>
          <button
            onClick={() => setActiveLayer("pressure")}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === "pressure"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tekanan
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Real-time Stats Button */}
        <button
          onClick={() => setShowRealTimeStats(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Real Time Statistik</span>
        </button>

        {/* API Key management */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("openweather-api-key");
              setOpenWeatherKey("");
            }}
            className="w-full text-xs text-gray-500 hover:text-gray-700 py-2"
          >
            Reset API Key
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white rounded-xl p-5 shadow-lg border border-gray-200 z-10">
        <h4 className="text-gray-900 font-semibold mb-4">
          Tingkat Risiko Banjir
        </h4>
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-700 text-sm">Risiko Tinggi (80%+)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-gray-700 text-sm">
              Risiko Sedang (60-79%)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-gray-700 text-sm">
              Risiko Rendah (40-59%)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-700 text-sm">
              Risiko Minimal (0-39%)
            </span>
          </div>
        </div>

        <h4 className="text-gray-900 font-semibold mb-4">Jenis Lokasi</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-5 h-5 bg-blue-500 border-2 border-blue-600 transform rotate-45"
              style={{ borderRadius: "50% 50% 50% 0%" }}
            ></div>
            <span className="text-gray-700 text-sm">Pintu Air</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-emerald-500 border-2 border-emerald-600 rounded-sm"></div>
            <span className="text-gray-700 text-sm">Daerah</span>
          </div>
        </div>
      </div>
    </div>
  );
};
