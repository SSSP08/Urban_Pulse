export interface ParkingLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  totalSpaces: number;
  availableSpaces: number;
  occupiedSpaces: number;
  pricePerHour: number;
  parkingType: string;
  vehicleTypes: string[];
  hasEVCharging: boolean;
  isCovered: boolean;
  operatingHours: string;
  status: 'available' | 'limited' | 'full';
}
