'use client';

import React from 'react';
import useAppStore from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  Bookmark,
  Settings,
  ShieldCheck,
  MapPin,
  HelpCircle
} from 'lucide-react';

const CITIES = [
  { id: 'HYDERABAD', name: 'Hyderabad', desc: 'Hitec City Corridor' },
  { id: 'BENGALURU', name: 'Bengaluru', desc: 'Silk Board Junction' },
  { id: 'MUMBAI', name: 'Mumbai', desc: 'BKC Tech District' },
  { id: 'DELHI', name: 'Delhi', desc: 'Connaught Place Ring' }
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, activeCity, setActiveCity } = useAppStore();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/25 dark:bg-black/50 backdrop-blur-sm"
          />

          {/* Left slide-out panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 top-0 left-0 z-50 w-full max-w-[320px] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 select-none shadow-2xl transition-colors"
          >
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                <span className="font-bold text-slate-900 dark:text-white tracking-tight">Navigation Menu</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="cursor-pointer p-1.5 hover:bg-slate-200 dark:hover:bg-slate-900 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* City Preset List */}
            <div className="flex flex-col gap-2">
              <span className="text-[0.65rem] uppercase font-bold text-slate-400 tracking-wider">
                Select Active Corridor
              </span>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {CITIES.map((c) => {
                  const isSelected = activeCity === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCity(c.id);
                        setSidebarOpen(false);
                      }}
                      className={`cursor-pointer w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400 font-medium'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <MapPin className={`h-4 w-4 mt-0.5 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-tight">{c.name}</span>
                        <span className="text-[0.65rem] text-slate-400 leading-normal">{c.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General Menu Options */}
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[0.65rem] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Preferences
              </span>
              
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left cursor-not-allowed opacity-50">
                <Bookmark className="h-4 w-4 text-slate-400" />
                <span>Saved Places</span>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left cursor-not-allowed opacity-50">
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Map Settings</span>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left cursor-not-allowed opacity-50">
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span>Support Desk</span>
              </button>
            </div>

            {/* Bottom Status panel */}
            <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Smart Cities Mission</span>
              </div>
              <p className="text-[0.65rem] text-slate-400 leading-normal">
                Connecting India&apos;s municipal corridors with automated telemetry grids.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
export default Sidebar;
