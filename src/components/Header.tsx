
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
    <header className="bg-paynes_gray-500 border-b border-paynes_gray-400 px-6 py-4 dark:bg-rich_black-500 dark:border-rich_black-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-sky_blue-500" />
            <h1 className="text-2xl font-bold text-mint_cream-500">FloodReport</h1>
          </div>
          <span className="text-sm text-beige-400">Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <DateTimePicker
            selectedDateTime={selectedDateTime}
            onDateTimeChange={onDateTimeChange}
          />
          <div className="text-sm text-beige-400">Event date</div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="bg-transparent border-paynes_gray-400 text-mint_cream-500 hover:bg-paynes_gray-400 dark:border-rich_black-300 dark:hover:bg-rich_black-400"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
