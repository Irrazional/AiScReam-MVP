
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
  const [mapTilerKey, setMapTilerKey] = useState<string>('jNtUhxpPD0rde9ksHxlf');

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return '#ef4444'; // red
    if (risk >= 60) return '#f97316'; // orange
    if (risk >= 40) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  const createCustomIcon = (color: string, isSelected: boolean = false, type: string = 'village') => {
    const size = isSelected ? 20 : 15;
    
    if (type === 'watergate') {
      // Create a droplet shape for watergates
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: ${size}px; 
          height: ${size * 1.2}px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ${isSelected ? 'transform: rotate(-45deg) scale(1.2);' : ''}
        "></div>`,
        iconSize: [size, size * 1.2],
        iconAnchor: [size / 2, size * 1.2],
      });
    } else {
      // Circle for villages
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
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map centered on Jakarta with restricted bounds
    const jakartaBounds = L.latLngBounds(
      L.latLng(-6.4, 106.6), // Southwest coordinates
      L.latLng(-5.9, 107.1)  // Northeast coordinates
    );

    const map = L.map(mapRef.current, {
      maxBounds: jakartaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 10,
      maxZoom: 16
    }).setView([-6.2, 106.85], 11);

    // Use the updated MapTiler topo style
    L.tileLayer(`https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key=${mapTilerKey}`, {
      attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 16,
    }).addTo(map);

    // Set the map container z-index lower than popover
    if (mapRef.current) {
      mapRef.current.style.zIndex = '1';
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
      const icon = createCustomIcon(color, isSelected, location.type);

      const marker = L.marker([location.coordinates[0], location.coordinates[1]], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-medium text-gray-900">${location.name}</h3>
            <p class="text-sm text-gray-600">Type: ${location.type === 'watergate' ? 'Watergate' : 'Village'}</p>
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
            <a href="https://www.maptiler.com/" target="_blank" rel="noopener noreferrer" className="text-naples_yellow-500 hover:underline">
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
            className="w-full bg-naples_yellow-500 hover:bg-naples_yellow-600 text-rich_black-500 py-2 px-4 rounded text-sm transition-colors"
          >
            Load Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full z-0" style={{ zIndex: 1 }} />
      
      {/* Legend with updated colors and differentiation */}
      <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-rich_black-400/95 backdrop-blur-sm rounded-lg p-4 border border-sage-300 dark:border-rich_black-300 z-10">
        <h4 className="text-rich_black-500 dark:text-mint_cream-500 font-medium mb-3">Flood Risk Level</h4>
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-paynes_gray-600 dark:text-mint_cream-400 text-sm">High Risk (80%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-paynes_gray-600 dark:text-mint_cream-400 text-sm">Moderate Risk (60-79%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-paynes_gray-600 dark:text-mint_cream-400 text-sm">Low Risk (40-59%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-paynes_gray-600 dark:text-mint_cream-400 text-sm">Minimal Risk (0-39%)</span>
          </div>
        </div>
        
        <h4 className="text-rich_black-500 dark:text-mint_cream-500 font-medium mb-2">Location Types</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-4 bg-blue-500 border border-white" style={{ borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)' }}></div>
            <span className="text-paynes_gray-600 dark:text-mint_cream-400 text-sm">Watergates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
            <span className="text-paynes_gray-600 dark:text-mint_cream-400 text-sm">Villages</span>
          </div>
        </div>
      </div>
    </div>
  );
};
