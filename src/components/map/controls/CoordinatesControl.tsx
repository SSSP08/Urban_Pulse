'use client';

import React, { useState } from 'react';
import { useMapEvents, Popup } from 'react-leaflet';

export function CoordinatesControl() {
  const [clickedPos, setClickedPos] = useState<[number, number] | null>(null);

  // Hook into Leaflet map click events
  useMapEvents({
    click(e) {
      setClickedPos([e.latlng.lat, e.latlng.lng]);
    }
  });

  if (!clickedPos) return null;

  return (
    <Popup position={clickedPos} eventHandlers={{ remove: () => setClickedPos(null) }}>
      <div className="font-sans text-xs p-0.5 select-none">
        <span className="font-bold text-slate-900 dark:text-neutral-50 block border-b pb-1 mb-1 border-neutral-100 dark:border-neutral-800">
          Target Coordinates
        </span>
        <span className="font-mono text-[10px] text-slate-500 block leading-tight">
          Lat: {clickedPos[0].toFixed(6)}
        </span>
        <span className="font-mono text-[10px] text-slate-500 block leading-tight mt-0.5">
          Lng: {clickedPos[1].toFixed(6)}
        </span>
      </div>
    </Popup>
  );
}
export default CoordinatesControl;
