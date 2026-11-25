// FIXTURE DATA — Not real NFL statistics.
// These values are invented for visualization prototyping only.
// Do not display as actual player or team statistics.

import type {
  LabPlayer,
  LabPassingStats,
  LabRushingStats,
  LabReceivingStats,
  LabThirdDownEntry,
  LabPassTarget,
  LabTrendPoint,
} from './types';

export const FIXTURE_DISCLAIMER = 'FIXTURE DATA — Not real NFL statistics';

// Players
export const fixtureQB: LabPlayer = {
  id: 'fx-qb-1',
  name: 'Caleb Williams',
  firstName: 'Caleb',
  lastName: 'Williams',
  number: 18,
  position: 'QB',
  experience: 1,
  college: 'USC',
  heightInches: 74,
  weightLbs: 215,
  age: 23,
};

export const fixtureRB: LabPlayer = {
  id: 'fx-rb-1',
  name: "D'Andre Swift",
  firstName: "D'Andre",
  lastName: 'Swift',
  number: 29,
  position: 'RB',
  experience: 5,
  college: 'Georgia',
  heightInches: 68,
  weightLbs: 212,
  age: 25,
};

export const fixtureWR: LabPlayer = {
  id: 'fx-wr-1',
  name: 'Rome Odunze',
  firstName: 'Rome',
  lastName: 'Odunze',
  number: 15,
  position: 'WR',
  experience: 1,
  college: 'Washington',
  heightInches: 75,
  weightLbs: 215,
  age: 22,
};

// Stats
export const fixturePassingStats: LabPassingStats = {
  attempts: 487,
  completions: 316,
  yards: 3821,
  touchdowns: 23,
  interceptions: 11,
  rating: 94.2,
  yardsPerAttempt: 7.8,
  completionPct: 64.9,
};

export const fixtureRushingStats: LabRushingStats = {
  attempts: 228,
  yards: 1043,
  touchdowns: 9,
  yardsPerCarry: 4.6,
  longRun: 54,
};

export const fixtureReceivingStats: LabReceivingStats = {
  targets: 142,
  receptions: 94,
  yards: 1247,
  touchdowns: 8,
  yardsPerCatch: 13.3,
  catchPct: 66.2,
};

// 3rd down conversion rates by distance
export const fixtureThirdDownMatrix: LabThirdDownEntry[] = [
  { distance: 1,  conversions: 18, attempts: 22, rate: 0.818 },
  { distance: 2,  conversions: 14, attempts: 20, rate: 0.700 },
  { distance: 3,  conversions: 16, attempts: 24, rate: 0.667 },
  { distance: 4,  conversions: 12, attempts: 22, rate: 0.545 },
  { distance: 5,  conversions: 11, attempts: 24, rate: 0.458 },
  { distance: 6,  conversions:  9, attempts: 22, rate: 0.409 },
  { distance: 7,  conversions:  8, attempts: 20, rate: 0.400 },
  { distance: 8,  conversions:  6, attempts: 18, rate: 0.333 },
  { distance: 9,  conversions:  4, attempts: 16, rate: 0.250 },
  { distance: 10, conversions:  3, attempts: 14, rate: 0.214 },
];

// Pass target scatter — field coords: x=0 near sideline, y=100 at offense's LOS
export const fixturePassTargets: LabPassTarget[] = [
  // Short (behind/at LOS)
  { x: 48, y: 88, outcome: 'complete', yards: 4 },
  { x: 53, y: 85, outcome: 'complete', yards: 6 },
  { x: 35, y: 82, outcome: 'complete', yards: 8 },
  { x: 65, y: 80, outcome: 'complete', yards: 7 },
  { x: 42, y: 78, outcome: 'incomplete' },
  { x: 58, y: 76, outcome: 'complete', yards: 5 },
  { x: 50, y: 74, outcome: 'complete', yards: 9 },
  { x: 28, y: 83, outcome: 'incomplete' },
  { x: 72, y: 81, outcome: 'complete', yards: 6 },
  // Mid-range
  { x: 30, y: 62, outcome: 'complete', yards: 15, route: 'Out' },
  { x: 70, y: 60, outcome: 'complete', yards: 17, route: 'Out' },
  { x: 45, y: 57, outcome: 'incomplete' },
  { x: 55, y: 55, outcome: 'complete', yards: 12 },
  { x: 38, y: 52, outcome: 'incomplete' },
  { x: 62, y: 50, outcome: 'complete', yards: 14 },
  { x: 50, y: 47, outcome: 'touchdown', yards: 22, route: 'Post' },
  { x: 22, y: 60, outcome: 'complete', yards: 11 },
  { x: 78, y: 58, outcome: 'incomplete' },
  // Deep
  { x: 25, y: 32, outcome: 'complete', yards: 38, route: 'Go' },
  { x: 75, y: 30, outcome: 'incomplete' },
  { x: 40, y: 27, outcome: 'touchdown', yards: 45, route: 'Post' },
  { x: 60, y: 24, outcome: 'incomplete' },
  { x: 50, y: 20, outcome: 'interception' },
  { x: 30, y: 17, outcome: 'complete', yards: 52, route: 'Go' },
  { x: 70, y: 14, outcome: 'touchdown', yards: 58, route: 'Go' },
  { x: 15, y: 35, outcome: 'incomplete' },
  { x: 85, y: 33, outcome: 'complete', yards: 36 },
];

// Weekly passer rating trend
export const fixturePerformanceTrend: LabTrendPoint[] = [
  { week:  1, label: 'Wk 1',  value: 71.2, opponent: 'TEN', result: 'W' },
  { week:  2, label: 'Wk 2',  value: 84.5, opponent: 'HOU', result: 'W' },
  { week:  3, label: 'Wk 3',  value: 62.1, opponent: 'IND', result: 'L' },
  { week:  4, label: 'Wk 4',  value: 91.7, opponent: 'LAR', result: 'W' },
  { week:  5, label: 'Wk 5',  value: 78.3, opponent: 'CAR', result: 'W' },
  { week:  6, label: 'Wk 6',  value: 55.9, opponent: 'MIN', result: 'L' },
  { week:  7, label: 'Wk 7',  value: 88.2, opponent: 'JAX', result: 'W' },
  { week:  8, label: 'Wk 8',  value: 94.1, opponent: 'WAS', result: 'W' },
  { week:  9, label: 'Wk 9',  value: 67.4, opponent: 'GB',  result: 'L' },
  { week: 10, label: 'Wk 10', value: 82.8, opponent: 'DET', result: 'W' },
  { week: 11, label: 'Wk 11', value: 75.6, opponent: 'NE',  result: 'W' },
  { week: 12, label: 'Wk 12', value: 90.3, opponent: 'MIN', result: 'W' },
];
