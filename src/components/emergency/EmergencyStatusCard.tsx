'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, RefreshCw, X, Radio } from 'lucide-react';
import useAppStore from '@/store/useStore';
import { fetchEmergencySummary } from '@/lib/aiService';

export function EmergencyStatusCard() {
  const { emergencyMode, setEmergencyMode } = useAppStore();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const summary = await fetchEmergencySummary();
      setAiSummary(summary);
    } catch (err) {
      console.warn('[EmergencyStatusCard] Gemini summary failed, using offline fallback.', err);
      setAiSummary(
        'Corridor priority routing engages automated signal wave synchronization along HITEC City Main Road, bypassing heavy congestion hotspots.'
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (emergencyMode) {
        loadSummary();
      } else {
        setAiSummary('');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [emergencyMode, loadSummary]);

  return (
    <AnimatePresence>
      {emergencyMode && (
        <motion.div
          key="emergency-card"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 180 }}
          className={[
            'absolute top-20 left-4 z-30',
            'w-[calc(100%-2rem)] max-w-[420px]',
            'bg-red-950/80 backdrop-blur-md',
            'border border-red-500/30',
            'rounded-2xl p-4 shadow-xl shadow-red-950/20 text-white',
            'pointer-events-auto select-none'
          ].join(' ')}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <ShieldAlert className="h-5 w-5 text-red-400" />
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-red-200">
                108 Priority Wave Active
              </h4>
            </div>
            <button
              onClick={() => setEmergencyMode(false)}
              className="cursor-pointer p-1 rounded-lg hover:bg-white/10 text-red-300 hover:text-white transition-colors"
              aria-label="Dismiss Emergency Mode"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-red-200/90 leading-relaxed mb-3">
            Traffic light preemption signals locked on Gachibowli - Hitec City main corridor. Emergency vehicles cleared for continuous green wave traversal.
          </p>

          {/* AI Optimal Route Summary Section */}
          <div className="bg-red-900/30 border border-red-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-red-300">
                <Zap className="h-3 w-3 text-red-400" />
                AI Optimization Summary
              </span>
              <button
                onClick={loadSummary}
                disabled={loading}
                className="cursor-pointer p-1 rounded-md hover:bg-white/10 text-red-400 hover:text-red-200 disabled:opacity-40 transition-colors"
                title="Regenerate summary"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="space-y-2 py-1" aria-busy="true">
                <div className="h-2.5 bg-red-500/10 rounded animate-pulse w-full"></div>
                <div className="h-2.5 bg-red-500/10 rounded animate-pulse w-5/6"></div>
              </div>
            ) : (
              <p className="text-[11px] leading-relaxed text-red-100 italic">
                &quot;{aiSummary}&quot;
              </p>
            )}

            {error && !loading && (
              <div className="mt-2 text-[9px] text-red-400/80 flex items-center gap-1">
                <Radio className="h-2.5 w-2.5 animate-pulse" /> Running in local fallback mode
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EmergencyStatusCard;
