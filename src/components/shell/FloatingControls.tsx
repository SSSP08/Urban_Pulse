'use client';

import React from 'react';
import useAppStore from '@/store/useStore';
import { Compass, Navigation, ShieldAlert } from 'lucide-react';

export function FloatingControls() {
  const {
    trafficLayerActive,
    setTrafficLayerActive,
    selectedElement,
    setSelectedElement,
    triggerLocate,
    emergencyMode,
    setEmergencyMode
  } = useAppStore();

  const handleRecenter = () => {
    // Reset selection to clear overlays
    if (selectedElement) {
      setSelectedElement(null);
    }
    triggerLocate();
  };

  const handleEmergencyTrigger = () => {
    const nextMode = !emergencyMode;
    setEmergencyMode(nextMode);
  };

  return (
    <div className="absolute right-4 bottom-24 z-30 flex flex-col gap-3 pointer-events-none select-none">
      {/* 108 Emergency Override Action (Flashing Red when active) */}
      <button
        onClick={handleEmergencyTrigger}
        className={`pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 relative group ${
          emergencyMode
            ? 'border-red-500 bg-red-500/20 text-red-500 animate-pulse ring-4 ring-red-500/30'
            : 'border-red-200 dark:border-red-900/50 bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25'
        }`}
        title="Toggle 108 Emergency Mode"
      >
        <ShieldAlert className="h-5 w-5" />
        {/* Tooltip on hover */}
        <span className="absolute right-14 whitespace-nowrap bg-red-950/90 text-red-200 text-xs font-semibold py-1 px-3.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md border border-red-900/50">
          Emergency Mode: {emergencyMode ? 'ACTIVE' : 'OFF'}
        </span>
      </button>

      {/* Dynamic Traffic Layer Toggle */}
      <button
        onClick={() => setTrafficLayerActive(!trafficLayerActive)}
        className={`pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 group relative ${
          trafficLayerActive
            ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
            : 'bg-white/90 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
        }`}
        title="Toggle Traffic Flow Layer"
      >
        <Navigation className={`h-5 w-5 ${trafficLayerActive ? 'rotate-45 text-emerald-500' : 'text-slate-400'}`} />
        <span className={`absolute right-14 whitespace-nowrap text-xs font-semibold py-1 px-3.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md border ${
          trafficLayerActive
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-900/50'
            : 'bg-slate-900/90 text-slate-200 border-slate-800'
        }`}>
          Traffic Layer: {trafficLayerActive ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* Recenter Map Camera */}
      <button
        onClick={handleRecenter}
        className="pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-all duration-300 group relative"
        title="Recenter Map Viewport"
      >
        <Compass className="h-5 w-5 hover:rotate-12 transition-transform duration-300" />
        <span className="absolute right-14 whitespace-nowrap bg-slate-950/90 text-slate-200 text-xs font-semibold py-1 px-3.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md border border-slate-800">
          Recenter Map
        </span>
      </button>
    </div>
  );
}
export default FloatingControls;
