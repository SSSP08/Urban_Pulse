'use client';

import { CheckCircle2, Server, HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 py-6 transition-colors">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6 gap-4 text-xs">
        {/* Left Section: Copy info */}
        <div>
          &copy; {new Date().getFullYear()} UrbanPulse AI. Built for India Smart Cities Initiatives.
        </div>

        {/* Center Section: System Status Checks */}
        <div className="flex flex-wrap items-center gap-4 text-[0.7rem] font-medium font-mono">
          <div className="flex items-center gap-1.5 bg-neutral-200/50 dark:bg-neutral-900 px-2 py-1 rounded">
            <Server className="h-3 w-3 text-neutral-400" />
            <span>Supabase SDK:</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-bold">
              <CheckCircle2 className="h-3 w-3" /> READY
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-200/50 dark:bg-neutral-900 px-2 py-1 rounded">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>GIS Map Engine:</span>
            <span className="text-neutral-600 dark:text-neutral-300 font-bold">ONLINE</span>
          </div>
        </div>

        {/* Right Section: Support info */}
        <div className="flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Support Contact: smartcity-help@nic.in</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
