import type { LatLngTuple } from 'leaflet';

/**
 * Represents the three tiers of road congestion.
 */
export type CongestionLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * A single monitored road segment on the map.
 */
export interface TrafficSegment {
  /** Unique identifier for the segment */
  id: string;
  /** Human-readable road name */
  roadName: string;
  /** Ordered array of [lat, lng] waypoints that draw the polyline */
  coordinates: LatLngTuple[];
  /** Current traffic congestion level */
  congestionLevel: CongestionLevel;
  /** Average vehicle speed in km/h */
  averageSpeed: number;
  /** ISO-8601 timestamp of the last data update */
  lastUpdated: string;
}

/**
 * The four cardinal directions a signal phase can currently serve.
 */
export type SignalPhase = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';

/**
 * A smart traffic signal at a monitored intersection.
 */
export interface TrafficSignal {
  /** Unique identifier */
  id: string;
  /** Human-readable intersection name */
  name: string;
  /** WGS-84 latitude */
  latitude: number;
  /** WGS-84 longitude */
  longitude: number;
  /** Green duration (seconds) for northbound traffic */
  northSignalTime: number;
  /** Green duration (seconds) for southbound traffic */
  southSignalTime: number;
  /** Green duration (seconds) for eastbound traffic */
  eastSignalTime: number;
  /** Green duration (seconds) for westbound traffic */
  westSignalTime: number;
  /** Direction that currently has the green light */
  currentPhase: SignalPhase;
  /** Overall intersection congestion */
  congestionLevel: CongestionLevel;
}
