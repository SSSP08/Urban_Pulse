import type { LatLngTuple } from 'leaflet';

export interface SimulatedRoute {
  coordinates: LatLngTuple[];
  etaMinutes: number;
  trafficCondition: 'Low' | 'Moderate' | 'Heavy';
  distanceKm: number;
}

/**
 * Generates a realistic grid-like route from a fixed origin in Hyderabad Tech Corridor
 * to a selected parking location, adding a few turns to simulate street routing.
 */
export function generateRoute(targetLat: number, targetLng: number): SimulatedRoute {
  // Fixed starting point near Gachibowli/Kondapur Area
  const startLat = 17.4350;
  const startLng = 78.3580;

  // Create an interesting path with 2 turns (grid pattern) to look like real streets
  const coordinates: LatLngTuple[] = [
    [startLat, startLng],
    [startLat + (targetLat - startLat) * 0.4, startLng], // turn 1
    [startLat + (targetLat - startLat) * 0.4, targetLng], // turn 2
    [targetLat, targetLng]
  ];

  // Calculate rough distance in Km (Euclidean approximation for display)
  const latDiff = Math.abs(targetLat - startLat);
  const lngDiff = Math.abs(targetLng - startLng);
  const distanceKm = Math.round((latDiff + lngDiff) * 110 * 10) / 10; // ~110km per degree

  // Determine traffic condition stochastically based on target coordinates
  // (e.g. areas closer to Cyber Towers [17.4504, 78.3813] have heavier traffic)
  const cyberTowersLat = 17.4504;
  const cyberTowersLng = 78.3813;
  const distToTechCenter = Math.sqrt(
    Math.pow(targetLat - cyberTowersLat, 2) + Math.pow(targetLng - cyberTowersLng, 2)
  );

  let trafficCondition: SimulatedRoute['trafficCondition'] = 'Low';
  let speedKmh = 50;

  if (distToTechCenter < 0.015) {
    trafficCondition = 'Heavy';
    speedKmh = 12;
  } else if (distToTechCenter < 0.035) {
    trafficCondition = 'Moderate';
    speedKmh = 25;
  }

  // Calculate ETA: distance / speed
  const etaMinutes = Math.max(2, Math.round((distanceKm / speedKmh) * 60));

  return {
    coordinates,
    etaMinutes,
    trafficCondition,
    distanceKm
  };
}

/**
 * Generates the emergency wave corridor route (straight, high-priority lane).
 * Usually from the outer boundary directly to the heart of the tech corridor.
 */
export function generateEmergencyCorridor(): LatLngTuple[] {
  // Fixed emergency corridor path through Hitec City Main Road
  return [
    [17.4401, 78.3489], // Gachibowli Circle
    [17.4440, 78.3600],
    [17.4477, 78.3764], // HITEC City Main Road
    [17.4504, 78.3813], // Cyber Towers
    [17.4518, 78.3910]  // Hitec City Metro
  ];
}
