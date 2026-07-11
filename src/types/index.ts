export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CityInfo {
  id: string;
  name: string;
  state: string;
  center: Coordinates;
  zoom: number;
}

export interface SmartYardInfo {
  id: string;
  name: string;
  capacity: number;
  ratePerHour: number;
  location: Coordinates;
}

export interface IntersectionInfo {
  id: string;
  name: string;
  location: Coordinates;
  status: 'normal' | 'congested' | 'emergency';
}

export interface GridDiagnostics {
  overallCongestion: number; // percentage
  activeAlertCount: number;
  uptimePercentage: number;
}

export * from './parking';
export * from './traffic';

