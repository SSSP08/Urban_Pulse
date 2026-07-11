'use client';

import React from 'react';
import useParkingStore, { ParkingFilters as FiltersType } from '@/store/useParkingStore';
import { motion } from 'framer-motion';
import {
  Check,
  Zap,
  Bike,
  Car,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';

export function ParkingFilters() {
  const { filters, setFilter, resetFilters } = useParkingStore();

  const filterOptions: Array<{
    key: keyof FiltersType;
    label: string;
    icon: React.ReactNode;
  }> = [
    { key: 'available', label: 'Available Now', icon: <Check className="h-3.5 w-3.5" /> },
    { key: 'evCharging', label: 'EV Charging', icon: <Zap className="h-3.5 w-3.5 text-amber-500" /> },
    { key: 'twoWheeler', label: 'Two Wheeler', icon: <Bike className="h-3.5 w-3.5" /> },
    { key: 'fourWheeler', label: 'Four Wheeler', icon: <Car className="h-3.5 w-3.5" /> },
    { key: 'covered', label: 'Covered Parking', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { key: 'free', label: 'Free Parking', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { key: 'paid', label: 'Paid Parking', icon: <Award className="h-3.5 w-3.5" /> }
  ];

  const handleToggle = (key: keyof FiltersType) => {
    setFilter(key, !filters[key]);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="absolute top-20 left-4 right-4 z-20 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-2 px-1 pointer-events-auto">
      {/* Reset/All Button */}
      {hasActiveFilters && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={resetFilters}
          className="cursor-pointer flex h-8 items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3.5 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors shadow-md shadow-red-500/5 select-none"
        >
          Reset Filters
        </motion.button>
      )}

      {/* Pill Buttons */}
      <div className="flex gap-2">
        {filterOptions.map((opt) => {
          const isActive = filters[opt.key];
          return (
            <button
              key={opt.key}
              onClick={() => handleToggle(opt.key)}
              className={`cursor-pointer flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold select-none shadow-md transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white/90 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default ParkingFilters;
