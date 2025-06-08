
import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationData } from "../types/weather";
import { RealTimeStats } from "./RealTimeStats";
import { useTheme } from "./ThemeProvider";
import { ApiKeyInput } from "./RadarMap/ApiKeyInput";
import { WeatherControls } from "./RadarMap/WeatherControls";
import { MapLegend } from "./RadarMap/MapLegend";
import { 
  WeatherLayerType, 
  createWeatherLayer, 
  createBaseLayer 
} from "./RadarMap/weatherLayers";
import { 
  getRiskColor, 
  createWatergateIcon, 
  createVillageIcon 
} from "./RadarMap/mapUtils";

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
  const [activeLayer, setActiveLayer] = useState<WeatherLayerType>("precipitation");
  const [isLoading, setIsLoading] = useState(false);
  const [showRealTimeStats, setShowRealTimeStats] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const { theme } = useTheme();

  // Initialize map and base layer together
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    console.log("Initializing map with theme:", theme);

    const expandedBounds = L.latLngBounds(
      L.latLng(-6.7, 106.6),
      L.latLng(-6.0, 107.0)
    );

    const map = L.map(mapRef.current, {
      maxBounds: expandedBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 9,
      maxZoom: 16,
    }).setView([-6.35, 106.82], 10);

    if (mapRef.current) {
      mapRef.current.style.zIndex = "1";
    }

    mapInstanceRef.current = map;

    // Add base layer immediately during initialization
    baseLayerRef.current = createBaseLayer(theme);
    baseLayerRef.current.addTo(map);

    // Mark map as initialized after a short delay to ensure everything is ready
    setTimeout(() => {
      setMapInitialized(true);
      console.log("Map initialization complete");
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapInitialized(false);
      }
    };
  }, [theme]); // Include theme in dependency to reinitialize when theme changes

  // Update base layer when theme changes (only after map is initialized)
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInitialized) return;

    console.log("Updating base layer for theme:", theme);

    // Remove existing base layer
    if (baseLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseLayerRef.current);
    }

    // Add new base layer
    baseLayerRef.current = createBaseLayer(theme);
    baseLayerRef.current.addTo(mapInstanceRef.current);
  }, [theme, mapInitialized]);

  // Optimized weather layer addition with better error handling
  const addWeatherLayer = useCallback((layerType: WeatherLayerType) => {
    if (!mapInstanceRef.current || !openWeatherKey || !mapInitialized) return;

    console.log("Adding weather layer:", layerType);
    setIsLoading(true);

    // Clear existing weather layers efficiently
    if (weatherLayersRef.current.length > 0) {
      weatherLayersRef.current.forEach((layer) => {
        mapInstanceRef.current?.removeLayer(layer);
      });
      weatherLayersRef.current = [];
    }

    const weatherLayer = createWeatherLayer(layerType, openWeatherKey);

    let loadTimeout: NodeJS.Timeout;

    const handleLoad = () => {
      console.log("Weather layer loaded successfully");
      setIsLoading(false);
      if (loadTimeout) clearTimeout(loadTimeout);
    };

    const handleError = (e: any) => {
      console.error("Weather layer error:", e);
      setIsLoading(false);
      if (loadTimeout) clearTimeout(loadTimeout);
    };

    weatherLayer.on("load", handleLoad);
    weatherLayer.on("tileerror", handleError);

    // Set a reasonable timeout for loading
    loadTimeout = setTimeout(() => {
      console.log("Weather layer load timeout");
      setIsLoading(false);
    }, 5000);

    weatherLayer.addTo(mapInstanceRef.current);
    weatherLayersRef.current.push(weatherLayer);
  }, [openWeatherKey, mapInitialized]);

  const handleApiKeySubmit = useCallback((key: string) => {
    console.log("Setting API key:", key.substring(0, 8) + "...");
    setOpenWeatherKey(key);
    localStorage.setItem("openweather-api-key", key);
  }, []);

  const handleResetApiKey = useCallback(() => {
    localStorage.removeItem("openweather-api-key");
    setOpenWeatherKey("");
  }, []);

  // Update weather layer when key, active layer changes, or map is initialized
  useEffect(() => {
    if (openWeatherKey && mapInitialized) {
      addWeatherLayer(activeLayer);
    }
  }, [openWeatherKey, activeLayer, addWeatherLayer, mapInitialized]);

  // Update markers efficiently
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInitialized) return;

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
  }, [locations, selectedLocation, onLocationSelect, mapInitialized]);

  if (!openWeatherKey) {
    return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full z-0" style={{ zIndex: 1 }} />

      {/* Real-time Stats Modal */}
      {showRealTimeStats && (
        <RealTimeStats onClose={() => setShowRealTimeStats(false)} />
      )}

      {/* Loading indicator */}
      {(isLoading || !mapInitialized) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg z-20">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-300">
              {!mapInitialized ? "Initializing map..." : "Loading weather data..."}
            </span>
          </div>
        </div>
      )}

      <WeatherControls
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        onShowRealTimeStats={() => setShowRealTimeStats(true)}
        onResetApiKey={handleResetApiKey}
      />

      <MapLegend activeLayer={activeLayer} />
    </div>
  );
};
