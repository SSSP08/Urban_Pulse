'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  MapPin,
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Navigation,
  CircleParking,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import useParkingStore from '@/store/useParkingStore';
import useAppStore from '@/store/useStore';
import {
  fetchAIRecommendation,
  toSnapshot,
  type GeminiRecommendationOutput,
  type TrafficSnapshot,
} from '@/lib/aiService';
import { INITIAL_TRAFFIC_SEGMENTS } from '@/data/mockTrafficData';

// ─── Canonical recommendation shape used throughout the component ─────────────

interface AIRecommendation {
  bestParking: string;
  availability: number;
  estimatedTravelTime: string;
  trafficCondition: 'Low' | 'Moderate' | 'Heavy';
  estimatedTimeSaved: string;
  confidence: number;
  reason: string;
}

// ─── Static fallback (used on error or missing key) ───────────────────────────

const MOCK_RECOMMENDATION: AIRecommendation = {
  bestParking: 'Cyber Towers Smart MLCP',
  availability: 212,
  estimatedTravelTime: '6 minutes',
  trafficCondition: 'Moderate',
  estimatedTimeSaved: '8 minutes',
  confidence: 94,
  reason:
    'Moderate traffic detected near your destination. Cyber Towers Parking offers the shortest walking distance and currently has high availability.',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TRAFFIC_COLOR: Record<AIRecommendation['trafficCondition'], string> = {
  Low:      'text-emerald-400',
  Moderate: 'text-amber-400',
  Heavy:    'text-rose-400',
};

const TRAFFIC_BG: Record<AIRecommendation['trafficCondition'], string> = {
  Low:      'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  Moderate: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  Heavy:    'bg-rose-500/10 border-rose-500/20 text-rose-400',
};

/**
 * Map Gemini output → component's AIRecommendation shape,
 * looking up real availability from the parking yard list.
 */
function mapGeminiOutput(
  output: GeminiRecommendationOutput,
  yards: ReturnType<typeof useParkingStore.getState>['parkingYards']
): AIRecommendation {
  const matched = yards.find((y) =>
    y.name.toLowerCase().includes(output.recommendedParking.toLowerCase()) ||
    output.recommendedParking.toLowerCase().includes(y.name.toLowerCase())
  );

  return {
    bestParking: output.recommendedParking,
    availability: matched?.availableSpots ?? 0,
    estimatedTravelTime: output.estimatedTravelTime,
    trafficCondition: output.trafficCondition,
    estimatedTimeSaved: output.timeSaved,
    confidence: output.confidence,
    reason: output.reason,
  };
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="px-4 pb-4 flex flex-col gap-3" aria-busy="true" aria-label="Loading AI recommendation">
      {/* Parking row placeholder */}
      <div className="h-14 rounded-xl bg-slate-800/60 animate-pulse" />
      {/* Metrics row placeholder */}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 rounded-xl bg-slate-800/60 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      {/* Confidence + reason placeholder */}
      <div className="h-16 rounded-xl bg-slate-800/60 animate-pulse" style={{ animationDelay: '160ms' }} />
    </div>
  );
}

// ─── Confidence ring ──────────────────────────────────────────────────────────

function ConfidenceRing({ pct }: { pct: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-14 h-14" aria-label={`Confidence ${pct}%`}>
      <svg width="56" height="56" className="-rotate-90" aria-hidden>
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4" className="stroke-slate-700" />
        <circle
          cx="28" cy="28" r={r} fill="none" strokeWidth="4" strokeLinecap="round"
          className="stroke-violet-500"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className="absolute text-[11px] font-extrabold text-white tabular-nums">{pct}%</span>
    </div>
  );
}

// ─── Metric pill ──────────────────────────────────────────────────────────────

function MetricPill({
  icon, label, value, valueClass = 'text-white',
}: { icon: React.ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-1 bg-slate-900/60 border border-slate-700/40 rounded-xl p-2.5 min-w-0">
      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
        {icon}{label}
      </span>
      <span className={`text-xs font-bold leading-tight truncate ${valueClass}`}>{value}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export function AIRecommendationCard() {
  const [visible, setVisible] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [recommendation, setRecommendation] = useState<AIRecommendation>(MOCK_RECOMMENDATION);
  const [isAIResult, setIsAIResult] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const parkingYards = useParkingStore((s) => s.parkingYards);
  const activeCity = useAppStore((s) => s.activeCity);

  // Build traffic snapshot from the static mock segments (live segments live in TrafficLayer state,
  // which is component-scoped; we use the initial dataset as a reasonable context snapshot).
  const trafficSnapshot: TrafficSnapshot[] = INITIAL_TRAFFIC_SEGMENTS.map((seg) => ({
    roadName: seg.roadName,
    congestionLevel: seg.congestionLevel,
    averageSpeed: seg.averageSpeed,
  }));

  const runFetch = useCallback(async () => {
    setStatus('loading');
    setIsSpinning(true);

    // Only include yards for the active city
    const cityYards = parkingYards.filter((y) => y.cityId === activeCity);
    const parkingOptions = cityYards.map(toSnapshot);

    try {
      const output = await fetchAIRecommendation({
        city: activeCity.charAt(0) + activeCity.slice(1).toLowerCase(),
        parkingOptions,
        trafficConditions: trafficSnapshot,
      });
      setRecommendation(mapGeminiOutput(output, cityYards));
      setIsAIResult(true);
      setStatus('success');
    } catch (err) {
      console.warn('[AIRecommendationCard] Gemini unavailable, using fallback.', err);
      setRecommendation(MOCK_RECOMMENDATION);
      setIsAIResult(false);
      setStatus('error');
    } finally {
      setTimeout(() => setIsSpinning(false), 600);
    }
  }, [parkingYards, activeCity]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fetch on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      runFetch();
    }, 0);
    return () => clearTimeout(timer);
  }, [runFetch]);

  const rec = recommendation;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ai-rec-card"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 0.15 }}
          className={[
            'absolute bottom-[135px] left-4 right-4',
            'md:bottom-6 md:right-6 md:left-auto md:w-[340px] w-auto',
            'bg-slate-950/80 backdrop-blur-xl',
            'border border-slate-700/50',
            'rounded-2xl shadow-2xl shadow-black/50',
            'z-30 pointer-events-auto select-none',
          ].join(' ')}
          role="region"
          aria-label="AI Recommendation Panel"
        >
          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-violet-500/15 border border-violet-500/25 rounded-lg px-2 py-1">
                <Brain className="w-3 h-3 text-violet-400" aria-hidden />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400">
                  AI Recommendation
                </span>
              </div>
              {/* Live / Fallback indicator */}
              {status !== 'idle' && status !== 'loading' && (
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isAIResult
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-slate-700/60 text-slate-400'
                  }`}
                >
                  {isAIResult ? 'Gemini' : 'Mock'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Refresh */}
              <button
                onClick={runFetch}
                disabled={status === 'loading'}
                className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Refresh AI recommendation"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
              </button>

              {/* Collapse */}
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
              >
                {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Dismiss */}
              <button
                onClick={() => setVisible(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Dismiss recommendation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Collapsible body ─────────────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="body"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {/* Loading skeleton */}
                {status === 'loading' && <LoadingSkeleton />}

                {/* Error banner (shown above fallback data) */}
                {status === 'error' && (
                  <div className="mx-4 mb-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                    <WifiOff className="w-3 h-3 text-rose-400 flex-shrink-0" aria-hidden />
                    <span className="text-[10px] text-rose-300 leading-snug">
                      AI recommendation temporarily unavailable. Showing mock data.
                    </span>
                  </div>
                )}

                {/* Recommendation content */}
                {(status === 'success' || status === 'error') && (
                  <div className="px-4 pb-4 flex flex-col gap-3">

                    {/* Parking target row */}
                    <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700/30 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                          <CircleParking className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Best Parking</p>
                          <p className="text-sm font-bold text-white truncate">{rec.bestParking}</p>
                        </div>
                      </div>
                      {rec.availability > 0 && (
                        <span className="flex-shrink-0 ml-2 text-xs font-extrabold text-emerald-400 tabular-nums">
                          {rec.availability} <span className="text-[10px] font-normal text-slate-500">spaces</span>
                        </span>
                      )}
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <MetricPill
                        icon={<Navigation className="w-2.5 h-2.5" aria-hidden />}
                        label="Travel"
                        value={rec.estimatedTravelTime}
                      />
                      <MetricPill
                        icon={<TrendingUp className="w-2.5 h-2.5" aria-hidden />}
                        label="Traffic"
                        value={rec.trafficCondition}
                        valueClass={TRAFFIC_COLOR[rec.trafficCondition]}
                      />
                      <MetricPill
                        icon={<Zap className="w-2.5 h-2.5" aria-hidden />}
                        label="Saved"
                        value={rec.estimatedTimeSaved}
                        valueClass="text-violet-400"
                      />
                    </div>

                    {/* Confidence + reason */}
                    <div className="flex items-start gap-3 bg-slate-900/50 border border-slate-700/30 rounded-xl p-3">
                      <ConfidenceRing pct={rec.confidence} />
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                          Confidence Score
                        </span>
                        <p className="text-[11px] leading-snug text-slate-300 line-clamp-4">
                          {rec.reason}
                        </p>
                      </div>
                    </div>

                    {/* Traffic status badge */}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" aria-hidden />
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${TRAFFIC_BG[rec.trafficCondition]}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                        {rec.trafficCondition} Traffic · Near Destination
                      </span>
                    </div>

                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Collapsed summary row ────────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {collapsed && (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="px-4 pb-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CircleParking className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
                  <span className="text-xs font-bold text-white truncate">{rec.bestParking}</span>
                </div>
                <span className="text-xs font-extrabold text-violet-400">{rec.confidence}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AIRecommendationCard;
