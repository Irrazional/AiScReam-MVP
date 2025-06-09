import L from 'leaflet';
import { LocationData } from '../../types/weather';

export const createFloodHeatmap = (locations: LocationData[]): L.LayerGroup => {
  const heatmapGroup = L.layerGroup();

  locations.forEach((location) => {
    if (!location.weather) return;

    const floodRisk = location.weather.floodRisk;
    const [lat, lng] = location.coordinates;
    const isWatergate = location.type === 'watergate';

    // Larger base radius, with watergates being significantly bigger
    const baseRadius = isWatergate ? 1800 : 1200; // Watergates 50% larger
    const riskMultiplier = 1 + (floodRisk / 100) * 2; // Increased multiplier for more dramatic size changes
    
    // Create 10 circles for smoother gradient
    const circles = [
      {
        radius: baseRadius * riskMultiplier * 1.5,
        opacity: Math.max(0.02, (floodRisk / 100) * 0.05),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 1.35,
        opacity: Math.max(0.04, (floodRisk / 100) * 0.08),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 1.2,
        opacity: Math.max(0.06, (floodRisk / 100) * 0.12),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 1.05,
        opacity: Math.max(0.08, (floodRisk / 100) * 0.16),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 0.9,
        opacity: Math.max(0.12, (floodRisk / 100) * 0.2),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 0.75,
        opacity: Math.max(0.16, (floodRisk / 100) * 0.25),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 0.65,
        opacity: Math.max(0.2, (floodRisk / 100) * 0.3),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 0.55,
        opacity: Math.max(0.25, (floodRisk / 100) * 0.35),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 0.45,
        opacity: Math.max(0.3, (floodRisk / 100) * 0.4),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 0.4,
        opacity: Math.max(0.35, (floodRisk / 100) * 0.5),
        weight: 1
      }
    ];

    const color = getFloodRiskColor(floodRisk, isWatergate);
    const strokeColor = getFloodRiskStrokeColor(floodRisk, isWatergate);

    // Create multiple circles for blending effect
    circles.forEach((circleConfig, index) => {
      // Enhanced opacity for watergates to make them more prominent
      const adjustedOpacity = isWatergate ? Math.min(0.5, circleConfig.opacity * 1.3) : circleConfig.opacity;
      
      const circle = L.circle([lat, lng], {
        color: index === 9 ? strokeColor : color,
        fillColor: color,
        fillOpacity: Math.min(0.5, adjustedOpacity), // Cap at 0.5 to prevent too solid colors
        weight: circleConfig.weight,
        radius: circleConfig.radius,
        opacity: index === 9 ? (isWatergate ? 0.5 : 0.4) : (isWatergate ? 0.3 : 0.2)
      });

      // Only add popup to the center circle
      if (index === 9) {
        circle.bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900 mb-2">${location.name}</h3>
            <div class="space-y-1">
              <p class="text-sm"><span class="font-medium">Risiko Banjir:</span> ${floodRisk}%</p>
              <p class="text-sm"><span class="font-medium">Status:</span> ${getFloodRiskStatus(floodRisk)}</p>
              <p class="text-sm"><span class="font-medium">Jenis:</span> ${location.type === 'watergate' ? 'Pintu Air' : 'Daerah'}</p>
              ${isWatergate ? '<p class="text-xs text-blue-600 font-medium mt-1">⚠️ Lokasi kritis untuk prediksi banjir</p>' : ''}
              <div class="mt-2 w-full h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-full rounded-full" 
                  style="width: ${floodRisk}%; background-color: ${color};"
                ></div>
              </div>
            </div>
          </div>
        `);
      }

      heatmapGroup.addLayer(circle);
    });
  });

  return heatmapGroup;
};

const getFloodRiskColor = (risk: number, isWatergate: boolean = false): string => {
  // More vibrant colors with enhanced intensity for watergates
  const colorIntensity = isWatergate ? 1.0 : 0.01; // Watergates get more intense colors
  
  if (risk >= 90) return isWatergate ? '#b91c1c' : '#dc2626'; // darker red for watergates
  if (risk >= 80) return isWatergate ? '#dc2626' : '#ef4444'; 
  if (risk >= 70) return isWatergate ? '#ea580c' : '#f97316'; 
  if (risk >= 60) return isWatergate ? '#d97706' : '#f59e0b'; 
  if (risk >= 50) return isWatergate ? '#ca8a04' : '#eab308'; 
  if (risk >= 40) return isWatergate ? '#84cc16' : '#a3e635'; 
  if (risk >= 30) return isWatergate ? '#16a34a' : '#22c55e'; 
  if (risk >= 20) return isWatergate ? '#15803d' : '#16a34a'; 
  if (risk >= 10) return isWatergate ? '#166534' : '#15803d'; 
  return isWatergate ? '#14532d' : '#166534';
};

const getFloodRiskStrokeColor = (risk: number, isWatergate: boolean = false): string => {
  // Even darker stroke colors for better definition, especially for watergates
  if (risk >= 90) return isWatergate ? '#7f1d1d' : '#991b1b'; 
  if (risk >= 80) return isWatergate ? '#991b1b' : '#b91c1c'; 
  if (risk >= 70) return isWatergate ? '#9a3412' : '#c2410c'; 
  if (risk >= 60) return isWatergate ? '#b45309' : '#d97706'; 
  if (risk >= 50) return isWatergate ? '#a16207' : '#ca8a04'; 
  if (risk >= 40) return isWatergate ? '#4d7c0f' : '#65a30d'; 
  if (risk >= 30) return isWatergate ? '#15803d' : '#16a34a'; 
  if (risk >= 20) return isWatergate ? '#166534' : '#15803d'; 
  if (risk >= 10) return isWatergate ? '#14532d' : '#166534'; 
  return isWatergate ? '#052e16' : '#14532d';
};

const getFloodRiskStatus = (risk: number): string => {
  if (risk >= 90) return 'Ekstrem';
  if (risk >= 80) return 'Sangat Tinggi';
  if (risk >= 70) return 'Tinggi';
  if (risk >= 60) return 'Sedang-Tinggi';
  if (risk >= 50) return 'Sedang';
  if (risk >= 40) return 'Rendah-Sedang';
  if (risk >= 30) return 'Rendah';
  if (risk >= 20) return 'Sangat Rendah';
  return 'Minimal';
};
