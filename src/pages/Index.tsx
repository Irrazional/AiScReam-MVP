
import React, { useState, useEffect } from 'react';
import { WeatherSidebar } from '../components/WeatherSidebar';
import { FloodMap } from '../components/FloodMap';
import { Header } from '../components/Header';
import { LocationData, WeatherData } from '../types/weather';
import { fetchWeatherData } from '../services/weatherService';

const Index = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'temperature'>('name');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  // Sample Jakarta area locations (you can expand this)
  const jakartaLocations = [
    { name: 'Kapukmuara', coordinates: [-6.125, 106.7671] },
    { name: 'Warakas', coordinates: [-6.1226, 106.8778] },
    { name: 'Pegangsaandua', coordinates: [-6.1616, 106.9139] },
    { name: 'Ancol', coordinates: [-6.1235, 106.8364] },
    { name: 'Sungaibaranging', coordinates: [-6.1369, 106.8653] },
    { name: 'Pademangan Timur', coordinates: [-6.1419, 106.848] },
    { name: 'Kelapagading Barat', coordinates: [-6.1552, 106.8968] },
    { name: 'Sungaibambu', coordinates: [-6.1295, 106.8845] },
  ];

  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true);
      try {
        const weatherPromises = jakartaLocations.map(async (location) => {
          const weather = await fetchWeatherData(location.coordinates[0], location.coordinates[1]);
          return {
            ...location,
            weather,
            id: location.name.toLowerCase().replace(/\s+/g, '_'),
          };
        });

        const results = await Promise.all(weatherPromises);
        setLocations(results);
      } catch (error) {
        console.error('Error loading weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
    // Refresh data every 10 minutes
    const interval = setInterval(loadWeatherData, 600000);
    return () => clearInterval(interval);
  }, []);

  const sortedLocations = [...locations].sort((a, b) => {
    switch (sortBy) {
      case 'risk':
        return (b.weather?.floodRisk || 0) - (a.weather?.floodRisk || 0);
      case 'temperature':
        return (b.weather?.temperature || 0) - (a.weather?.temperature || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <WeatherSidebar
          locations={sortedLocations}
          loading={loading}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onLocationSelect={setSelectedLocation}
          selectedLocation={selectedLocation}
        />
        <div className="flex-1">
          <FloodMap
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
