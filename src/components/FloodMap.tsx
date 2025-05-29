
import React, { useEffect, useRef } from 'react';
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

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return '#ef4444'; // red
    if (risk >= 60) return '#f97316'; // orange
    if (risk >= 40) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  useEffect(() => {
    // This is a placeholder for map implementation
    // You would integrate with a mapping library like Mapbox, Leaflet, or Google Maps here
    console.log('Map would be initialized here with locations:', locations);
  }, [locations]);

  return (
    <div className="relative w-full h-full bg-gray-800">
      <div
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-900/20 to-blue-800/20 relative overflow-hidden"
      >
        {/* Map placeholder with visual representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-96 h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-4">
              <div className="text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-lg">Interactive Map</p>
                <p className="text-sm">Jakarta Flood Risk Areas</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Map integration placeholder - Connect with Mapbox, Leaflet, or Google Maps
            </p>
          </div>
        </div>

        {/* Location markers overlay */}
        <div className="absolute inset-0">
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${20 + (index % 4) * 20}%`,
                top: `${30 + Math.floor(index / 4) * 15}%`,
              }}
              onClick={() => onLocationSelect(location)}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                  selectedLocation?.id === location.id ? 'scale-150 ring-4 ring-white/30' : 'hover:scale-125'
                }`}
                style={{
                  backgroundColor: location.weather ? getRiskColor(location.weather.floodRisk) : '#6b7280',
                }}
              />
              {selectedLocation?.id === location.id && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                  {location.name}
                </div>
              )}
            </div>
          ))}
        </div>

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

        {/* Controls */}
        <div className="absolute top-6 right-6 flex flex-col space-y-2">
          <button className="bg-gray-900/90 backdrop-blur-sm text-white p-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="bg-gray-900/90 backdrop-blur-sm text-white p-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
