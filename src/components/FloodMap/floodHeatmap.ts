
import L from 'leaflet';
import { LocationData } from '../../types/weather';

export const createFloodHeatmap = (locations: LocationData[]): L.LayerGroup => {
  const heatmapGroup = L.layerGroup();

  locations.forEach((location) => {
    if (!location.weather) return;

    const floodRisk = location.weather.floodRisk;
    const [lat, lng] = location.coordinates;

    // Create color based on flood risk percentage
    const color = getFloodRiskColor(floodRisk);
    const opacity = Math.max(0.3, floodRisk / 100); // Minimum 30% opacity

    // Create circular heatmap zones with radius based on flood risk
    const radius = 500 + (floodRisk / 100) * 1000; // 500m to 1.5km radius

    const circle = L.circle([lat, lng], {
      color: color,
      fillColor: color,
      fillOpacity: opacity * 0.4,
      weight: 0,
      radius: radius,
    });

    // Add popup with flood risk information
    circle.bindPopup(`
      <div class="p-3">
        <h3 class="font-semibold text-gray-900 mb-2">${location.name}</h3>
        <div class="space-y-1">
          <p class="text-sm"><span class="font-medium">Risiko Banjir:</span> ${floodRisk}%</p>
          <p class="text-sm"><span class="font-medium">Status:</span> ${getFloodRiskStatus(floodRisk)}</p>
          <p class="text-sm"><span class="font-medium">Jenis:</span> ${location.type === 'watergate' ? 'Pintu Air' : 'Daerah'}</p>
        </div>
      </div>
    `);

    heatmapGroup.addLayer(circle);
  });

  return heatmapGroup;
};

const getFloodRiskColor = (risk: number): string => {
  // Create gradient from green to red based on risk percentage
  if (risk >= 80) return '#dc2626'; // red-600
  if (risk >= 70) return '#ea580c'; // orange-600
  if (risk >= 60) return '#f59e0b'; // amber-500
  if (risk >= 50) return '#eab308'; // yellow-500
  if (risk >= 40) return '#84cc16'; // lime-500
  if (risk >= 30) return '#22c55e'; // green-500
  if (risk >= 20) return '#16a34a'; // green-600
  return '#15803d'; // green-700
};

const getFloodRiskStatus = (risk: number): string => {
  if (risk >= 80) return 'Sangat Tinggi';
  if (risk >= 60) return 'Tinggi';
  if (risk >= 40) return 'Sedang';
  if (risk >= 20) return 'Rendah';
  return 'Sangat Rendah';
};
