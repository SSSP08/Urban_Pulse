'use client';

import React, { useState } from 'react';
import useAppStore from '@/store/useStore';
import useParkingStore, { ParkingYard } from '@/store/useParkingStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Navigation,
  Info,
  Calendar,
  Zap,
  Bookmark,
  Share2,
  Lock,
  Clock,
  CheckCircle,
  Coins
} from 'lucide-react';

export function BottomDrawer() {
  const { selectedElement, setSelectedElement, activeCity } = useAppStore();
  const { selectedYard, setSelectedYard } = useParkingStore();

  const [isSaved, setIsSaved] = useState(false);

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleClose = () => {
    if (selectedYard) {
      setSelectedYard(null);
    } else if (selectedElement) {
      setSelectedElement(null);
    }
  };

  const handleReserve = (yard: ParkingYard) => {
    alert(`⚡ SIMULATION: Slot reserved at ${yard.name}.\nSlot Assigned: B-${Math.floor(Math.random() * 50) + 1}\nAccess PIN: ${Math.floor(Math.random() * 9000) + 1000}`);
  };

  const handleShare = (yard: ParkingYard) => {
    alert(`🔗 LINK SHARED: Navigating coordinates [${yard.lat.toFixed(4)}, ${yard.lng.toFixed(4)}] shared successfully.`);
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    alert(isSaved ? '📌 Yard removed from bookmarks.' : '📌 Yard saved to bookmarks.');
  };


  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-[380px] z-30 pointer-events-none select-none">
      <AnimatePresence mode="wait">
        {selectedYard ? (
          /* 1. Smart Parking Yard Detail Card */
          <motion.div
            key={`yard-${selectedYard.id}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className="pointer-events-auto w-full border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-5 rounded-2xl shadow-xl flex flex-col gap-4 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block text-[0.6rem] font-extrabold uppercase px-2 py-0.5 rounded-md mb-1.5 tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Smart Parking Yard
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedYard.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedYard.address}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Availability Widget */}
            <div className="bg-slate-100/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-900 p-3.5 rounded-xl">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
                  Available Slots
                </span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-500 font-mono">
                  {selectedYard.availableSpots} <span className="text-[10px] text-slate-400 font-normal">/ {selectedYard.totalCapacity} left</span>
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(selectedYard.availableSpots / selectedYard.totalCapacity) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-[0.65rem] text-slate-400 mt-2">
                <span>Occupancy: {Math.round(((selectedYard.totalCapacity - selectedYard.availableSpots) / selectedYard.totalCapacity) * 100)}%</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-500">
                  <CheckCircle className="h-3 w-3" /> Live Updates Enabled
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-0.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                <span className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Coins className="h-3 w-3" /> Hourly Fee
                </span>
                <span className="font-bold text-slate-800 dark:text-neutral-200">
                  {selectedYard.isFree ? 'Free' : `₹${selectedYard.hourlyRate.toFixed(2)}/hr`}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                <span className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="h-3 w-3" /> EV Charging
                </span>
                <span className={`font-bold ${selectedYard.isEVCharging ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {selectedYard.isEVCharging ? 'Available' : 'No Chargers'}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                <span className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Security
                </span>
                <span className="font-bold text-slate-800 dark:text-neutral-200">{selectedYard.securityStatus}</span>
              </div>

              <div className="flex flex-col gap-0.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                <span className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Hours
                </span>
                <span className="font-bold text-slate-800 dark:text-neutral-200">{selectedYard.operatingHours}</span>
              </div>
            </div>

            {/* Travel / Distance Info */}
            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-b border-neutral-100 dark:border-neutral-900 py-3 px-1">
              <span className="flex items-center gap-1">🚗 Driving: <strong>{selectedYard.drivingTime}</strong></span>
              <span className="flex items-center gap-1">🚶 Walking: <strong>{selectedYard.walkingDistance}</strong></span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => alert(`🚗 ROUTING: Custom navigation line to ${selectedYard.name} plotted.`)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/10"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Navigate Route</span>
                </button>
                
                <button 
                  onClick={() => handleReserve(selectedYard)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/10"
                >
                  <span>Reserve Slot</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleSaveToggle}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button 
                  onClick={() => handleShare(selectedYard)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : selectedElement ? (
          /* 2. Smart Traffic Intersection Detail Card */
          <motion.div
            key={`element-${selectedElement.id}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className="pointer-events-auto w-full border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-5 rounded-2xl shadow-xl flex flex-col gap-4 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block text-[0.6rem] font-extrabold uppercase px-2 py-0.5 rounded-md mb-1.5 tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Traffic Intersection Chowk
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedElement.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedElement.details.subtitle}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedElement.details.description}
            </p>

            <div className="bg-slate-100/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-900 p-3 rounded-xl">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
                  {selectedElement.details.metricLabel}
                </span>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-500 font-mono">
                  {selectedElement.details.metricValue}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {selectedElement.details.subMetrics.map((m, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                  <span className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-wider">{m.label}</span>
                  <span className="font-bold text-slate-800 dark:text-neutral-200 font-mono">{m.value}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleClose}
              className="cursor-pointer w-full text-xs font-semibold py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              Dismiss Details
            </button>
          </motion.div>
        ) : (
          /* 3. Default City Overview Diagnostic Card */
          <motion.div
            key="default-drawer"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className="pointer-events-auto w-full border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-5 rounded-2xl shadow-xl flex flex-col gap-4 transition-colors"
          >
            <div>
              <span className="text-[0.6rem] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mt-1">
                Explore {activeCity.charAt(0) + activeCity.slice(1).toLowerCase()}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tap on any parking pin (P) to review detailed slots.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/30 dark:border-slate-800/30 p-3 rounded-xl text-xs">
              <Info className="h-5 w-5 text-blue-500 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Urban Advisory</span>
                <span className="text-[0.7rem] text-slate-500 dark:text-slate-400 leading-normal">
                  Covered parking yards and EV chargers are marked across tech corridors.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default BottomDrawer;
