'use client';

import React from 'react';
import useAppStore from '@/store/useStore';
import useParkingStore from '@/store/useParkingStore';
import ThemeToggle from '../common/ThemeToggle';
import { Menu, Search, Bell, User } from 'lucide-react';

export function SearchContainer() {
  const { toggleSidebar, searchQuery, setSearchQuery, activeCity } = useAppStore();
  const { parkingYards, setSelectedYard } = useParkingStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search for parking yards within the active city matching the term
    const match = parkingYards.find(
      (y) => y.cityId === activeCity && y.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      setSelectedYard(match);
      setSearchQuery('');
    } else {
      alert(`No smart parking yard found for "${searchQuery}" in ${activeCity.charAt(0) + activeCity.slice(1).toLowerCase()}.`);
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-4 pointer-events-none select-none">
      {/* Search Input Box (Floating Card) */}
      <form
        onSubmit={handleSearchSubmit}
        className="pointer-events-auto flex h-12 w-full max-w-[420px] items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-3 shadow-lg transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20"
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className="cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
          title="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search smart yards, metro chowks..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none border-none focus:ring-0"
          />
        </div>
      </form>

      {/* Right Side Controls (Floating Avatars & Actions) */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Alerts / Notifications (Hidden on Mobile) */}
        <button className="hidden md:flex relative cursor-pointer h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
        </button>

        {/* Theme Switching System */}
        <div className="shadow-lg rounded-2xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 flex h-12 w-12 items-center justify-center">
          <ThemeToggle />
        </div>

        {/* User Account Avatar (Hidden on Mobile) */}
        <button className="hidden md:flex cursor-pointer h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-all">
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
export default SearchContainer;
