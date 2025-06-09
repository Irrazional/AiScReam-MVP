import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationData } from "../types/weather";
import { useTheme } from "./ThemeProvider";
import { createFloodHeatmap } from "./FloodMap/floodHeatmap";
import { HeatmapControls } from "./FloodMap/HeatmapControls";
import { createBaseLayer } from "./RadarMap/weatherLayers";

interface FloodMapProps {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  onLocationSelect: (location: LocationData | null) => void;
}

export const FloodMap: React.FC<FloodMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const heatmapRef = useRef<L.LayerGroup | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { theme } = useTheme();

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "#ef4444"; // red
    if (risk >= 60) return "#f97316"; // orange
    if (risk >= 40) return "#eab308"; // yellow
    return "#22c55e"; // green
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

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    console.log("Initializing FloodMap...");

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

    // Add initial base layer
    baseLayerRef.current = createBaseLayer(theme);
    baseLayerRef.current.addTo(map);

    console.log("FloodMap initialization complete");

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update base layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    console.log("Updating FloodMap base layer for theme:", theme);

    // Remove existing base layer
    if (baseLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseLayerRef.current);
    }

    // Add new base layer
    baseLayerRef.current = createBaseLayer(theme);
    baseLayerRef.current.addTo(mapInstanceRef.current);
  }, [theme]);

  // Update markers/heatmap display
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Clear existing heatmap
    if (heatmapRef.current) {
      mapInstanceRef.current.removeLayer(heatmapRef.current);
      heatmapRef.current = null;
    }

    if (showHeatmap) {
      // Show heatmap - only include watergates for flood risk assessment
      const watergateLocations = locations.filter(
        (location) => location.type === "watergate"
      );
      heatmapRef.current = createFloodHeatmap(watergateLocations);
      heatmapRef.current.addTo(mapInstanceRef.current);
    } else {
      // Show markers
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
              <p class="text-sm text-gray-600">${
                location.weather.description
              }</p>
            </div>
          `
          )
          .on("click", () => {
            onLocationSelect(location);
          });

        markersRef.current.push(marker);
      });
    }
  }, [locations, selectedLocation, onLocationSelect, showHeatmap]);

  return (
    <div className="relative w-full h-full max-md:h-[calc(100vh-135px)]">
      <div ref={mapRef} className="w-full h-full z-0" style={{ zIndex: 1 }} />

      <HeatmapControls
        showHeatmap={showHeatmap}
        onToggleHeatmap={setShowHeatmap}
      />

      {/* Updated Legend */}
      <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
        {showHeatmap ? (
          <>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
              Tingkat Resiko Banjir
            </h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#dc2626" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Sangat Tinggi (80%+)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#ea580c" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Tinggi (70-79%)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#f59e0b" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Sedang-Tinggi (60-69%)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#eab308" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Sedang (50-59%)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#84cc16" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Rendah-Sedang (40-49%)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#22c55e" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Rendah (30-39%)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#16a34a" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Sangat Rendah (20-29%)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#15803d" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Minimal (0-19%)
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h4 className="text-gray-900 dark:text-white text-sm font-semibold mb-3">
              Tingkat Resiko Banjir
            </h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-gray-700 dark:text-gray-300 text-xs">
                  Risiko Tinggi (80%+)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-gray-700 dark:text-gray-300 text-xs">
                  Risiko Sedang (60-79%)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700 dark:text-gray-300 text-xs">
                  Risiko Rendah (40-59%)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-gray-700 dark:text-gray-300 text-xs">
                  Risiko Minimal (0-39%)
                </span>
              </div>
            </div>

            <h4 className="text-gray-900 dark:text-white text-sm font-semibold mb-3">
              Jenis Lokasi
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div
                  className="w-5 h-5 bg-blue-500 border-2 border-blue-600 transform rotate-45"
                  style={{ borderRadius: "50% 50% 50% 0%" }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 text-xs">
                  Pintu Air
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-emerald-500 border-2 border-emerald-600 rounded-sm"></div>
                <span className="text-gray-700 dark:text-gray-300 text-xs">
                  Daerah
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
