
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Waves } from 'lucide-react';
import { Button } from './ui/button';

interface RealTimeStatsProps {
  onClose: () => void;
}

interface DataPoint {
  time: string;
  waterLevel: number;
}

interface LocationWaterData {
  locationId: string;
  locationName: string;
  locationType: 'watergate' | 'village';
  data: DataPoint[];
  currentLevel: number;
}

export const RealTimeStats: React.FC<RealTimeStatsProps> = ({ onClose }) => {
  const [locationData, setLocationData] = useState<LocationWaterData[]>([]);

  // Define all locations (watergates and villages)
  const locations = [
    // Watergates
    { id: 'bendung-katulampa', name: 'Bendung Katulampa', type: 'watergate' as const },
    { id: 'pos-depok', name: 'Pos Depok', type: 'watergate' as const },
    { id: 'manggarai-bkb', name: 'Manggarai BKB', type: 'watergate' as const },
    { id: 'pa-karet', name: 'P.A Karet', type: 'watergate' as const },
    { id: 'pos-krukut-hulu', name: 'Pos Krukut Hulu', type: 'watergate' as const },
    { id: 'pos-pesanggrahan', name: 'Pos Pesanggrahan', type: 'watergate' as const },
    { id: 'pos-angke-hulu', name: 'Pos Angke Hulu', type: 'watergate' as const },
    { id: 'waduk-pluit', name: 'Waduk Pluit', type: 'watergate' as const },
    { id: 'pasar-ikan-laut', name: 'Pasar Ikan - Laut', type: 'watergate' as const },
    { id: 'pos-cipinang-hulu', name: 'Pos Cipinang Hulu', type: 'watergate' as const },
    { id: 'pos-sunter-hulu', name: 'Pos Sunter Hulu', type: 'watergate' as const },
    { id: 'pulo-gadung', name: 'Pulo Gadung', type: 'watergate' as const },
    // Villages
    { id: 'penjaringan', name: 'Penjaringan', type: 'village' as const },
    { id: 'pademangan', name: 'Pademangan', type: 'village' as const },
    { id: 'tanjung-priok', name: 'Tanjung Priok', type: 'village' as const },
    { id: 'koja', name: 'Koja', type: 'village' as const },
    { id: 'kelapa-gading', name: 'Kelapa Gading', type: 'village' as const },
    { id: 'cilincing', name: 'Cilincing', type: 'village' as const },
  ];

  // Initialize with historical data for all locations
  useEffect(() => {
    const initialData: LocationWaterData[] = locations.map(location => {
      const data: DataPoint[] = [];
      const now = new Date();
      const baseLevel = 2.0 + Math.random() * 1.0; // Random base level between 2.0-3.0m
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 1000);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour12: false }),
          waterLevel: baseLevel + Math.random() * 0.3 - 0.15, // Small variation around base
        });
      }
      
      return {
        locationId: location.id,
        locationName: location.name,
        locationType: location.type,
        data,
        currentLevel: data[data.length - 1].waterLevel,
      };
    });
    
    setLocationData(initialData);
  }, []);

  // Update data every second for all locations
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      setLocationData(prevData => 
        prevData.map(locationData => {
          const newLevel = locationData.currentLevel + (Math.random() - 0.5) * 0.02; // Very small changes
          const newPoint: DataPoint = {
            time: now.toLocaleTimeString('en-US', { hour12: false }),
            waterLevel: Math.max(0, newLevel), // Ensure non-negative
          };

          return {
            ...locationData,
            currentLevel: newPoint.waterLevel,
            data: [...locationData.data.slice(-29), newPoint], // Keep last 30 points
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const getStatusColor = (level: number) => {
    if (level >= 3.5) return 'text-red-600';
    if (level >= 2.8) return 'text-orange-600';
    if (level >= 2.0) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl h-[85vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Real-Time Water Level Monitoring</h2>
              <p className="text-blue-100 mt-1">Live IoT Water Level Sensors Across Jakarta Utara</p>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          {/* Overall Stats Summary */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Waves className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Sensors</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{locationData.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Waves className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Normal Levels</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {locationData.filter(l => l.currentLevel < 2.8).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Waves className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Watch Levels</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {locationData.filter(l => l.currentLevel >= 2.8 && l.currentLevel < 3.5).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <Waves className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Alert Levels</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    {locationData.filter(l => l.currentLevel >= 3.5).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Grid of Water Level Charts */}
          <div className="grid grid-cols-3 gap-4">
            {locationData.map((location) => (
              <div key={location.locationId} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {location.locationName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {location.locationType === 'watergate' ? 'Pintu Air' : 'Daerah'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getStatusColor(location.currentLevel)}`}>
                      {formatValue(location.currentLevel)} m
                    </p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={location.data}>
                    <XAxis 
                      dataKey="time" 
                      tick={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                      tick={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${formatValue(value)} m`, 'Water Level']}
                      labelFormatter={(label) => `Time: ${label}`}
                      contentStyle={{ 
                        fontSize: '12px',
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="waterLevel" 
                      stroke="#3b82f6" 
                      strokeWidth={1.5}
                      dot={false}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live data updating every second • {locationData.length} IoT water level sensors connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
