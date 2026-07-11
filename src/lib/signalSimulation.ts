import type { CongestionLevel, SignalPhase, TrafficSignal } from '@/types/traffic';

// ─── Congestion transition table ──────────────────────────────────────────────

/** Stochastic next-level table — same weights used in TrafficLayer for consistency */
const CONGESTION_TRANSITIONS: Record<CongestionLevel, CongestionLevel[]> = {
  LOW:    ['LOW', 'LOW', 'MEDIUM'],
  MEDIUM: ['LOW', 'MEDIUM', 'MEDIUM', 'HIGH'],
  HIGH:   ['MEDIUM', 'MEDIUM', 'HIGH'],
};

function nextCongestion(current: CongestionLevel): CongestionLevel {
  const options = CONGESTION_TRANSITIONS[current];
  return options[Math.floor(Math.random() * options.length)];
}

// ─── Signal-time calculation ──────────────────────────────────────────────────

/**
 * Returns [primary, secondary] green times (seconds) for HIGH/MEDIUM/LOW.
 * Primary  = the direction under pressure.
 * Secondary = all other directions share equally.
 */
function timesForCongestion(level: CongestionLevel): { primary: number; secondary: number } {
  switch (level) {
    case 'HIGH':
      return {
        primary:   Math.round(42 + Math.random() * 8),  // 42–50 s
        secondary: Math.round(12 + Math.random() * 6),  // 12–18 s
      };
    case 'MEDIUM':
      return {
        primary:   Math.round(30 + Math.random() * 5),  // 30–35 s
        secondary: Math.round(18 + Math.random() * 4),  // 18–22 s
      };
    case 'LOW':
    default: {
      const equal = Math.round(18 + Math.random() * 4); // 18–22 s
      return { primary: equal, secondary: equal };
    }
  }
}

// ─── Phase rotation ───────────────────────────────────────────────────────────

const PHASE_ORDER: SignalPhase[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

function advancePhase(current: SignalPhase): SignalPhase {
  const idx = PHASE_ORDER.indexOf(current);
  return PHASE_ORDER[(idx + 1) % PHASE_ORDER.length];
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Pure function: given the current array of signals, returns a new array
 * with updated congestion levels, adaptive signal times, and advanced phases.
 *
 * The function is side-effect free and safe to call from any React render context.
 */
export function simulateSignalTick(signals: TrafficSignal[]): TrafficSignal[] {
  return signals.map((signal) => {
    const newCongestion = nextCongestion(signal.congestionLevel);
    const { primary, secondary } = timesForCongestion(newCongestion);
    const newPhase = advancePhase(signal.currentPhase);

    // Assign primary time to the phase that is about to go green (newPhase),
    // secondary to all other legs.
    return {
      ...signal,
      congestionLevel: newCongestion,
      currentPhase: newPhase,
      northSignalTime: newPhase === 'NORTH' ? primary : secondary,
      southSignalTime: newPhase === 'SOUTH' ? primary : secondary,
      eastSignalTime:  newPhase === 'EAST'  ? primary : secondary,
      westSignalTime:  newPhase === 'WEST'  ? primary : secondary,
    };
  });
}

// ─── Helpers (exported for use in UI) ────────────────────────────────────────

/** Returns the green time (seconds) for the signal's current active phase. */
export function activePhaseTime(signal: TrafficSignal): number {
  switch (signal.currentPhase) {
    case 'NORTH': return signal.northSignalTime;
    case 'SOUTH': return signal.southSignalTime;
    case 'EAST':  return signal.eastSignalTime;
    case 'WEST':  return signal.westSignalTime;
  }
}
