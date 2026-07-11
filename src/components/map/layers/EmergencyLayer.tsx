'use client';

import React, { useEffect, useState } from 'react';
import { Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import useAppStore from '@/store/useStore';
import { generateEmergencyCorridor } from '@/lib/routeGenerator';

export function EmergencyLayer() {
  const emergencyMode = useAppStore((s) => s.emergencyMode);
  const [pulseOpacity, setPulseOpacity] = useState(0.85);

  // Pulse animation loop for emergency line
  useEffect(() => {
    if (!emergencyMode) return;

    const interval = setInterval(() => {
      setPulseOpacity((prev) => (prev === 0.85 ? 0.3 : 0.85));
    }, 600);

    return () => clearInterval(interval);
  }, [emergencyMode]);

  if (!emergencyMode) return null;

  const corridorCoords = generateEmergencyCorridor();

  // Custom siren pulse icon for start and end junctions
  const createSirenIcon = () =>
    L.divIcon({
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
          <div class="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-75"></div>
          <div class="w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-lg"></div>
        </div>
      `,
      className: 'siren-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

  return (
    <>
      {/* Outer thick flashing red halo */}
      <Polyline
        positions={corridorCoords}
        pathOptions={{
          color: '#ef4444',
          weight: 10,
          opacity: pulseOpacity * 0.4,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />

      {/* Main core priority wave line */}
      <Polyline
        positions={corridorCoords}
        pathOptions={{
          color: '#ef4444',
          weight: 4,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: '8, 8'
        }}
      />

      {/* Siren beacons at critical corridor junctions */}
      <Marker position={corridorCoords[0]} icon={createSirenIcon()} />
      <Marker position={corridorCoords[corridorCoords.length - 1]} icon={createSirenIcon()} />
    </>
  );
}

export default EmergencyLayer;
