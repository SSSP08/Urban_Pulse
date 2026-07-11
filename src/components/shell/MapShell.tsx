'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, ScaleControl, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useAppStore from '@/store/useStore';
import useParkingStore from '@/store/useParkingStore';

// Dynamic modular map layers
import ParkingLayer from '../map/layers/ParkingLayer';
import TrafficLayer from '../map/layers/TrafficLayer';
import EmergencyLayer from '../map/layers/EmergencyLayer';
import IncidentLayer from '../map/layers/IncidentLayer';
import RouteLayer from '../map/layers/RouteLayer';
import AiRecommendationLayer from '../map/layers/AiRecommendationLayer';
import SignalLayer from '../map/layers/SignalLayer';

// Dynamic map controls
import CoordinatesControl from '../map/controls/CoordinatesControl';

const CITY_CENTERS: { [key: string]: { center: [number, number]; zoom: number } } = {
  HYDERABAD: { center: [17.4470, 78.3830], zoom: 14 },
  BENGALURU: { center: [12.9150, 77.6250], zoom: 14 },
  MUMBAI: { center: [19.0600, 72.8600], zoom: 14 },
  DELHI: { center: [28.6300, 77.2200], zoom: 14 }
};

// Map controller updates viewports when city preset selects or FAB locate triggers
function MapController() {
  const map = useMap();
  const { activeCity, selectedElement, locateTriggered } = useAppStore();
  const { selectedYard, selectedLocation } = useParkingStore();
  const initialMount = React.useRef(true);

  // Focus map camera on element, parking yard, parking location, or active city
  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.latitude, selectedLocation.longitude], 16, {
        animate: true,
        duration: 1.2
      });
    } else if (selectedYard) {
      map.flyTo([selectedYard.lat, selectedYard.lng], 16, {
        animate: true,
        duration: 1.2
      });
    } else if (selectedElement) {
      map.flyTo([selectedElement.lat, selectedElement.lng], 16, {
        animate: true,
        duration: 1.2
      });
    } else {
      const preset = CITY_CENTERS[activeCity] || CITY_CENTERS.HYDERABAD;
      map.setView(preset.center, preset.zoom, {
        animate: true
      });
    }
  }, [activeCity, selectedElement, selectedYard, selectedLocation, map]);

  // Handle Locate Me browser geolocator trigger
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    map.locate({ setView: true, maxZoom: 15 });
  }, [locateTriggered, map]);

  // Capture geolocation coordinates callbacks safely
  useMapEvents({
    locationfound(e) {
      // Draw a temporary pulse ring at the user's geolocated coordinates
      const pulseIcon = L.divIcon({
        html: `<div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md animate-ping"></div>`,
        className: 'custom-div-icon',
        iconSize: [24, 24]
      });
      const marker = L.marker(e.latlng, { icon: pulseIcon }).addTo(map);
      setTimeout(() => marker.remove(), 4000);
    },
    locationerror() {
      console.warn('Geolocation access declined or unavailable.');
    }
  });

  return null;
}

export function MapShell() {
  const { activeCity, theme, trafficLayerActive } = useAppStore();
  const preset = CITY_CENTERS[activeCity] || CITY_CENTERS.HYDERABAD;

  // Modern Map Tiles Styles (Voyager for Light, Dark Matter for Dark Mode)
  const tileUrl = theme === 'light'
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="absolute inset-0 z-10 w-full h-full">
      <MapContainer
        center={preset.center}
        zoom={preset.zoom}
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Swapping key forces redrawing of tiles when theme changes */}
        <TileLayer
          key={theme}
          url={tileUrl}
          attribution='&copy; CARTO &copy; OpenStreetMap'
        />

        {/* 1. Parking layer (smart yard indicators) */}
        <ParkingLayer />

        {/* 2. Traffic layer (corridor lines and chowks) */}
        {trafficLayerActive && <TrafficLayer />}

        {/* 3. Smart traffic signal layer */}
        {trafficLayerActive && <SignalLayer />}

        {/* 4. Empty placeholder layers for future extension */}
        <EmergencyLayer />
        <IncidentLayer />
        <RouteLayer />
        <AiRecommendationLayer />

        {/* 4. Click map coordinates popups listener */}
        <CoordinatesControl />

        {/* 5. Scale indicators */}
        <ScaleControl position="bottomleft" />

        {/* 6. View controller hooks */}
        <MapController />
      </MapContainer>
    </div>
  );
}
export default MapShell;
