
import React from 'react';
import { Cloud, Calendar } from 'lucide-react';

export const Header = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">FloodReport</h1>
          </div>
          <span className="text-sm text-gray-400">Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{currentDate} PDT</span>
          </div>
          <div className="text-sm text-gray-400">Event date</div>
        </div>
      </div>
    </header>
  );
};
