
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationData } from '../types/weather';

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
  const [mapTilerKey, setMapTilerKey] = useState<string>('');

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return '#ef4444'; // red
    if (risk >= 60) return '#f97316'; // orange
    if (risk >= 40) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  const createCustomIcon = (color: string, isSelected: boolean = false) => {
    const size = isSelected ? 20 : 15;
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${color}; 
        border: 2px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${isSelected ? 'transform: scale(1.2);' : ''}
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([-6.2, 106.85], 11);

    if (mapTilerKey) {
      // Use MapTiler with API key
      L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${mapTilerKey}`, {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);
    } else {
      // Fallback to OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapTilerKey]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    locations.forEach((location) => {
      if (!location.weather) return;

      const color = getRiskColor(location.weather.floodRisk);
      const isSelected = selectedLocation?.id === location.id;
      const icon = createCustomIcon(color, isSelected);

      const marker = L.marker([location.coordinates[0], location.coordinates[1]], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-medium text-gray-900">${location.name}</h3>
            <p class="text-sm text-gray-600">Flood Risk: ${location.weather.floodRisk}%</p>
            <p class="text-sm text-gray-600">Temperature: ${location.weather.temperature}°C</p>
            <p class="text-sm text-gray-600">${location.weather.description}</p>
          </div>
        `)
        .on('click', () => {
          onLocationSelect(location);
        });

      markersRef.current.push(marker);
    });
  }, [locations, selectedLocation, onLocationSelect]);

  if (!mapTilerKey) {
    return (
      <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 max-w-md">
          <h3 className="text-white font-medium mb-4">MapTiler API Key Required</h3>
          <p className="text-gray-300 text-sm mb-4">
            Please enter your MapTiler API key to display the interactive map.
            You can get one for free at{' '}
            <a href="https://www.maptiler.com/" target="_blank" rel="noopener noreferrer" className="text-sky_blue-500 hover:underline">
              maptiler.com
            </a>
          </p>
          <input
            type="text"
            placeholder="Enter MapTiler API Key"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm mb-3"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setMapTilerKey((e.target as HTMLInputElement).value);
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder="Enter MapTiler API Key"]') as HTMLInputElement;
              if (input?.value) {
                setMapTilerKey(input.value);
              }
            }}
            className="w-full bg-sky_blue-500 hover:bg-sky_blue-600 text-white py-2 px-4 rounded text-sm transition-colors"
          >
            Load Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-3">Flood Risk Level</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300 text-sm">High Risk (80%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-300 text-sm">Moderate Risk (60-79%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300 text-sm">Low Risk (40-59%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300 text-sm">Minimal Risk (0-39%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
