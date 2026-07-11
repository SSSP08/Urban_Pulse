'use client';

import React, { useEffect, useState } from 'react';
import { Polyline, Popup } from 'react-leaflet';
import type { TrafficSegment, CongestionLevel } from '@/types/traffic';
import { INITIAL_TRAFFIC_SEGMENTS } from '@/data/mockTrafficData';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Simulation tick interval in milliseconds */
const SIMULATION_INTERVAL_MS = 5_000;

/** Polyline style per congestion level */
const CONGESTION_COLOR: Record<CongestionLevel, string> = {
  LOW: '#22c55e',    // green-500
  MEDIUM: '#f97316', // orange-500
  HIGH: '#ef4444',   // red-500
};

/** Label displayed in the popup badge */
const CONGESTION_LABEL: Record<CongestionLevel, string> = {
  LOW: 'Low Traffic',
  MEDIUM: 'Moderate Traffic',
  HIGH: 'Heavy Traffic',
};

/** Badge background colour (inline style — Tailwind purges dynamic classes) */
const CONGESTION_BADGE_BG: Record<CongestionLevel, string> = {
  LOW: '#166534',    // green-900
  MEDIUM: '#7c2d12', // orange-900
  HIGH: '#7f1d1d',   // red-900
};

const CONGESTION_BADGE_FG: Record<CongestionLevel, string> = {
  LOW: '#4ade80',    // green-400
  MEDIUM: '#fb923c', // orange-400
  HIGH: '#f87171',   // red-400
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns a realistic average speed (km/h) for a given congestion level,
 * with a small random variance to make the simulation feel alive.
 */
function speedForLevel(level: CongestionLevel): number {
  switch (level) {
    case 'LOW':
      return Math.round(50 + Math.random() * 15); // 50–65 km/h
    case 'MEDIUM':
      return Math.round(20 + Math.random() * 20); // 20–40 km/h
    case 'HIGH':
      return Math.round(5 + Math.random() * 15);  // 5–20 km/h
  }
}

/**
 * Simulates one tick of traffic change.
 * Transitions: LOW → MEDIUM → HIGH → MEDIUM (with stochastic chance).
 */
function simulateTick(segments: TrafficSegment[]): TrafficSegment[] {
  const TRANSITION: Record<CongestionLevel, CongestionLevel[]> = {
    LOW: ['LOW', 'LOW', 'MEDIUM'],           // 67% stays LOW, 33% → MEDIUM
    MEDIUM: ['LOW', 'MEDIUM', 'MEDIUM', 'HIGH'], // spread across all
    HIGH: ['MEDIUM', 'MEDIUM', 'HIGH'],      // 67% → MEDIUM, 33% stays HIGH
  };

  return segments.map((seg) => {
    const options = TRANSITION[seg.congestionLevel];
    const nextLevel = options[Math.floor(Math.random() * options.length)];
    const changed = nextLevel !== seg.congestionLevel;
    return {
      ...seg,
      congestionLevel: nextLevel,
      averageSpeed: changed ? speedForLevel(nextLevel) : seg.averageSpeed,
      lastUpdated: new Date().toISOString(),
    };
  });
}

/** Formats an ISO timestamp to a human-readable "HH:MM:SS" string. */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TrafficLayer() {
  const [segments, setSegments] = useState<TrafficSegment[]>(INITIAL_TRAFFIC_SEGMENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSegments((prev) => simulateTick(prev));
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {segments.map((segment) => {
        const color = CONGESTION_COLOR[segment.congestionLevel];
        const label = CONGESTION_LABEL[segment.congestionLevel];
        const badgeBg = CONGESTION_BADGE_BG[segment.congestionLevel];
        const badgeFg = CONGESTION_BADGE_FG[segment.congestionLevel];

        return (
          <Polyline
            key={segment.id}
            positions={segment.coordinates}
            pathOptions={{
              color,
              weight: 5,
              opacity: 0.88,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          >
            <Popup className="traffic-segment-popup">
              <div
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  minWidth: '200px',
                  padding: '2px 2px 4px',
                }}
              >
                {/* Road name */}
                <p
                  style={{
                    margin: '0 0 8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#0f172a',
                    lineHeight: 1.3,
                  }}
                >
                  {segment.roadName}
                </p>

                {/* Congestion badge */}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    backgroundColor: badgeBg,
                    color: badgeFg,
                    marginBottom: '10px',
                  }}
                >
                  {label}
                </span>

                {/* Metrics grid */}
                <div
                  style={{
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '8px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px 12px',
                  }}
                >
                  <MetricItem label="Avg Speed" value={`${segment.averageSpeed} km/h`} />
                  <MetricItem label="Updated" value={formatTime(segment.lastUpdated)} />
                </div>
              </div>
            </Popup>
          </Polyline>
        );
      })}
    </>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#94a3b8',
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: '2px 0 0',
          fontSize: '12px',
          fontWeight: 700,
          color: '#1e293b',
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default TrafficLayer;
