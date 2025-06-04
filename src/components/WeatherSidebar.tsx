import React, { useState } from "react";
import { LocationData } from "../types/weather";
import { WeatherCard } from "./WeatherCard";
import { LocationFilter, FilterOptions } from "./LocationFilter";
import { ArrowUpDown, Menu, X } from "lucide-react";
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

        <div className="flex items-center space-x-2 mt-3 md:mt-4">
          <ArrowUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as "name" | "risk" | "temperature")
            }
            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="risk">Sort by Flood Risk</option>
            <option value="temperature">Sort by Temperature</option>
          </select>
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
            {filteredLocations.map((location) => (
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
        className="md:hidden fixed top-[100px] left-4 z-40 bg-white/90 backdrop-blur-sm shadow-lg border-gray-300"
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
          "md:relative md:translate-x-0",
          isOpen
            ? "fixed left-0 top-0 h-full translate-x-0"
            : "fixed left-0 top-0 h-full -translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};
