import React, { useState, useEffect } from "react";
import { WeatherSidebar } from "../components/WeatherSidebar";
import { FloodMap } from "../components/FloodMap";
import { RadarMap } from "../components/RadarMap";
import { Header } from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";
import { LocationData, WeatherData } from "../types/weather";
import { fetchWeatherData } from "../services/weatherService";
import { jakartaUtaraVillages } from "../data/jakartaUtaraVillages";
import { FilterOptions } from "../components/LocationFilter";
import { ForecastForm } from "../components/ForecastForm";

const IndexContent = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"name" | "risk" | "temperature">("name");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<"basic" | "advanced">("basic");
  const [filters, setFilters] = useState<FilterOptions>({
    showWatergates: true,
    showVillages: true,
  });

  // Updated Jakarta watergate locations with your new 12 spots
  const watergateLocations = [
    {
      name: "Bendung Katulampa",
      coordinates: [-6.6335, 106.8371] as [number, number],
      type: "watergate",
    },
    {
      name: "Pos Depok",
      coordinates: [-6.40039, 106.83139] as [number, number],
      type: "watergate",
    },
    {
      name: "Manggarai BKB",
      coordinates: [-6.20893, 106.84749] as [number, number],
      type: "watergate",
    },
    {
      name: "P.A Karet",
      coordinates: [-6.198, 106.8101] as [number, number],
      type: "watergate",
    },
    {
      name: "Pos Krukut Hulu",
      coordinates: [-6.34435, 106.79903] as [number, number],
      type: "watergate",
    },
    {
      name: "Pos Pesanggrahan",
      coordinates: [-6.396652080890782, 106.7718575110447] as [number, number],
      type: "watergate",
    },
    {
      name: "Pos Angke Hulu",
      coordinates: [-6.21795137705553, 106.69411125306445] as [number, number],
      type: "watergate",
    },
    {
      name: "Waduk Pluit",
      coordinates: [-6.1171014909474835, 106.80027636995418] as [
        number,
        number
      ],
      type: "watergate",
    },
    {
      name: "Pasar Ikan - Laut",
      coordinates: [-6.1261036452185165, 106.80954619310586] as [
        number,
        number
      ],
      type: "watergate",
    },
    {
      name: "Pos Cipinang Hulu",
      coordinates: [-6.231756, 106.877533] as [number, number],
      type: "watergate",
    },
    {
      name: "Pos Sunter Hulu",
      coordinates: [-6.162690734044744, 106.88130916846849] as [number, number],
      type: "watergate",
    },
    {
      name: "Pulo Gadung",
      coordinates: [-6.1915895993351056, 106.90391490796522] as [
        number,
        number
      ],
      type: "watergate",
    },
  ];

  const allLocations = [
    ...watergateLocations,
    ...jakartaUtaraVillages.map((village) => ({
      name: village.name,
      coordinates: village.coordinates,
      type: "village",
      kecamatan: village.kecamatan,
    })),
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
            id: location.name.toLowerCase().replace(/\s+/g, "_"),
          };
        });

        const results = await Promise.all(weatherPromises);
        setLocations(results);
      } catch (error) {
        console.error("Error loading weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [selectedDateTime]);

  const sortedLocations = [...locations].sort((a, b) => {
    switch (sortBy) {
      case "risk":
        return (b.weather?.floodRisk || 0) - (a.weather?.floodRisk || 0);
      case "temperature":
        return (b.weather?.temperature || 0) - (a.weather?.temperature || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Filter locations for the map based on current filters
  const filteredMapLocations = locations.filter((location) => {
    if (location.type === "watergate") {
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
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <div className="flex h-[calc(100vh-80px)]">
        {/* <ForecastForm /> button to fetch forecast */}
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
          {currentView === "basic" ? (
            <FloodMap
              locations={filteredMapLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={setSelectedLocation}
            />
          ) : (
            <RadarMap
              locations={filteredMapLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={setSelectedLocation}
            />
          )}
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
