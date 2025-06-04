
export interface VillageData {
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  kecamatan: string;
  nearWatergate: string; // Which watergate this area is near
}

export const jakartaUtaraVillages: VillageData[] = [
  // Areas near Bendung Katulampa
  { name: 'Kelurahan Katulampa', coordinates: [-6.630, 106.840], kecamatan: 'Bogor Timur', nearWatergate: 'Bendung Katulampa' },
  { name: 'Desa Baranangsiang', coordinates: [-6.635, 106.835], kecamatan: 'Bogor Timur', nearWatergate: 'Bendung Katulampa' },

  // Areas near Pos Depok
  { name: 'Kelurahan Pancoran Mas', coordinates: [-6.395, 106.828], kecamatan: 'Pancoran Mas', nearWatergate: 'Pos Depok' },
  { name: 'Kelurahan Depok', coordinates: [-6.405, 106.835], kecamatan: 'Pancoran Mas', nearWatergate: 'Pos Depok' },

  // Areas near Manggarai BKB
  { name: 'Kelurahan Manggarai', coordinates: [-6.210, 106.850], kecamatan: 'Tebet', nearWatergate: 'Manggarai BKB' },
  { name: 'Kelurahan Menteng Dalam', coordinates: [-6.205, 106.845], kecamatan: 'Tebet', nearWatergate: 'Manggarai BKB' },

  // Areas near P.A Karet
  { name: 'Kelurahan Karet Tengsin', coordinates: [-6.195, 106.812], kecamatan: 'Tanah Abang', nearWatergate: 'P.A Karet' },
  { name: 'Kelurahan Bendungan Hilir', coordinates: [-6.200, 106.808], kecamatan: 'Tanah Abang', nearWatergate: 'P.A Karet' },

  // Areas near Pos Krukut Hulu
  { name: 'Kelurahan Krukut', coordinates: [-6.340, 106.795], kecamatan: 'Limo', nearWatergate: 'Pos Krukut Hulu' },
  { name: 'Desa Cinere', coordinates: [-6.348, 106.802], kecamatan: 'Cinere', nearWatergate: 'Pos Krukut Hulu' },

  // Areas near Pos Pesanggrahan
  { name: 'Kelurahan Pesanggrahan', coordinates: [-6.395, 106.770], kecamatan: 'Pesanggrahan', nearWatergate: 'Pos Pesanggrahan' },
  { name: 'Kelurahan Petukangan Utara', coordinates: [-6.400, 106.775], kecamatan: 'Pesanggrahan', nearWatergate: 'Pos Pesanggrahan' },

  // Areas near Pos Angke Hulu
  { name: 'Kelurahan Duri Kosambi', coordinates: [-6.215, 106.695], kecamatan: 'Cengkareng', nearWatergate: 'Pos Angke Hulu' },
  { name: 'Kelurahan Kedaung Kali Angke', coordinates: [-6.220, 106.690], kecamatan: 'Cengkareng', nearWatergate: 'Pos Angke Hulu' },

  // Areas near Waduk Pluit
  { name: 'Kelurahan Pluit', coordinates: [-6.115, 106.798], kecamatan: 'Penjaringan', nearWatergate: 'Waduk Pluit' },
  { name: 'Kelurahan Muara Baru', coordinates: [-6.120, 106.805], kecamatan: 'Penjaringan', nearWatergate: 'Waduk Pluit' },

  // Areas near Pasar Ikan - Laut
  { name: 'Kelurahan Penjaringan', coordinates: [-6.125, 106.812], kecamatan: 'Penjaringan', nearWatergate: 'Pasar Ikan - Laut' },
  { name: 'Kelurahan Muara Angke', coordinates: [-6.130, 106.808], kecamatan: 'Penjaringan', nearWatergate: 'Pasar Ikan - Laut' },

  // Areas near Pos Cipinang Hulu
  { name: 'Kelurahan Cipinang', coordinates: [-6.230, 106.875], kecamatan: 'Pulogadung', nearWatergate: 'Pos Cipinang Hulu' },
  { name: 'Kelurahan Cipinang Besar Selatan', coordinates: [-6.235, 106.880], kecamatan: 'Jatinegara', nearWatergate: 'Pos Cipinang Hulu' },

  // Areas near Pos Sunter Hulu
  { name: 'Kelurahan Sunter Agung', coordinates: [-6.160, 106.885], kecamatan: 'Tanjung Priok', nearWatergate: 'Pos Sunter Hulu' },
  { name: 'Kelurahan Sunter Jaya', coordinates: [-6.165, 106.878], kecamatan: 'Tanjung Priok', nearWatergate: 'Pos Sunter Hulu' },

  // Areas near Pulo Gadung
  { name: 'Kelurahan Pulo Gadung', coordinates: [-6.190, 106.905], kecamatan: 'Pulo Gadung', nearWatergate: 'Pulo Gadung' },
  { name: 'Kelurahan Jati', coordinates: [-6.195, 106.900], kecamatan: 'Pulo Gadung', nearWatergate: 'Pulo Gadung' },
];
