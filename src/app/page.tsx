'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/shell/Sidebar';
import SearchContainer from '@/components/shell/SearchContainer';
import BottomDrawer from '@/components/shell/BottomDrawer';
import FloatingControls from '@/components/shell/FloatingControls';
import ParkingFilters from '@/components/parking/ParkingFilters';
import ParkingDetails from '@/components/parking/ParkingDetails';
import useParkingStore from '@/store/useParkingStore';
import AIRecommendationCard from '@/components/ai/AIRecommendationCard';
import EmergencyStatusCard from '@/components/emergency/EmergencyStatusCard';

// Dynamically import MapShell to bypass server-side rendering crashes
const MapShell = dynamic(
  () => import('@/components/shell/MapShell').then((mod) => mod.MapShell),
  { ssr: false }
);

export default function Home() {
  const { updateYardsOccupancy } = useParkingStore();

  // Run the real-time simulation interval (flutters spaces every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      updateYardsOccupancy();
    }, 3000);
    return () => clearInterval(interval);
  }, [updateYardsOccupancy]);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950">
      {/* Search overlay HUD */}
      <SearchContainer />

      {/* Lightweight parking filters overlay */}
      <ParkingFilters />

      {/* Slide-out side menu */}
      <Sidebar />

      {/* Map controller FAB controls */}
      <FloatingControls />

      {/* Bottom info drawer details card */}
      <BottomDrawer />

      {/* Modern responsive parking details bottom sheet & side drawer */}
      <ParkingDetails />

      {/* AI Recommendation floating panel (bottom-right) */}
      <AIRecommendationCard />

      {/* Emergency Corridor Status HUD (top-left) */}
      <EmergencyStatusCard />

      {/* Primary interactive Leaflet Map canvas */}
      <MapShell />
    </div>
  );
}
