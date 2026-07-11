'use client';

import React, { useMemo } from 'react';
import { Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import useParkingStore from '@/store/useParkingStore';
import { generateRoute } from '@/lib/routeGenerator';

const TRAFFIC_COLOR = {
  Low: '#22c55e',      // Emerald Green
  Moderate: '#f97316', // Orange
  Heavy: '#ef4444'     // Rose Red
};

export function RouteLayer() {
  const selectedLocation = useParkingStore((s) => s.selectedLocation);
  const selectedYard = useParkingStore((s) => s.selectedYard);

  // Target lat/lng depending on which entity is selected
  const target = useMemo(() => {
    if (selectedLocation) {
      return { lat: selectedLocation.latitude, lng: selectedLocation.longitude, name: selectedLocation.name };
    }
    if (selectedYard) {
      return { lat: selectedYard.lat, lng: selectedYard.lng, name: selectedYard.name };
    }
    return null;
  }, [selectedLocation, selectedYard]);

  // Compute the route path
  const route = useMemo(() => {
    if (!target) return null;
    return generateRoute(target.lat, target.lng);
  }, [target]);

  if (!route || !target) return null;

  const color = TRAFFIC_COLOR[route.trafficCondition];
  const midpoint = route.coordinates[Math.floor(route.coordinates.length / 2)];

  // Custom transparent icon to anchor the ETA popup/tooltip in the middle of the route
  const etaIcon = L.divIcon({
    html: `
      <div style="
        background: #0f172a;
        color: white;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 4px 8px;
        font-family: system-ui, sans-serif;
        font-size: 10px;
        font-weight: 800;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${color};"></span>
        <span>ETA: ${route.etaMinutes}m (${route.trafficCondition})</span>
      </div>
    `,
    className: 'custom-eta-icon',
    iconSize: [120, 24],
    iconAnchor: [60, 12]
  });

  return (
    <>
      {/* Glow path shadow */}
      <Polyline
        positions={route.coordinates}
        pathOptions={{
          color: '#ffffff',
          weight: 7,
          opacity: 0.25,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />

      {/* Main route path */}
      <Polyline
        positions={route.coordinates}
        pathOptions={{
          color: color,
          weight: 4,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: '1, 2' // clean dashed navigation flow
        }}
      />

      {/* Endpoint marker - mini pulse ring */}
      <Marker
        position={route.coordinates[0]}
        icon={L.divIcon({
          html: `<div class="w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white shadow-md animate-ping"></div>`,
          className: 'custom-start-pulse',
          iconSize: [14, 14]
        })}
      />

      {/* ETA HUD tag floating in the center of the route */}
      <Marker position={midpoint} icon={etaIcon} />
    </>
  );
}

export default RouteLayer;
