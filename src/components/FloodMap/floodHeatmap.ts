
import L from 'leaflet';
import { LocationData } from '../../types/weather';

export const createFloodHeatmap = (locations: LocationData[]): L.LayerGroup => {
  const heatmapGroup = L.layerGroup();

  locations.forEach((location) => {
    if (!location.weather) return;

    const floodRisk = location.weather.floodRisk;
    const [lat, lng] = location.coordinates;

    // Create multiple overlapping circles for better blending
    const baseRadius = 800;
    const riskMultiplier = 1 + (floodRisk / 100) * 1.5;
    
    // Create 3 concentric circles for better gradient effect
    const circles = [
      {
        radius: baseRadius * riskMultiplier * 1.2,
        opacity: Math.max(0.15, (floodRisk / 100) * 0.3),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 0.8,
        opacity: Math.max(0.25, (floodRisk / 100) * 0.45),
        weight: 0
      },
      {
        radius: baseRadius * riskMultiplier * 0.4,
        opacity: Math.max(0.4, (floodRisk / 100) * 0.6),
        weight: 1
      }
    ];

    const color = getFloodRiskColor(floodRisk);
    const strokeColor = getFloodRiskStrokeColor(floodRisk);

    // Create multiple circles for blending effect
    circles.forEach((circleConfig, index) => {
      const circle = L.circle([lat, lng], {
        color: index === 2 ? strokeColor : color,
        fillColor: color,
        fillOpacity: circleConfig.opacity,
        weight: circleConfig.weight,
        radius: circleConfig.radius,
        opacity: index === 2 ? 0.6 : 0.3
      });

      // Only add popup to the center circle
      if (index === 2) {
        circle.bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900 mb-2">${location.name}</h3>
            <div class="space-y-1">
              <p class="text-sm"><span class="font-medium">Risiko Banjir:</span> ${floodRisk}%</p>
              <p class="text-sm"><span class="font-medium">Status:</span> ${getFloodRiskStatus(floodRisk)}</p>
              <p class="text-sm"><span class="font-medium">Jenis:</span> ${location.type === 'watergate' ? 'Pintu Air' : 'Daerah'}</p>
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

const getFloodRiskColor = (risk: number): string => {
  // More vibrant colors with better contrast
  if (risk >= 90) return '#dc2626'; // bright red
  if (risk >= 80) return '#ef4444'; // red
  if (risk >= 70) return '#f97316'; // orange
  if (risk >= 60) return '#f59e0b'; // amber
  if (risk >= 50) return '#eab308'; // yellow
  if (risk >= 40) return '#a3e635'; // lime
  if (risk >= 30) return '#22c55e'; // green
  if (risk >= 20) return '#16a34a'; // dark green
  if (risk >= 10) return '#15803d'; // darker green
  return '#166534'; // darkest green
};

const getFloodRiskStrokeColor = (risk: number): string => {
  // Darker stroke colors for better definition
  if (risk >= 90) return '#991b1b'; // darker red
  if (risk >= 80) return '#b91c1c'; // dark red
  if (risk >= 70) return '#c2410c'; // dark orange
  if (risk >= 60) return '#d97706'; // dark amber
  if (risk >= 50) return '#ca8a04'; // dark yellow
  if (risk >= 40) return '#65a30d'; // dark lime
  if (risk >= 30) return '#16a34a'; // dark green
  if (risk >= 20) return '#15803d'; // darker green
  if (risk >= 10) return '#166534'; // darkest green
  return '#14532d'; // very dark green
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
