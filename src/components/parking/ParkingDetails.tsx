'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParkingLocation } from '@/types';
import { X, Navigation, MapPin } from 'lucide-react';
import useParkingStore from '@/store/useParkingStore';

interface ParkingDetailsProps {
  location?: ParkingLocation;
}

const STATUS_STYLES: Record<ParkingLocation['status'], string> = {
  available: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  limited:   'bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/20',
  full:      'bg-rose-500/10   text-rose-600   dark:text-rose-400   border-rose-500/20',
};

const STATUS_LABELS: Record<ParkingLocation['status'], string> = {
  available: 'Available',
  limited:   'Limited Spots',
  full:      'Full',
};

export function ParkingDetails({ location: propLocation }: ParkingDetailsProps) {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 768px)').matches;
    }
    return false;
  });
  const storeLocation = useParkingStore((s) => s.selectedLocation);
  const setSelectedLocation = useParkingStore((s) => s.setSelectedLocation);

  const location = propLocation || storeLocation;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleClose = () => {
    setSelectedLocation(null);
  };

  return (
    <AnimatePresence>
      {location && (
        /* ── Positioning shell ──────────────────────────────────────────────
           Mobile  : fixed bottom sheet — anchored to bottom, full width
           Desktop : fixed right drawer — anchored to right edge, full height
        ─────────────────────────────────────────────────────────────────── */
        <div className={[
          'fixed z-50 pointer-events-none',
          /* mobile  */ 'bottom-0 left-0 right-0',
          /* desktop */ 'md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[420px]',
        ].join(' ')}>

          {/* ── Panel ─────────────────────────────────────────────────────────
              Mobile  : white card with top-rounded corners + drag handle
              Desktop : full-height white panel with left border
          ──────────────────────────────────────────────────────────────── */}
          <motion.div
            key="parking-panel"
            initial={isDesktop ? { x: '100%' } : { y: '100%' }}
            animate={isDesktop ? { x: 0 }      : { y: 0 }}
            exit={isDesktop    ? { x: '100%' } : { y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className={[
              'pointer-events-auto w-full overflow-y-auto',
              'bg-white dark:bg-slate-950',
              'border-slate-200 dark:border-slate-800',
              'shadow-2xl',
              /* mobile  */ 'max-h-[80vh] rounded-t-3xl border-t',
              /* desktop */ 'md:max-h-full md:h-full md:rounded-none md:border-t-0 md:border-l',
            ].join(' ')}
          >
            {/* Header controls */}
            <div className="flex justify-between items-center px-6 pt-4">
              {/* Drag handle — mobile only */}
              <div className="md:hidden flex justify-center w-full absolute top-2 left-0">
                <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
              <div className="w-full flex justify-end">
                <button
                  onClick={handleClose}
                  className="cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-2 flex flex-col gap-4">

              {/* Status badge */}
              <span className={`self-start inline-flex items-center gap-1 text-[0.7rem] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[location.status]}`}>
                ● {STATUS_LABELS[location.status]}
              </span>

              {/* Name */}
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
                  Parking Name
                </p>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug">
                  {location.name}
                </h2>
              </div>

              {/* Address */}
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
                  Address
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {location.address}
                </p>
              </div>

              {/* Available Spaces */}
              <div className="bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl">
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                  Available Spaces
                </p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {location.availableSpaces}
                  <span className="text-sm font-normal text-slate-400 ml-1.5">/ {location.totalSpaces}</span>
                </p>
              </div>

              {/* Quick info metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-0.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                  <span className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Navigation className="h-3 w-3 text-blue-500" /> Hourly Rate
                  </span>
                  <span className="font-bold text-slate-800 dark:text-neutral-200">
                    {location.pricePerHour === 0 ? 'Free' : `₹${location.pricePerHour}/hr`}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl">
                  <span className="text-[0.6rem] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-500" /> Vehicle Types
                  </span>
                  <span className="font-bold text-slate-800 dark:text-neutral-200 capitalize">
                    {location.vehicleTypes.join(', ')}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ParkingDetails;
