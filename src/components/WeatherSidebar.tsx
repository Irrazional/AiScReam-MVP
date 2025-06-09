import React, { useState } from "react";
import { LocationData } from "../types/weather";
import { WeatherCard } from "./WeatherCard";
import { LocationFilter, FilterOptions } from "./LocationFilter";
import { ArrowUpDown, ArrowUp, ArrowDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface WeatherSidebarProps {
  locations: LocationData[];
  loading: boolean;
  sortBy: "name" | "risk" | "temperature";
  onSortChange: (sort: "name" | "risk" | "temperature") => void;
  onLocationSelect: (location: LocationData) => void;
  selectedLocation: LocationData | null;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isRealTime: boolean;
}

export const WeatherSidebar: React.FC<WeatherSidebarProps> = ({
  locations,
  loading,
  sortBy,
  onSortChange,
  onLocationSelect,
  selectedLocation,
  filters,
  onFilterChange,
  isRealTime,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const watergateCount = locations.filter(
    (location) => location.type === "watergate"
  ).length;
  const villageCount = locations.filter(
    (location) => location.type === "village"
  ).length;

  const filteredLocations = locations.filter((location) => {
    if (location.type === "watergate") {
      return filters.showWatergates;
    } else {
      return filters.showVillages;
    }
  });

  // Sort locations based on selected criteria and direction
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "risk":
        comparison = (a.weather?.floodRisk || 0) - (b.weather?.floodRisk || 0);
        break;
      case "temperature":
        comparison =
          (a.weather?.temperature || 0) - (b.weather?.temperature || 0);
        break;
      default: // name
        comparison = a.name.localeCompare(b.name);
        break;
    }

    return sortDirection === "desc" ? -comparison : comparison;
  });

  const handleSortChange = (newSortBy: "name" | "risk" | "temperature") => {
    if (newSortBy === sortBy) {
      // Toggle direction if same sort criteria
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New sort criteria, default to ascending
      onSortChange(newSortBy);
      setSortDirection("asc");
    }
  };

  const getSortIcon = () => {
    if (sortDirection === "asc") {
      return <ArrowUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    } else {
      return <ArrowDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const sidebarContent = (
    <>
      <div className="flex-shrink-0 p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            Weather Locations
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <LocationFilter
          filters={filters}
          onFilterChange={onFilterChange}
          watergateCount={watergateCount}
          villageCount={villageCount}
        />

        <div className="mt-3 md:mt-4">
          <div className="flex items-center space-x-2 mb-2">
            {getSortIcon()}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sortir:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("name")}
              className="text-xs"
            >
              Nama
            </Button>
            <Button
              variant={sortBy === "risk" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("risk")}
              className="text-xs"
            >
              Resiko Banjir
            </Button>
            <Button
              variant={sortBy === "temperature" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("temperature")}
              className="text-xs"
            >
              Suhu
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading weather data...
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2 md:p-3 space-y-2 md:space-y-3">
            {sortedLocations.map((location) => (
              <WeatherCard
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                onSelect={() => onLocationSelect(location)}
                isRealTime={isRealTime}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-[220px] left-4 z-40 bg-white/90 backdrop-blur-sm shadow-lg border-gray-300"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg transition-transform duration-300 ease-in-out z-50",
          "md:relative md:translate-x-0 md:h-full",
          isOpen
            ? "fixed left-0 md:left-0 translate-x-0"
            : "fixed left-0 -translate-x-full",
          "md:static",
          "max-md:fixed max-md:top-0 max-md:h-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};
