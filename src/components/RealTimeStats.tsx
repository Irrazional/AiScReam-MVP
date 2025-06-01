
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Droplets, Waves, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

interface RealTimeStatsProps {
  onClose: () => void;
}

interface DataPoint {
  time: string;
  waterLevel: number;
  flowRate: number;
  rainfall: number;
  temperature: number;
}

export const RealTimeStats: React.FC<RealTimeStatsProps> = ({ onClose }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [currentStats, setCurrentStats] = useState({
    waterLevel: 2.45,
    flowRate: 15.2,
    rainfall: 0.8,
    temperature: 28.5,
  });

  // Initialize with some historical data
  useEffect(() => {
    const initialData: DataPoint[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 1000);
      initialData.push({
        time: time.toLocaleTimeString('en-US', { hour12: false }),
        waterLevel: 2.4 + Math.random() * 0.2,
        flowRate: 15 + Math.random() * 2,
        rainfall: Math.random() * 2,
        temperature: 28 + Math.random() * 2,
      });
    }
    
    setData(initialData);
  }, []);

  // Update data every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint: DataPoint = {
        time: now.toLocaleTimeString('en-US', { hour12: false }),
        waterLevel: currentStats.waterLevel + (Math.random() - 0.5) * 0.05,
        flowRate: currentStats.flowRate + (Math.random() - 0.5) * 0.3,
        rainfall: Math.max(0, currentStats.rainfall + (Math.random() - 0.5) * 0.1),
        temperature: currentStats.temperature + (Math.random() - 0.5) * 0.1,
      };

      setCurrentStats({
        waterLevel: newPoint.waterLevel,
        flowRate: newPoint.flowRate,
        rainfall: newPoint.rainfall,
        temperature: newPoint.temperature,
      });

      setData(prevData => {
        const newData = [...prevData, newPoint];
        return newData.slice(-30); // Keep only last 30 points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStats]);

  const formatValue = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Real-Time Water Level Statistics</h2>
              <p className="text-blue-100 mt-1">Live IoT Monitoring Dashboard</p>
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
          {/* Current Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Water Level</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatValue(currentStats.waterLevel)} m
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Flow Rate</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatValue(currentStats.flowRate, 1)} m³/s
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-500 rounded-lg">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rainfall</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {formatValue(currentStats.rainfall, 1)} mm/h
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {formatValue(currentStats.temperature, 1)}°C
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Water Level (Real-time)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatValue(value)} m`, 'Water Level']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waterLevel" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Flow Rate (Real-time)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatValue(value, 1)} m³/s`, 'Flow Rate']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="flowRate" 
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    animationDuration={300}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rainfall Intensity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[0, 'dataMax + 0.5']}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatValue(value, 1)} mm/h`, 'Rainfall']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rainfall" 
                    stroke="#06b6d4" 
                    fill="#06b6d4"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    animationDuration={300}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Temperature</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatValue(value, 1)}°C`, 'Temperature']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live data updating every second • Connected to IoT sensors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
