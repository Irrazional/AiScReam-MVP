
export interface VillageData {
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  kecamatan: string;
}

export const jakartaUtaraVillages: VillageData[] = [
  // Cilincing
  { name: 'Cilincing', coordinates: [-6.107, 106.951], kecamatan: 'Cilincing' },
  { name: 'Kalibaru', coordinates: [-6.098, 106.937], kecamatan: 'Cilincing' },
  { name: 'Marunda', coordinates: [-6.081, 106.958], kecamatan: 'Cilincing' },
  { name: 'Rorotan', coordinates: [-6.088, 106.980], kecamatan: 'Cilincing' },
  { name: 'Sukapura', coordinates: [-6.115, 106.958], kecamatan: 'Cilincing' },
  { name: 'Semper Barat', coordinates: [-6.117, 106.937], kecamatan: 'Cilincing' },
  { name: 'Semper Timur', coordinates: [-6.115, 106.945], kecamatan: 'Cilincing' },

  // Kelapa Gading
  { name: 'Kelapa Gading Barat', coordinates: [-6.158, 106.909], kecamatan: 'Kelapa Gading' },
  { name: 'Kelapa Gading Timur', coordinates: [-6.153, 106.923], kecamatan: 'Kelapa Gading' },
  { name: 'Pegangsaan Dua', coordinates: [-6.169, 106.908], kecamatan: 'Kelapa Gading' },

  // Koja
  { name: 'Koja', coordinates: [-6.105, 106.911], kecamatan: 'Koja' },
  { name: 'Lagoa', coordinates: [-6.113, 106.920], kecamatan: 'Koja' },
  { name: 'Rawa Badak Selatan', coordinates: [-6.123, 106.918], kecamatan: 'Koja' },
  { name: 'Rawa Badak Utara', coordinates: [-6.118, 106.912], kecamatan: 'Koja' },
  { name: 'Tugu Selatan', coordinates: [-6.112, 106.903], kecamatan: 'Koja' },
  { name: 'Tugu Utara', coordinates: [-6.105, 106.903], kecamatan: 'Koja' },

  // Pademangan
  { name: 'Ancol', coordinates: [-6.122, 106.844], kecamatan: 'Pademangan' },
  { name: 'Pademangan Barat', coordinates: [-6.138, 106.839], kecamatan: 'Pademangan' },
  { name: 'Pademangan Timur', coordinates: [-6.135, 106.850], kecamatan: 'Pademangan' },

  // Penjaringan
  { name: 'Kamal Muara', coordinates: [-6.103, 106.741], kecamatan: 'Penjaringan' },
  { name: 'Kapuk Muara', coordinates: [-6.118, 106.766], kecamatan: 'Penjaringan' },
  { name: 'Penjaringan', coordinates: [-6.131, 106.790], kecamatan: 'Penjaringan' },
  { name: 'Pluit', coordinates: [-6.120, 106.792], kecamatan: 'Penjaringan' },
  { name: 'Pejagalan', coordinates: [-6.142, 106.785], kecamatan: 'Penjaringan' },

  // Tanjung Priok
  { name: 'Kebon Bawang', coordinates: [-6.130, 106.879], kecamatan: 'Tanjung Priok' },
  { name: 'Papanggo', coordinates: [-6.141, 106.870], kecamatan: 'Tanjung Priok' },
  { name: 'Sungai Bambu', coordinates: [-6.137, 106.888], kecamatan: 'Tanjung Priok' },
  { name: 'Tanjung Priok', coordinates: [-6.106, 106.880], kecamatan: 'Tanjung Priok' },
  { name: 'Warakas', coordinates: [-6.122, 106.889], kecamatan: 'Tanjung Priok' },
];
