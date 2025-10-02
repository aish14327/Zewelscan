export interface JewelryItem {
  // Core Identifiers
  epc: string; // Corresponds to 'Tag No'
  name: string; // Corresponds to 'Item Name'
  imageUrl: string; // Corresponds to 'Image'

  // Location
  showroomArea: string;
  counterName: string;

  // Pricing
  price: number; // Corresponds to 'Mrp'
  costing?: number;

  // Details
  category: string;
  design?: string;
  remarks?: string;
  
  // Physical Properties
  pc?: number;
  grWt?: number;
  netWt?: number;
  goldWt?: number;

  // Diamond Specifics
  diaWt?: number;
  diaPc?: number;
  diaSize?: string;
  diaItem?: string;
  diaValue?: number;
  rate?: number;
  colour?: string;
  clarity?: string;
  size?: string;

  // Metadata
  date?: string;
  hm?: string; // Hallmarking
  certif?: string; // Certification
  supplier?: string;
}

export interface ScanResult {
  scanned: JewelryItem[];
  missing: JewelryItem[];
  new: JewelryItem[];
}

export interface ScanHistoryEntry {
  id: number; // Using a timestamp for a unique ID
  date: Date;
  result: ScanResult;
}

export enum View {
  Dashboard = 'dashboard',
  Scanning = 'scanning',
  Report = 'report',
  InventoryList = 'inventory_list',
  History = 'history',
}

export type ReportCategory = 'scanned' | 'missing' | 'new';