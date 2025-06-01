
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { cn } from '../lib/utils';
import { format, addDays } from 'date-fns';

interface DateTimePickerProps {
  selectedDateTime: Date;
  onDateTimeChange: (date: Date) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDateTime,
  onDateTimeChange,
}) => {
  const [open, setOpen] = React.useState(false);

  // Calculate the maximum date (3 days from today for future, unlimited for past)
  const today = new Date();
  const maxDate = addDays(today, 3);
  const isFutureDate = selectedDateTime > today;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDateTime = new Date(date);
      newDateTime.setHours(selectedDateTime.getHours());
      newDateTime.setMinutes(selectedDateTime.getMinutes());
      onDateTimeChange(newDateTime);
    }
  };

  const handleTimeChange = (field: 'hours' | 'minutes', value: number) => {
    const newDateTime = new Date(selectedDateTime);
    if (field === 'hours') {
      newDateTime.setHours(value);
    } else {
      newDateTime.setMinutes(value);
    }
    onDateTimeChange(newDateTime);
  };

  const formatDateTime = (date: Date) => {
    return format(date, 'MM/dd/yyyy HH:mm') + ' GMT+7';
  };

  // Generate minute options based on whether it's a future date
  // Future dates: only hourly (0 minutes)
  // Past/current dates: 15-minute intervals (0, 15, 30, 45)
  const minuteOptions = isFutureDate ? [0] : Array.from({ length: 4 }, (_, i) => i * 15);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
          )}
        >
          <Calendar className="mr-2 h-4 w-4 text-blue-500" />
          {formatDateTime(selectedDateTime)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border-paynes_gray-300 dark:bg-rich_black-400 dark:border-paynes_gray-300 z-[9999]" align="end">
        <div className="p-4 space-y-4">
          <CalendarComponent
            mode="single"
            selected={selectedDateTime}
            onSelect={handleDateSelect}
            disabled={(date) => date > maxDate}
            initialFocus
            className="pointer-events-auto"
          />
          <div className="flex items-center space-x-2 border-t border-paynes_gray-300 pt-4">
            <Clock className="h-4 w-4 text-paynes_gray-400" />
            <div className="flex space-x-2">
              <select
                value={selectedDateTime.getHours()}
                onChange={(e) => handleTimeChange('hours', parseInt(e.target.value))}
                className="bg-mint_cream-500 border border-paynes_gray-300 rounded px-2 py-1 text-paynes_gray-700 text-sm dark:bg-rich_black-300 dark:border-paynes_gray-200 dark:text-mint_cream-400"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className="text-paynes_gray-400">:</span>
              <select
                value={selectedDateTime.getMinutes()}
                onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value))}
                className="bg-mint_cream-500 border border-paynes_gray-300 rounded px-2 py-1 text-paynes_gray-700 text-sm dark:bg-rich_black-300 dark:border-paynes_gray-200 dark:text-mint_cream-400"
                disabled={isFutureDate && minuteOptions.length === 1}
              >
                {minuteOptions.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isFutureDate && (
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Future forecasts are limited to 3 days with hourly precision
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
