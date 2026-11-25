// Bears Intelligence Lab — component interfaces
// Strongly typed, decoupled from ESPN/live data hooks.

export interface LabPlayer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  number: number;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'OL' | 'DL' | 'LB' | 'DB' | 'K' | 'P';
  experience: number;
  college: string;
  heightInches: number;
  weightLbs: number;
  age: number;
  statusLabel?: string;
}

export interface LabPassingStats {
  attempts: number;
  completions: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
  rating: number;
  yardsPerAttempt: number;
  completionPct: number;
}

export interface LabRushingStats {
  attempts: number;
  yards: number;
  touchdowns: number;
  yardsPerCarry: number;
  longRun: number;
}

export interface LabReceivingStats {
  targets: number;
  receptions: number;
  yards: number;
  touchdowns: number;
  yardsPerCatch: number;
  catchPct: number;
}

export type LabPlayerStats = LabPassingStats | LabRushingStats | LabReceivingStats;

export interface LabThirdDownEntry {
  distance: number; // yards to go (1–10)
  conversions: number;
  attempts: number;
  rate: number; // 0–1
}

export type PassOutcome = 'complete' | 'incomplete' | 'touchdown' | 'interception';

export interface LabPassTarget {
  // Normalized field coordinates: 0 = offense left/near sideline, 100 = far end
  x: number; // 0–100 (sideline to sideline)
  y: number; // 0–100 (offense's goal line = 100, opponent's goal line = 0)
  outcome: PassOutcome;
  yards?: number;
  route?: string;
}

export interface LabTrendPoint {
  week: number;
  label: string;
  value: number;
  opponent: string;
  result: 'W' | 'L' | 'T';
}

// Lab shell types
export type ComponentState = 'default' | 'loading' | 'empty' | 'error';

export interface LabComponentSpec {
  id: string;
  label: string;
  description: string;
  variants?: { id: string; label: string }[];
}
