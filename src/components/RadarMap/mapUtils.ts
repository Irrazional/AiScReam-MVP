
import L from "leaflet";

export const getRiskColor = (risk: number): string => {
  if (risk >= 80) return "#ef4444";
  if (risk >= 60) return "#f97316";
  if (risk >= 40) return "#eab308";
  return "#22c55e";
};

export const createWatergateIcon = (color: string, isSelected: boolean = false): L.DivIcon => {
  const size = isSelected ? 28 : 22;
  return L.divIcon({
    className: "custom-watergate-marker",
    html: `<div style="
      width: ${size}px; 
      height: ${size}px; 
      background-color: ${color}; 
      border: 3px solid #2563eb; 
      border-radius: 50% 50% 50% 0%;
      transform: rotate(-45deg);
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      ${
        isSelected
          ? "transform: rotate(-45deg) scale(1.2); border-width: 4px;"
          : ""
      }
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export const createVillageIcon = (color: string, isSelected: boolean = false): L.DivIcon => {
  const size = isSelected ? 24 : 18;
  return L.divIcon({
    className: "custom-village-marker",
    html: `<div style="
      width: ${size}px; 
      height: ${size}px; 
      background-color: ${color}; 
      border: 3px solid #059669; 
      border-radius: 4px; 
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      ${isSelected ? "transform: scale(1.2); border-width: 4px;" : ""}
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};
