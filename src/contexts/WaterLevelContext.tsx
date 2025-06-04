
import React, { createContext, useContext, useState, useEffect } from 'react';

interface WaterLevelData {
  [locationId: string]: number;
}

interface WaterLevelContextType {
  waterLevels: WaterLevelData;
  isRealTime: boolean;
  setIsRealTime: (isRealTime: boolean) => void;
}

const WaterLevelContext = createContext<WaterLevelContextType | undefined>(undefined);

export const useWaterLevel = () => {
  const context = useContext(WaterLevelContext);
  if (!context) {
    throw new Error('useWaterLevel must be used within a WaterLevelProvider');
  }
  return context;
};

export const WaterLevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [waterLevels, setWaterLevels] = useState<WaterLevelData>({});
  const [isRealTime, setIsRealTime] = useState(true);

  // Initialize water levels for all watergates with correct IDs
  useEffect(() => {
    const watergateIds = [
      'bendung_katulampa',
      'pos_depok', 
      'manggarai_bkb',
      'p.a_karet',
      'pos_krukut_hulu',
      'pos_pesanggrahan',
      'pos_angke_hulu',
      'waduk_pluit',
      'pasar_ikan_-_laut',
      'pos_cipinang_hulu',
      'pos_sunter_hulu',
      'pulo_gadung'
    ];

    const initialLevels: WaterLevelData = {};
    watergateIds.forEach(id => {
      initialLevels[id] = 2.0 + Math.random() * 1.0; // Random initial level between 2.0-3.0m
    });
    setWaterLevels(initialLevels);
  }, []);

  // Update water levels every second when in real-time mode
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setWaterLevels(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          // Add small random variation (-0.01 to +0.01 meters)
          const change = (Math.random() - 0.5) * 0.02;
          updated[id] = Math.max(0.5, Math.min(4.0, updated[id] + change));
          updated[id] = Math.round(updated[id] * 100) / 100;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  return (
    <WaterLevelContext.Provider value={{ waterLevels, isRealTime, setIsRealTime }}>
      {children}
    </WaterLevelContext.Provider>
  );
};
