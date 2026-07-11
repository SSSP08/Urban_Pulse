'use client';

import React, { useEffect, useState } from 'react';
import type { TrafficSignal } from '@/types/traffic';
import { INITIAL_SIGNALS } from '@/data/mockSignalData';
import { simulateSignalTick } from '@/lib/signalSimulation';
import SignalMarker from '../signals/SignalMarker';

/** Simulation tick interval — kept in sync with TrafficLayer's 5-second cadence */
const TICK_MS = 5_000;

/**
 * SignalLayer renders adaptive traffic signal markers at 6 Hyderabad
 * intersections. The simulation runs independently inside this component
 * and is gated by the existing `trafficLayerActive` toggle.
 */
export function SignalLayer() {
  const [signals, setSignals] = useState<TrafficSignal[]>(INITIAL_SIGNALS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) => simulateSignalTick(prev));
    }, TICK_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {signals.map((signal) => (
        <SignalMarker key={signal.id} signal={signal} />
      ))}
    </>
  );
}

export default SignalLayer;
