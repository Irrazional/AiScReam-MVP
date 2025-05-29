
import React from 'react';
import { Cloud, Sun, Moon } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

interface HeaderProps {
  selectedDateTime: Date;
  onDateTimeChange: (date: Date) => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedDateTime, onDateTimeChange }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FloodReport</h1>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <DateTimePicker
            selectedDateTime={selectedDateTime}
            onDateTimeChange={onDateTimeChange}
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">Event date</div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
