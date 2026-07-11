'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon asset resolution in Next.js bundlers
const fixLeafletIcon = () => {
  // @ts-expect-error - Leaflet internal property override
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
}

// Subcomponent to update map viewport camera coordinates reactively
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function LeafletMap({ center, zoom }: LeafletMapProps) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
export default LeafletMap;
