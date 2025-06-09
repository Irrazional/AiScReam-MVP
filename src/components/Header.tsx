import React from "react";
import { Sun, Moon, Clock } from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import { ViewToggle } from "./ViewToggle";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

interface HeaderProps {
  selectedDateTime: Date;
  onDateTimeChange: (date: Date) => void;
  currentView: "basic" | "advanced";
  onViewChange: (view: "basic" | "advanced") => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDateTime,
  onDateTimeChange,
  currentView,
  onViewChange,
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleSetToNow = () => {
    onDateTimeChange(new Date());
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-b border-blue-400 px-3 md:px-6 py-3 md:py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 md:p-2 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
              <img
                src="./logo_floodreport.png"
                alt="FloodReport Logo"
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
                onError={(e) => {
                  console.error("Error loading logo:", e);
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = "/logo_floodreport.png"; // Try alternate path
                }}
              />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white">
                FloodReport
              </h1>
              <span className="text-xs md:text-sm text-blue-100">
                Dashboard
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="outline"
            onClick={handleSetToNow}
            className="hidden sm:flex border-white/30 bg-white/10 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-all duration-200"
          >
            <Clock className="h-4 w-4 mr-2" />
            Kini
          </Button>

          {/* Mobile: Show only clock icon */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleSetToNow}
            className="sm:hidden border-white/30 bg-white/10 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-all duration-200"
          >
            <Clock className="h-4 w-4" />
          </Button>

          <div className="hidden md:block">
            <DateTimePicker
              selectedDateTime={selectedDateTime}
              onDateTimeChange={onDateTimeChange}
            />
          </div>

          <div className="hidden sm:block">
            <ViewToggle currentView={currentView} onViewChange={onViewChange} />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-all duration-200"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile controls row */}
      <div className="mt-3 flex items-center justify-between md:hidden">
        <div className="flex-1 mr-2">
          <DateTimePicker
            selectedDateTime={selectedDateTime}
            onDateTimeChange={onDateTimeChange}
          />
        </div>
        <ViewToggle currentView={currentView} onViewChange={onViewChange} />
      </div>
    </header>
  );
};
