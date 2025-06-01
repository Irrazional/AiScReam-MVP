import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Waves, X, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
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

  useEffect(() => {
    const initialData: LocationWaterData[] = locations.map(location => {
      const data: DataPoint[] = [];
      const now = new Date();
      const baseLevel = 2.0 + Math.random() * 1.0;
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 1000);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour12: false }),
          waterLevel: baseLevel + Math.random() * 0.3 - 0.15,
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

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      setLocationData(prevData => 
        prevData.map(locationData => {
          const newLevel = locationData.currentLevel + (Math.random() - 0.5) * 0.02;
          const newPoint: DataPoint = {
            time: now.toLocaleTimeString('en-US', { hour12: false }),
            waterLevel: Math.max(0, newLevel),
          };

          return {
            ...locationData,
            currentLevel: newPoint.waterLevel,
            data: [...locationData.data.slice(-29), newPoint],
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
    if (level >= 3.5) return 'text-red-500';
    if (level >= 2.8) return 'text-orange-500';
    if (level >= 2.0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusBgColor = (level: number) => {
    if (level >= 3.5) return 'bg-red-500';
    if (level >= 2.8) return 'bg-orange-500';
    if (level >= 2.0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const normalLevels = locationData.filter(l => l.currentLevel < 2.8).length;
  const watchLevels = locationData.filter(l => l.currentLevel >= 2.8 && l.currentLevel < 3.5).length;
  const alertLevels = locationData.filter(l => l.currentLevel >= 3.5).length;
  const avgLevel = locationData.length > 0 ? locationData.reduce((sum, l) => sum + l.currentLevel, 0) / locationData.length : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden border border-blue-200 dark:border-gray-600">
        <div className="p-6 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Real-Time Water Level Monitoring</h2>
                <p className="text-blue-100 mt-1 font-medium">Live IoT Water Level Sensors Across Jakarta Utara</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Sensors</p>
                  <p className="text-3xl font-bold">{locationData.length}</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Waves className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Normal Levels</p>
                  <p className="text-3xl font-bold">{normalLevels}</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Watch/Alert</p>
                  <p className="text-3xl font-bold">{watchLevels + alertLevels}</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg Level</p>
                  <p className="text-3xl font-bold">{formatValue(avgLevel)} m</p>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {locationData.map((location) => (
              <div 
                key={location.locationId} 
                className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {location.locationName}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusBgColor(location.currentLevel)} animate-pulse`}></span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {location.locationType === 'watergate' ? 'Pintu Air' : 'Daerah'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getStatusColor(location.currentLevel)}`}>
                      {formatValue(location.currentLevel)} m
                    </p>
                    <p className="text-xs text-gray-500">Live</p>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={location.data}>
                    <XAxis 
                      dataKey="time" 
                      tick={false}
                      axisLine={false}
                      domain={['dataMin', 'dataMax']}
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
                        borderRadius: '8px',
                        backdropFilter: 'blur(4px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="waterLevel" 
                      stroke={
                        location.currentLevel >= 3.5 ? '#ef4444' :
                        location.currentLevel >= 2.8 ? '#f97316' :
                        location.currentLevel >= 2.0 ? '#eab308' : '#22c55e'
                      }
                      strokeWidth={2}
                      dot={false}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Live data updating every second</span>
              </div>
              <span>•</span>
              <span>{locationData.length} IoT water level sensors connected</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Real-time monitoring active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
