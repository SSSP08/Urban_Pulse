import type { TrafficSignal } from '@/types/traffic';

/**
 * Mock smart traffic signal dataset for 6 Hyderabad intersections.
 * Coordinates, initial timings, phases, and congestion levels are
 * set to varied starting states so the simulation is visually interesting
 * from first render.
 */
export const INITIAL_SIGNALS: TrafficSignal[] = [
  {
    id: 'SIG-HYD-001',
    name: 'Cyber Towers Junction',
    latitude: 17.4504,
    longitude: 78.3813,
    northSignalTime: 45,
    southSignalTime: 15,
    eastSignalTime: 20,
    westSignalTime: 15,
    currentPhase: 'NORTH',
    congestionLevel: 'HIGH',
  },
  {
    id: 'SIG-HYD-002',
    name: 'Gachibowli Circle',
    latitude: 17.4401,
    longitude: 78.3489,
    northSignalTime: 20,
    southSignalTime: 35,
    eastSignalTime: 20,
    westSignalTime: 18,
    currentPhase: 'SOUTH',
    congestionLevel: 'MEDIUM',
  },
  {
    id: 'SIG-HYD-003',
    name: 'Jubilee Hills Check Post',
    latitude: 17.4338,
    longitude: 78.4150,
    northSignalTime: 20,
    southSignalTime: 20,
    eastSignalTime: 20,
    westSignalTime: 20,
    currentPhase: 'EAST',
    congestionLevel: 'LOW',
  },
  {
    id: 'SIG-HYD-004',
    name: 'Ameerpet Junction',
    latitude: 17.4374,
    longitude: 78.4482,
    northSignalTime: 18,
    southSignalTime: 18,
    eastSignalTime: 42,
    westSignalTime: 14,
    currentPhase: 'EAST',
    congestionLevel: 'HIGH',
  },
  {
    id: 'SIG-HYD-005',
    name: 'Paradise Circle',
    latitude: 17.4439,
    longitude: 78.4983,
    northSignalTime: 30,
    southSignalTime: 20,
    eastSignalTime: 18,
    westSignalTime: 22,
    currentPhase: 'NORTH',
    congestionLevel: 'MEDIUM',
  },
  {
    id: 'SIG-HYD-006',
    name: 'Punjagutta Junction',
    latitude: 17.4269,
    longitude: 78.4488,
    northSignalTime: 20,
    southSignalTime: 20,
    eastSignalTime: 20,
    westSignalTime: 20,
    currentPhase: 'WEST',
    congestionLevel: 'LOW',
  },
];
