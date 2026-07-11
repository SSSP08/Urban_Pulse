'use client';

import React, { useState } from 'react';
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import useParkingStore from '@/store/useParkingStore';
import { ParkingLocation } from '@/types';

// Helper to calculate distance in degrees (Euclidean)
const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
};

// Dynamic clustering threshold based on zoom level
const getThreshold = (zoom: number) => {
  if (zoom <= 10) return 0.15;
  if (zoom === 11) return 0.08;
  if (zoom === 12) return 0.04;
  if (zoom === 13) return 0.02;
  if (zoom === 14) return 0.008;
  return 0; // No clustering for zoom >= 15
};

export function ParkingLayer() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const { parkingLocations, selectedLocation, setSelectedLocation } = useParkingStore();

  // Listen to zoom changes to re-calculate clusters dynamically
  useMapEvents({
    zoomend() {
      setZoom(map.getZoom());
    }
  });

  // Cluster algorithm: Group locations that are close to each other
  const threshold = getThreshold(zoom);
  const itemsToRender: Array<
    | { type: 'location'; data: ParkingLocation }
    | { type: 'cluster'; id: string; latitude: number; longitude: number; locations: ParkingLocation[] }
  > = [];

  if (threshold === 0) {
    // Render all as individual locations
    parkingLocations.forEach((loc) => {
      itemsToRender.push({ type: 'location', data: loc });
    });
  } else {
    const visited = new Set<string>();

    for (let i = 0; i < parkingLocations.length; i++) {
      const loc = parkingLocations[i];
      if (visited.has(loc.id)) continue;

      const clusterGroup: ParkingLocation[] = [loc];
      visited.add(loc.id);

      for (let j = i + 1; j < parkingLocations.length; j++) {
        const other = parkingLocations[j];
        if (visited.has(other.id)) continue;

        if (getDistance(loc.latitude, loc.longitude, other.latitude, other.longitude) < threshold) {
          clusterGroup.push(other);
          visited.add(other.id);
        }
      }

      if (clusterGroup.length > 1) {
        // Calculate center coordinates for the cluster
        const sumLat = clusterGroup.reduce((sum, item) => sum + item.latitude, 0);
        const sumLng = clusterGroup.reduce((sum, item) => sum + item.longitude, 0);
        itemsToRender.push({
          type: 'cluster',
          id: `cluster-${loc.id}`,
          latitude: sumLat / clusterGroup.length,
          longitude: sumLng / clusterGroup.length,
          locations: clusterGroup
        });
      } else {
        itemsToRender.push({ type: 'location', data: loc });
      }
    }
  }

  // Create modern custom HTML markers
  const createParkingIcon = (location: ParkingLocation) => {
    const isSelected = selectedLocation?.id === location.id;
    let colorClass = 'bg-emerald-500 border-white'; // Green
    if (location.status === 'limited') {
      colorClass = 'bg-amber-500 border-white'; // Yellow
    } else if (location.status === 'full') {
      colorClass = 'bg-rose-500 border-white'; // Red
    }

    return L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-all duration-300 ease-out hover:scale-115 active:scale-95 ${colorClass} ${
        isSelected ? 'scale-125 ring-4 ring-blue-600/40 shadow-blue-600/30 z-[1000]' : ''
      }">
          <span style="font-size: 11px; font-family: sans-serif; font-weight: 800; color: white;">P</span>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const createClusterIcon = (count: number) => {
    return L.divIcon({
      html: `
        <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-blue-600 text-white font-extrabold shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95">
          <span style="font-size: 13px; font-family: sans-serif;">${count}</span>
        </div>
      `,
      className: 'custom-cluster-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  return (
    <>
      {itemsToRender.map((item) => {
        if (item.type === 'cluster') {
          return (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={createClusterIcon(item.locations.length)}
              eventHandlers={{
                click: () => {
                  map.setView([item.latitude, item.longitude], Math.min(map.getMaxZoom(), map.getZoom() + 2), {
                    animate: true,
                    duration: 1.0
                  });
                }
              }}
            />
          );
        } else {
          const loc = item.data;
          return (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              icon={createParkingIcon(loc)}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(loc);
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 select-none font-sans min-w-[150px]">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-neutral-50 leading-tight">
                    {loc.name}
                  </h4>
                  <div className="flex justify-between items-center mt-2.5 border-t pt-1.5 border-neutral-100 dark:border-neutral-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Available</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 font-mono">
                      {loc.availableSpaces} Spaces
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Price</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                      {loc.pricePerHour === 0 ? 'Free' : `₹${loc.pricePerHour}/hr`}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        }
      })}
    </>
  );
}

export default ParkingLayer;
