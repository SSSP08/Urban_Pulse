'use client';

import React, { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { TrafficSignal, CongestionLevel } from '@/types/traffic';
import { activePhaseTime } from '@/lib/signalSimulation';
import useAppStore from '@/store/useStore';

// ─── Style maps (inline only — avoids Tailwind purge of dynamic classes) ──────

const CONGESTION_COLOR: Record<CongestionLevel, string> = {
  LOW:    '#22c55e',
  MEDIUM: '#f97316',
  HIGH:   '#ef4444',
};

const CONGESTION_BG: Record<CongestionLevel, string> = {
  LOW:    '#14532d',
  MEDIUM: '#7c2d12',
  HIGH:   '#7f1d1d',
};

const CONGESTION_FG: Record<CongestionLevel, string> = {
  LOW:    '#4ade80',
  MEDIUM: '#fb923c',
  HIGH:   '#f87171',
};

const CONGESTION_LABEL: Record<CongestionLevel, string> = {
  LOW:    'Low Traffic',
  MEDIUM: 'Moderate',
  HIGH:   'Heavy Traffic',
};

const PHASE_LABEL: Record<string, string> = {
  NORTH: '↑ Northbound',
  SOUTH: '↓ Southbound',
  EAST:  '→ Eastbound',
  WEST:  '← Westbound',
};

// ─── Traffic-light SVG icon factory ──────────────────────────────────────────

function buildSignalIcon(phase: string, congestion: CongestionLevel, emergencyMode: boolean): L.DivIcon {
  const activeColor = emergencyMode ? '#ef4444' : CONGESTION_COLOR[congestion];

  // If emergency mode is active, make it flash red/blue priority border
  const borderStyle = emergencyMode
    ? '2px solid #ef4444; animation: pulse-border 1s infinite alternate;'
    : '2px solid #334155;';

  // Three-circle traffic light (red top, amber middle, green bottom).
  // Under Emergency, force green to flash and active to show full priority
  const red    = emergencyMode ? '#3f1212' : (phase === 'NORTH' ? '#ef4444' : '#3f1212');
  const amber  = emergencyMode ? '#3f2a0a' : (phase === 'EAST'  ? '#f97316' : '#3f2a0a');
  const green  = emergencyMode ? '#22c55e' : ((phase === 'SOUTH' || phase === 'WEST') ? '#22c55e' : '#0f2e15');

  const glow = `drop-shadow(0 0 6px ${activeColor})`;

  return L.divIcon({
    html: `
      <style>
        @keyframes pulse-border {
          0% { border-color: #ef4444; box-shadow: 0 0 6px #ef4444; }
          100% { border-color: #3b82f6; box-shadow: 0 0 12px #3b82f6; }
        }
        @keyframes flash-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      </style>
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        background: #1e293b;
        border: ${borderStyle};
        border-radius: 6px;
        padding: 4px 5px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.55);
        filter: ${glow};
        cursor: pointer;
      ">
        <div style="width:10px;height:10px;border-radius:50%;background:${red};"></div>
        <div style="width:10px;height:10px;border-radius:50%;background:${amber};"></div>
        <div style="width:10px;height:10px;border-radius:50%;background:${green}; ${emergencyMode ? 'animation: flash-green 0.5s infinite;' : ''}"></div>
      </div>
    `,
    className: 'signal-div-icon',
    iconSize:  [24, 44],
    iconAnchor:[12, 22],
  });
}

// ─── Countdown bar ────────────────────────────────────────────────────────────

function CountdownBar({ total, remaining, emergencyMode }: { total: number; remaining: number; emergencyMode: boolean }) {
  const pct = total > 0 ? Math.max(0, (remaining / total) * 100) : 0;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {emergencyMode ? 'Green Override Lock' : 'Green Remaining'}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', fontVariantNumeric: 'tabular-nums' }}>
          {emergencyMode ? '∞' : `${remaining}s`}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 4, background: '#1e293b', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: emergencyMode ? '100%' : `${pct}%`,
            background: emergencyMode ? '#ef4444' : '#22c55e',
            borderRadius: 4,
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface SignalMarkerProps {
  signal: TrafficSignal;
}

export function SignalMarker({ signal }: SignalMarkerProps) {
  const emergencyMode = useAppStore((s) => s.emergencyMode);
  const total = activePhaseTime(signal);
  
  const [prevPhase, setPrevPhase] = useState(signal.currentPhase);
  const [prevTotal, setPrevTotal] = useState(total);
  const [remaining, setRemaining] = useState(total);

  if (signal.currentPhase !== prevPhase || total !== prevTotal) {
    setPrevPhase(signal.currentPhase);
    setPrevTotal(total);
    setRemaining(total);
  }

  // Tick down every second
  useEffect(() => {
    if (emergencyMode) return; // Freeze countdown under emergency override
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [signal.currentPhase, total, emergencyMode]);

  const icon = buildSignalIcon(signal.currentPhase, signal.congestionLevel, emergencyMode);
  const congColor  = CONGESTION_COLOR[signal.congestionLevel];
  const congBg     = emergencyMode ? '#7f1d1d' : CONGESTION_BG[signal.congestionLevel];
  const congFg     = emergencyMode ? '#f87171' : CONGESTION_FG[signal.congestionLevel];

  return (
    <Marker position={[signal.latitude, signal.longitude]} icon={icon}>
      <Popup className="signal-popup" maxWidth={220}>
        <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2px 2px 4px', minWidth: 195 }}>
          {/* Header */}
          <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 13, color: '#0f172a', lineHeight: 1.3 }}>
            {signal.name}
          </p>

          {/* Current green direction */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: emergencyMode ? '#ef4444' : '#22c55e',
                flexShrink: 0,
                animation: emergencyMode ? 'flash-green 0.5s infinite' : 'none'
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
              {emergencyMode ? '🚨 Emergency Preemption' : PHASE_LABEL[signal.currentPhase]}
            </span>
          </div>

          {/* Countdown bar */}
          <CountdownBar total={total} remaining={remaining} emergencyMode={emergencyMode} />

          {/* Traffic status badge */}
          <div style={{ marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                background: congBg,
                color: congFg,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: emergencyMode ? '#ef4444' : congColor,
                  display: 'inline-block'
                }}
              />
              {emergencyMode ? 'Priority Wave Lock' : CONGESTION_LABEL[signal.congestionLevel]}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default SignalMarker;
