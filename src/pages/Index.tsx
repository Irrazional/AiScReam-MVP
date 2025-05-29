
import React, { useState, useEffect } from 'react';
import { WeatherSidebar } from '../components/WeatherSidebar';
import { FloodMap } from '../components/FloodMap';
import { Header } from '../components/Header';
import { ThemeProvider } from '../components/ThemeProvider';
import { LocationData, WeatherData } from '../types/weather';
import { fetchWeatherData } from '../services/weatherService';
import { jakartaUtaraVillages } from '../data/jakartaUtaraVillages';
import { FilterOptions } from '../components/LocationFilter';

const IndexContent = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'temperature'>('name');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [filters, setFilters] = useState<FilterOptions>({
    showWatergates: true,
    showVillages: true,
  });

  // Jakarta watergate locations
  const watergateLocations = [
    { name: 'Manggarai', coordinates: [-6.207903028, 106.848439] as [number, number], type: 'watergate' },
    { name: 'Krukut Hulu', coordinates: [-6.317916, 106.920893] as [number, number], type: 'watergate' },
    { name: 'Angke Hulu', coordinates: [-6.189635368, 106.7195774] as [number, number], type: 'watergate' },
    { name: 'Sunter', coordinates: [-6.126688002, 106.829601] as [number, number], type: 'watergate' },
    { name: 'Pulo Gadung', coordinates: [-6.109, 106.906417] as [number, number], type: 'watergate' },
  ];

  // Combine watergates with Jakarta Utara villages
  const allLocations = [
    ...watergateLocations,
    ...jakartaUtaraVillages.map(village => ({
      name: village.name,
      coordinates: village.coordinates,
      type: 'village',
      kecamatan: village.kecamatan
    }))
  ];

  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true);
      try {
        const weatherPromises = allLocations.map(async (location) => {
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

  // Filter locations for the map based on current filters
  const filteredMapLocations = locations.filter(location => {
    if (location.type === 'watergate') {
      return filters.showWatergates;
    } else {
      return filters.showVillages;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
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
          filters={filters}
          onFilterChange={setFilters}
        />
        <div className="flex-1">
          <FloodMap
            locations={filteredMapLocations}
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
