import React, { useState } from "react";
import {
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { LocationData } from "../types/weather";
import { WeatherCard } from "./WeatherCard";
import { LocationFilter, FilterOptions } from "./LocationFilter";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface WeatherSidebarProps {
  locations: LocationData[];
  loading: boolean;
  sortBy: "name" | "risk" | "temperature";
  onSortChange: (sortBy: "name" | "risk" | "temperature") => void;
  onLocationSelect: (location: LocationData | null) => void;
  selectedLocation: LocationData | null;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
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
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredLocations = locations.filter((location) => {
    if (location.type === "watergate") {
      return filters.showWatergates;
    } else {
      return filters.showVillages;
    }
  });

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "risk":
        comparison = (a.weather?.floodRisk || 0) - (b.weather?.floodRisk || 0);
        break;
      case "temperature":
        comparison =
          (a.weather?.temperature || 0) - (b.weather?.temperature || 0);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getSortLabel = (sortType: string) => {
    switch (sortType) {
      case "name":
        return "Urutkan Berdasarkan Nama";
      case "risk":
        return "Urutkan Berdasarkan Risiko Banjir";
      case "temperature":
        return "urutkan Berdasarkan Suhu";
      default:
        return "Urutkan Berdasarkan Nama";
    }
  };

  const handleSortChange = (newSortBy: "name" | "risk" | "temperature") => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(newSortBy);
      setSortOrder("asc");
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg transition-all duration-300 ease-in-out">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="w-6 h-6 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col shadow-lg transition-all duration-300 ease-in-out">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Laporan Cuaca
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Jakarta Utara dan Pintu Air
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="w-8 h-8 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 dark:border-blue-600 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Filter & Sort</span>
                </div>
                <div className="flex items-center space-x-1">
                  {sortOrder === "asc" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white border-gray-200 shadow-xl z-50"
              align="start"
            >
              <DropdownMenuLabel>Sorting</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleSortChange("name")}
                className="hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center justify-between"
              >
                <span>Urut Berdasarkan Nama</span>
                {sortBy === "name" &&
                  (sortOrder === "asc" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("risk")}
                className="hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center justify-between"
              >
                <span>Urut Berdasarkan Resiko Banjir</span>
                {sortBy === "risk" &&
                  (sortOrder === "asc" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("temperature")}
                className="hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 flex items-center justify-between"
              >
                <span>Urut Berdasarkan Suhu</span>
                {sortBy === "temperature" &&
                  (sortOrder === "asc" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <div className="p-2">
                <LocationFilter
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedLocations.map((location) => (
              <div
                key={location.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${sortedLocations.indexOf(location) * 50}ms`,
                }}
              >
                <WeatherCard
                  location={location}
                  isSelected={selectedLocation?.id === location.id}
                  onSelect={() => onLocationSelect(location)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
