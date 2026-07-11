import { create } from 'zustand';

export interface MapElement {
  id: string;
  name: string;
  type: 'parking' | 'traffic';
  lat: number;
  lng: number;
  status: 'normal' | 'congested' | 'emergency' | 'available' | 'full' | 'moderate';
  details: {
    title: string;
    subtitle: string;
    metricLabel: string;
    metricValue: string;
    description: string;
    subMetrics: Array<{ label: string; value: string }>;
  };
}

interface AppState {
  activeCity: string;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  searchQuery: string;
  trafficLayerActive: boolean;
  locateTriggered: number;
  selectedElement: MapElement | null;
  emergencyMode: boolean;
  setActiveCity: (city: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setTrafficLayerActive: (active: boolean) => void;
  setSelectedElement: (element: MapElement | null) => void;
  setEmergencyMode: (mode: boolean) => void;
  triggerLocate: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeCity: 'HYDERABAD',
  theme: 'dark',
  sidebarOpen: false,
  searchQuery: '',
  trafficLayerActive: true,
  locateTriggered: 0,
  selectedElement: null,
  emergencyMode: false,
  setActiveCity: (city) => set({ activeCity: city, selectedElement: null }),
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTrafficLayerActive: (active) => set({ trafficLayerActive: active }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  setEmergencyMode: (mode) => set({ emergencyMode: mode }),
  triggerLocate: () => set((state) => ({ locateTriggered: state.locateTriggered + 1 }))
}));
export default useAppStore;
