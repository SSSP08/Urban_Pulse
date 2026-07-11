import { create } from 'zustand';
import { ParkingLocation } from '@/types';
import { mockParkingLocations } from '@/data/mockParkingLocations';

export interface ParkingYard {
  id: string;
  cityId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  totalCapacity: number;
  availableSpots: number;
  hourlyRate: number; // in ₹
  isEVCharging: boolean;
  isTwoWheeler: boolean;
  isFourWheeler: boolean;
  isCovered: boolean;
  isFree: boolean;
  securityStatus: 'CCTV Monitored' | '24/7 Guarded' | 'Basic Security';
  operatingHours: string; // e.g. "24 Hours" or "08:00 AM - 11:00 PM"
  walkingDistance: string; // e.g. "5 mins walk"
  drivingTime: string; // e.g. "12 mins drive"
}

export interface ParkingFilters {
  available: boolean;
  evCharging: boolean;
  twoWheeler: boolean;
  fourWheeler: boolean;
  covered: boolean;
  open: boolean;
  free: boolean;
  paid: boolean;
}

interface ParkingState {
  parkingYards: ParkingYard[];
  selectedYard: ParkingYard | null;
  filters: ParkingFilters;
  searchFocusedId: string | null;
  setSelectedYard: (yard: ParkingYard | null) => void;
  setFilter: (key: keyof ParkingFilters, value: boolean) => void;
  resetFilters: () => void;
  updateYardsOccupancy: () => void;
  setSearchFocusedId: (id: string | null) => void;
  
  // New state properties for Parking Data Layer
  parkingLocations: ParkingLocation[];
  selectedLocation: ParkingLocation | null;
  setSelectedLocation: (location: ParkingLocation | null) => void;
}


// 10 Localized Hyderabad Parking Yards + placeholders for other cities
export const INITIAL_PARKING_YARDS: ParkingYard[] = [
  {
    id: 'HYD-P1',
    cityId: 'HYDERABAD',
    name: 'Cyber Towers Smart MLCP',
    address: 'HITEC City Road, Madhapur, Hyderabad, Telangana 500081',
    lat: 17.4510,
    lng: 78.3800,
    totalCapacity: 300,
    availableSpots: 212,
    hourlyRate: 40.00,
    isEVCharging: true,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: true,
    isFree: false,
    securityStatus: '24/7 Guarded',
    operatingHours: '24 Hours',
    walkingDistance: '2 mins walk',
    drivingTime: '1 min drive'
  },
  {
    id: 'HYD-P2',
    cityId: 'HYDERABAD',
    name: 'Gachibowli Stadium Smart Yard',
    address: 'Old Mumbai Highway, Gachibowli, Hyderabad, Telangana 500032',
    lat: 17.4420,
    lng: 78.3450,
    totalCapacity: 500,
    availableSpots: 430,
    hourlyRate: 20.00,
    isEVCharging: true,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: false,
    isFree: false,
    securityStatus: 'CCTV Monitored',
    operatingHours: '06:00 AM - 11:00 PM',
    walkingDistance: '8 mins walk',
    drivingTime: '4 mins drive'
  },
  {
    id: 'HYD-P3',
    cityId: 'HYDERABAD',
    name: 'Jubilee Hills Road No. 36 MLCP',
    address: 'Road Number 36, Jubilee Hills, Hyderabad, Telangana 500033',
    lat: 17.4265,
    lng: 78.4090,
    totalCapacity: 200,
    availableSpots: 25,
    hourlyRate: 50.00,
    isEVCharging: false,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: true,
    isFree: false,
    securityStatus: '24/7 Guarded',
    operatingHours: '09:00 AM - 12:00 AM',
    walkingDistance: '3 mins walk',
    drivingTime: '3 mins drive'
  },
  {
    id: 'HYD-P4',
    cityId: 'HYDERABAD',
    name: 'City Center Mall Parking deck',
    address: 'Road Number 1, Banjara Hills, Hyderabad, Telangana 500034',
    lat: 17.4175,
    lng: 78.4485,
    totalCapacity: 450,
    availableSpots: 18,
    hourlyRate: 40.00,
    isEVCharging: true,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: true,
    isFree: false,
    securityStatus: 'CCTV Monitored',
    operatingHours: '10:00 AM - 11:00 PM',
    walkingDistance: '1 min walk',
    drivingTime: '2 mins drive'
  },
  {
    id: 'HYD-P5',
    cityId: 'HYDERABAD',
    name: 'Secunderabad Railway Station Yard',
    address: 'Station Road, Secunderabad, Hyderabad, Telangana 500003',
    lat: 17.4330,
    lng: 78.5015,
    totalCapacity: 800,
    availableSpots: 120,
    hourlyRate: 30.00,
    isEVCharging: false,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: false,
    isFree: false,
    securityStatus: 'CCTV Monitored',
    operatingHours: '24 Hours',
    walkingDistance: '4 mins walk',
    drivingTime: '5 mins drive'
  },
  {
    id: 'HYD-P6',
    cityId: 'HYDERABAD',
    name: 'Charminar Heritage Smart Parking',
    address: 'Laad Bazaar Road, Pathar Gatti, Hyderabad, Telangana 500002',
    lat: 17.3615,
    lng: 78.4745,
    totalCapacity: 150,
    availableSpots: 8,
    hourlyRate: 30.00,
    isEVCharging: false,
    isTwoWheeler: true,
    isFourWheeler: false,
    isCovered: false,
    isFree: false,
    securityStatus: 'Basic Security',
    operatingHours: '08:00 AM - 10:00 PM',
    walkingDistance: '6 mins walk',
    drivingTime: '8 mins drive'
  },
  {
    id: 'HYD-P7',
    cityId: 'HYDERABAD',
    name: 'NTR Marg Lakefront Public Parking',
    address: 'NTR Marg, Khairatabad, Tank Bund, Hyderabad, Telangana 500004',
    lat: 17.4120,
    lng: 78.4680,
    totalCapacity: 250,
    availableSpots: 190,
    hourlyRate: 0.00, // Free parking
    isEVCharging: false,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: false,
    isFree: true,
    securityStatus: 'Basic Security',
    operatingHours: '05:00 AM - 11:00 PM',
    walkingDistance: '5 mins walk',
    drivingTime: '3 mins drive'
  },
  {
    id: 'HYD-P8',
    cityId: 'HYDERABAD',
    name: 'Nexus Hyderabad Mall Parking Yard',
    address: 'Kukatpally Housing Board Colony (KPHB), Hyderabad, Telangana 500072',
    lat: 17.4845,
    lng: 78.3890,
    totalCapacity: 1200,
    availableSpots: 780,
    hourlyRate: 50.00,
    isEVCharging: true,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: true,
    isFree: false,
    securityStatus: '24/7 Guarded',
    operatingHours: '10:00 AM - 11:30 PM',
    walkingDistance: '1 min walk',
    drivingTime: '1 min drive'
  },
  {
    id: 'HYD-P9',
    cityId: 'HYDERABAD',
    name: 'Ameerpet Metro Transit Parking',
    address: 'Ameerpet Cross Roads, Ameerpet, Hyderabad, Telangana 500073',
    lat: 17.4375,
    lng: 78.4440,
    totalCapacity: 180,
    availableSpots: 145,
    hourlyRate: 20.00,
    isEVCharging: false,
    isTwoWheeler: true,
    isFourWheeler: false,
    isCovered: true,
    isFree: false,
    securityStatus: 'CCTV Monitored',
    operatingHours: '06:00 AM - 11:30 PM',
    walkingDistance: '2 mins walk',
    drivingTime: '3 mins drive'
  },
  {
    id: 'HYD-P10',
    cityId: 'HYDERABAD',
    name: 'RGIA Airport MLCP Premium Parking',
    address: 'Shamshabad, Hyderabad, Telangana 500409',
    lat: 17.2415,
    lng: 78.4295,
    totalCapacity: 2500,
    availableSpots: 1850,
    hourlyRate: 100.00,
    isEVCharging: true,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: true,
    isFree: false,
    securityStatus: '24/7 Guarded',
    operatingHours: '24 Hours',
    walkingDistance: '5 mins walk',
    drivingTime: '1 min drive'
  },
  // Placeholders for Bengaluru
  {
    id: 'BLR-P1',
    cityId: 'BENGALURU',
    name: 'HSR Layout Multilevel Smart Yard',
    address: '14th Main Rd, Sector 3, Bengaluru, Karnataka 560102',
    lat: 12.9140,
    lng: 77.6350,
    totalCapacity: 400,
    availableSpots: 310,
    hourlyRate: 50.00,
    isEVCharging: true,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: true,
    isFree: false,
    securityStatus: '24/7 Guarded',
    operatingHours: '08:00 AM - 11:00 PM',
    walkingDistance: '2 mins walk',
    drivingTime: '3 mins drive'
  },
  // Placeholders for Mumbai
  {
    id: 'MUM-P1',
    cityId: 'MUMBAI',
    name: 'Jio World Multilevel Smart Yard',
    address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
    lat: 19.0595,
    lng: 72.8625,
    totalCapacity: 1000,
    availableSpots: 840,
    hourlyRate: 80.00,
    isEVCharging: true,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: true,
    isFree: false,
    securityStatus: '24/7 Guarded',
    operatingHours: '24 Hours',
    walkingDistance: '2 mins walk',
    drivingTime: '1 min drive'
  },
  // Placeholders for Delhi
  {
    id: 'DEL-P1',
    cityId: 'DELHI',
    name: 'Palika Underground Smart Yard',
    address: 'Palika Bazaar, Connaught Place, New Delhi, Delhi 110001',
    lat: 28.6320,
    lng: 77.2190,
    totalCapacity: 1200,
    availableSpots: 910,
    hourlyRate: 40.00,
    isEVCharging: true,
    isTwoWheeler: true,
    isFourWheeler: true,
    isCovered: true,
    isFree: false,
    securityStatus: '24/7 Guarded',
    operatingHours: '24 Hours',
    walkingDistance: '3 mins walk',
    drivingTime: '2 mins drive'
  }
];

const DEFAULT_FILTERS: ParkingFilters = {
  available: false,
  evCharging: false,
  twoWheeler: false,
  fourWheeler: false,
  covered: false,
  open: false,
  free: false,
  paid: false
};

export const useParkingStore = create<ParkingState>((set) => ({
  parkingYards: INITIAL_PARKING_YARDS,
  selectedYard: null,
  filters: DEFAULT_FILTERS,
  searchFocusedId: null,
  setSelectedYard: (yard) => set({ selectedYard: yard }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  setSearchFocusedId: (id) => set({ searchFocusedId: id }),
  updateYardsOccupancy: () => set((state) => ({
    parkingYards: state.parkingYards.map((yard) => {
      // Simulate live random occupancy fluctuations (-3 to +3 spots)
      const delta = Math.floor(Math.random() * 7) - 3;
      let nextSpots = yard.availableSpots + delta;

      // Keep within realistic boundaries
      nextSpots = Math.max(0, Math.min(yard.totalCapacity, nextSpots));

      // Update selected yard if it is the one being modified
      const updatedYard = { ...yard, availableSpots: nextSpots };
      if (state.selectedYard?.id === yard.id) {
        set({ selectedYard: updatedYard });
      }

      return updatedYard;
    })
  })),
  
  // New state initializers
  parkingLocations: mockParkingLocations,
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location })
}));
export default useParkingStore;

