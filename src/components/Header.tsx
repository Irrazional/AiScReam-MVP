
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
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-naples_yellow-500" />
            <h1 className="text-2xl font-bold text-foreground">FloodReport</h1>
          </div>
          <span className="text-sm text-muted-foreground">Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <DateTimePicker
            selectedDateTime={selectedDateTime}
            onDateTimeChange={onDateTimeChange}
          />
          <div className="text-sm text-muted-foreground">Event date</div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="bg-transparent border-border text-foreground hover:bg-accent"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
