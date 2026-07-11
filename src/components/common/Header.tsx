'use client';

import Link from 'next/link';
import useAppStore from '@/store/useStore';
import ThemeToggle from './ThemeToggle';
import { Activity, Shield } from 'lucide-react';

const CITIES = [
  { id: 'HYDERABAD', name: 'Hyderabad' },
  { id: 'BENGALURU', name: 'Bengaluru' },
  { id: 'MUMBAI', name: 'Mumbai' },
  { id: 'DELHI', name: 'Delhi' }
];

export function Header() {
  const { activeCity, setActiveCity } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/75 dark:bg-black/75 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-md">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
              UrbanPulse AI
            </span>
            <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
              <Shield className="h-3 w-3" />
              <span>Smart Cities Mission</span>
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
            Grid Dashboard
          </Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors opacity-50 cursor-not-allowed">
            Parking Yards
          </Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors opacity-50 cursor-not-allowed">
            Traffic Coordination
          </Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors opacity-50 cursor-not-allowed">
            AI Analytics
          </Link>
        </nav>

        {/* Right Section: City Selector + Theme Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs uppercase text-neutral-500 tracking-wider font-semibold">
              Region:
            </span>
            <select
              value={activeCity}
              onChange={(e) => setActiveCity(e.target.value)}
              className="h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-1 text-sm font-bold text-neutral-800 dark:text-neutral-200 outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 cursor-pointer"
            >
              {CITIES.map((city) => (
                <option key={city.id} value={city.id} className="dark:bg-neutral-950 dark:text-white">
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
export default Header;
