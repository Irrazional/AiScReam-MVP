import React, { useState, useEffect } from 'react';
import { WeatherSidebar } from '../components/WeatherSidebar';
import { FloodMap } from '../components/FloodMap';
import { Header } from '../components/Header';
import { ThemeProvider } from '../components/ThemeProvider';
import { LocationData, WeatherData } from '../types/weather';
import { fetchWeatherData } from '../services/weatherService';

const IndexContent = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'temperature'>('name');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());

  // Jakarta watergate locations
  const watergateLocations = [
    { name: 'Manggarai', coordinates: [-6.207903028, 106.848439] as [number, number] },
    { name: 'Krukut Hulu', coordinates: [-6.317916, 106.920893] as [number, number] },
    { name: 'Angke Hulu', coordinates: [-6.189635368, 106.7195774] as [number, number] },
    { name: 'Sunter', coordinates: [-6.126688002, 106.829601] as [number, number] },
    { name: 'Pulo Gadung', coordinates: [-6.109, 106.906417] as [number, number] },
  ];

  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true);
      try {
        const weatherPromises = watergateLocations.map(async (location) => {
          const weather = await fetchWeatherData(
            location.coordinates[0], 
            location.coordinates[1], 
            selectedDateTime
          );
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
  }, [selectedDateTime]);

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
    <div className="min-h-screen bg-beige-500 text-mint_cream-500 dark:bg-rich_black-500 dark:text-mint_cream-500">
      <Header 
        selectedDateTime={selectedDateTime}
        onDateTimeChange={setSelectedDateTime}
      />
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

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
