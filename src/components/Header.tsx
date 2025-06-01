
import React from 'react';
import { Cloud, Sun, Moon, Clock } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';
import { ViewToggle } from './ViewToggle';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

interface HeaderProps {
  selectedDateTime: Date;
  onDateTimeChange: (date: Date) => void;
  currentView: 'basic' | 'advanced';
  onViewChange: (view: 'basic' | 'advanced') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  selectedDateTime, 
  onDateTimeChange, 
  currentView, 
  onViewChange 
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleSetToNow = () => {
    onDateTimeChange(new Date());
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-b border-blue-400 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">FloodReport</h1>
              <span className="text-sm text-blue-100">Dashboard</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleSetToNow}
            className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-all duration-200"
          >
            <Clock className="h-4 w-4 mr-2" />
            Now
          </Button>
          <DateTimePicker
            selectedDateTime={selectedDateTime}
            onDateTimeChange={onDateTimeChange}
          />
          <ViewToggle
            currentView={currentView}
            onViewChange={onViewChange}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-all duration-200"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
