/**
 * src/hooks/useTeamStats.ts
 * ========================================================================
 * ENHANCED TEAM STATS HOOK V2 - With Fixes
 * 
 * Fixes:
 * - pointsAgainst calculated from totalPoints - scoringMargin
 * - Red zone stats properly mapped
 * - Per-game values preserved when available
 * - Rankings captured for all stats
 * 
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import { useState, useEffect } from 'react';

// ========================================================================
// TYPES - ESPN API Response Structures
// ========================================================================

interface ESPNStat {
  name: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  value?: number | string;
  displayValue?: string;
  type?: string;
  perGameValue?: number;
  rank?: number;
  rankDisplayValue?: string;
}

interface ESPNCategory {
  name?: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  stats?: ESPNStat[];
}

interface ESPNSplits {
  id?: string;
  name?: string;
  abbreviation?: string;
  categories?: ESPNCategory[];
}

interface ESPNStatisticsResponse {
  splits?: ESPNSplits;
  team?: {
    id?: string;
    displayName?: string;
    abbreviation?: string;
  };
  season?: {
    year?: number;
    type?: number;
    displayName?: string;
  };
}

// ========================================================================
// TYPES - Enhanced Output Structures
// ========================================================================

export interface StatValue {
  value: number;
  displayValue?: string;
  perGame?: number;
  rank?: number;
  rankDisplay?: string;
}

export interface PassingStats {
  yards: StatValue;
  touchdowns: StatValue;
  interceptions: StatValue;
  completionPercentage: StatValue;
  attempts: StatValue;
  completions: StatValue;
  yardsPerAttempt: StatValue;
  longest: StatValue;
  sacksTaken: StatValue;
  qbRating: StatValue;
}

export interface RushingStats {
  yards: StatValue;
  touchdowns: StatValue;
  attempts: StatValue;
  yardsPerAttempt: StatValue;
  longest: StatValue;
  fumbles: StatValue;
  firstDowns: StatValue;
}

export interface ReceivingStats {
  yards: StatValue;
  touchdowns: StatValue;
  receptions: StatValue;
  targets: StatValue;
  yardsPerReception: StatValue;
  longest: StatValue;
  firstDowns: StatValue;
}

export interface ScoringStats {
  totalPoints: StatValue;
  pointsPerGame: StatValue;
  touchdowns: StatValue;
  fieldGoalsMade: StatValue;
  fieldGoalAttempts: StatValue;
  fieldGoalPercentage: StatValue;
  extraPointsMade: StatValue;
  redZoneTouchdowns: StatValue;
  redZoneAttempts: StatValue;
  redZonePercentage: StatValue;
}

export interface DefensiveStats {
  pointsAllowed: StatValue;
  pointsAllowedPerGame: StatValue;
  yardsAllowed: StatValue;
  yardsAllowedPerGame: StatValue;
  sacks: StatValue;
  interceptions: StatValue;
  fumblesRecovered: StatValue;
  forcedFumbles: StatValue;
  tacklesForLoss: StatValue;
  passesDefended: StatValue;
  safeties: StatValue;
}

export interface TurnoverStats {
  differential: StatValue;
  takeaways: StatValue;
  giveaways: StatValue;
  interceptionsThrown: StatValue;
  interceptionsCaught: StatValue;
  fumblesLost: StatValue;
  fumblesRecovered: StatValue;
}

export interface EfficiencyStats {
  thirdDownConversions: StatValue;
  thirdDownAttempts: StatValue;
  thirdDownPercentage: StatValue;
  fourthDownConversions: StatValue;
  fourthDownAttempts: StatValue;
  fourthDownPercentage: StatValue;
  redZonePercentage: StatValue;
  yardsPerPlay: StatValue;
  timeOfPossession: StatValue;
  firstDowns: StatValue;
  penalties: StatValue;
  penaltyYards: StatValue;
}

export interface SpecialTeamsStats {
  kickReturnYards: StatValue;
  kickReturnAverage: StatValue;
  kickReturnTouchdowns: StatValue;
  puntReturnYards: StatValue;
  puntReturnAverage: StatValue;
  puntReturnTouchdowns: StatValue;
  puntingAverage: StatValue;
  fieldGoalPercentage: StatValue;
}

export interface TeamStats {
  passing: PassingStats;
  rushing: RushingStats;
  receiving: ReceivingStats;
  scoring: ScoringStats;
  defense: DefensiveStats;
  turnovers: TurnoverStats;
  efficiency: EfficiencyStats;
  specialTeams: SpecialTeamsStats;
  
  // Quick access (backward compatible)
  passingYards: number;
  rushingYards: number;
  pointsFor: number;
  pointsAgainst: number;
  totalTurnovers: number;
  thirdDownPercentage: number;
  passingTouchdowns: number;
  rushingTouchdowns: number;
  receivingTouchdowns: number;
  interceptions: number;
  fumblesLost: number;
  sacks: number;
  
  lastUpdated: string;
  source: 'live' | 'fallback';
}

export interface UseTeamStatsReturn {
  stats: TeamStats | null;
  rawCategories: Map<string, ESPNStat[]>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ========================================================================
// CONSTANTS
// ========================================================================

const BEARS_STATS_URL = 
  'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/teams/3/statistics';

const EMPTY_STAT: StatValue = {
  value: 0,
  perGame: 0,
  rank: 32,
};

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

function toNumber(value: number | string | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Find a stat by checking multiple possible names
 */
function findStat(allStats: ESPNStat[], searchTerms: string[]): ESPNStat | undefined {
  for (const term of searchTerms) {
    const lowerTerm = term.toLowerCase();
    const found = allStats.find(s => {
      const name = (s.name || '').toLowerCase();
      const displayName = (s.displayName || '').toLowerCase();
      return name === lowerTerm || displayName === lowerTerm;
    });
    if (found) return found;
  }
  
  // Fallback to partial match
  for (const term of searchTerms) {
    const lowerTerm = term.toLowerCase();
    const found = allStats.find(s => {
      const name = (s.name || '').toLowerCase();
      const displayName = (s.displayName || '').toLowerCase();
      return name.includes(lowerTerm) || displayName.includes(lowerTerm);
    });
    if (found) return found;
  }
  
  return undefined;
}

function extractStatValue(stat: ESPNStat | undefined): StatValue {
  if (!stat) return EMPTY_STAT;
  
  return {
    value: toNumber(stat.value),
    displayValue: stat.displayValue,
    perGame: stat.perGameValue,
    rank: stat.rank,
    rankDisplay: stat.rankDisplayValue || (stat.rank ? `#${stat.rank}` : undefined),
  };
}

function flattenStats(categories: ESPNCategory[]): ESPNStat[] {
  const allStats: ESPNStat[] = [];
  for (const cat of categories) {
    if (Array.isArray(cat.stats)) {
      allStats.push(...cat.stats);
    }
  }
  return allStats;
}

function organizeByCategory(categories: ESPNCategory[]): Map<string, ESPNStat[]> {
  const map = new Map<string, ESPNStat[]>();
  for (const cat of categories) {
    const name = cat.displayName || cat.name || 'unknown';
    map.set(name, cat.stats || []);
  }
  return map;
}

// ========================================================================
// PARSING FUNCTIONS
// ========================================================================

function parsePassingStats(allStats: ESPNStat[]): PassingStats {
  return {
    yards: extractStatValue(findStat(allStats, ['netPassingYards', 'passingYards', 'netPassingYardsPerGame'])),
    touchdowns: extractStatValue(findStat(allStats, ['passingTouchdowns'])),
    interceptions: extractStatValue(findStat(allStats, ['interceptions'])),
    completionPercentage: extractStatValue(findStat(allStats, ['completionPct', 'completionPercentage'])),
    attempts: extractStatValue(findStat(allStats, ['passingAttempts'])),
    completions: extractStatValue(findStat(allStats, ['completions'])),
    yardsPerAttempt: extractStatValue(findStat(allStats, ['yardsPerPassAttempt'])),
    longest: extractStatValue(findStat(allStats, ['longPassing'])),
    sacksTaken: extractStatValue(findStat(allStats, ['sacks', 'sackYardsLost'])),
    qbRating: extractStatValue(findStat(allStats, ['QBRating', 'passerRating', 'teamQBRating'])),
  };
}

function parseRushingStats(allStats: ESPNStat[]): RushingStats {
  return {
    yards: extractStatValue(findStat(allStats, ['rushingYards'])),
    touchdowns: extractStatValue(findStat(allStats, ['rushingTouchdowns'])),
    attempts: extractStatValue(findStat(allStats, ['rushingAttempts'])),
    yardsPerAttempt: extractStatValue(findStat(allStats, ['yardsPerRushAttempt'])),
    longest: extractStatValue(findStat(allStats, ['longRushing'])),
    fumbles: extractStatValue(findStat(allStats, ['fumbles', 'totalFumbles'])),
    firstDowns: extractStatValue(findStat(allStats, ['rushingFirstDowns'])),
  };
}

function parseReceivingStats(allStats: ESPNStat[]): ReceivingStats {
  return {
    yards: extractStatValue(findStat(allStats, ['receivingYards', 'netReceivingYards'])),
    touchdowns: extractStatValue(findStat(allStats, ['receivingTouchdowns'])),
    receptions: extractStatValue(findStat(allStats, ['receptions', 'totalReceptions'])),
    targets: extractStatValue(findStat(allStats, ['receivingTargets'])),
    yardsPerReception: extractStatValue(findStat(allStats, ['yardsPerReception'])),
    longest: extractStatValue(findStat(allStats, ['longReception'])),
    firstDowns: extractStatValue(findStat(allStats, ['receivingFirstDowns'])),
  };
}

function parseScoringStats(allStats: ESPNStat[]): ScoringStats {
  // Red zone stats - try multiple possible field names
  const redZoneTDs = extractStatValue(findStat(allStats, [
    'redZoneTouchdowns', 
    'redzoneTouchdowns', 
    'redZoneScoringTouchdowns',
    'redzoneScoring'
  ]));
  
  const redZoneAttempts = extractStatValue(findStat(allStats, [
    'redZoneAttempts', 
    'redzoneAttempts', 
    'redZoneScoringAttempts',
    'redZoneOpportunities'
  ]));
  
  const redZonePct = extractStatValue(findStat(allStats, [
    'redZoneScoringPct', 
    'redzoneScoringPct', 
    'redZoneEfficiency',
    'redZonePct'
  ]));

  return {
    totalPoints: extractStatValue(findStat(allStats, ['totalPoints', 'pointsFor'])),
    pointsPerGame: extractStatValue(findStat(allStats, ['totalPointsPerGame', 'pointsPerGame'])),
    touchdowns: extractStatValue(findStat(allStats, ['totalTouchdowns'])),
    fieldGoalsMade: extractStatValue(findStat(allStats, ['fieldGoalsMade'])),
    fieldGoalAttempts: extractStatValue(findStat(allStats, ['fieldGoalAttempts'])),
    fieldGoalPercentage: extractStatValue(findStat(allStats, ['fieldGoalPct'])),
    extraPointsMade: extractStatValue(findStat(allStats, ['extraPointsMade'])),
    redZoneTouchdowns: redZoneTDs,
    redZoneAttempts: redZoneAttempts,
    redZonePercentage: redZonePct,
  };
}

function parseDefensiveStats(allStats: ESPNStat[]): DefensiveStats {
  // ========================================================================
  // FIX: Calculate pointsAllowed from totalPoints - scoringMargin
  // ========================================================================
  const totalPointsStat = findStat(allStats, ['totalPoints', 'pointsFor']);
  const scoringMarginStat = findStat(allStats, ['scoringMargin', 'pointDifferential']);
  
  // Try direct lookup first
  const pointsAllowedStat = findStat(allStats, [
    'pointsAgainst', 
    'pointsAllowed', 
    'opponentPoints',
    'defensivePointsAllowed'
  ]);
  
  // If not found, calculate from totalPoints - scoringMargin
  let pointsAllowed: StatValue;
  if (pointsAllowedStat && toNumber(pointsAllowedStat.value) > 0) {
    pointsAllowed = extractStatValue(pointsAllowedStat);
  } else if (totalPointsStat && scoringMarginStat) {
    const pointsFor = toNumber(totalPointsStat.value);
    const margin = toNumber(scoringMarginStat.value);
    const calculatedPointsAgainst = pointsFor - margin;
    
    console.log('%c🔧 Calculating Points Allowed:', 'color: orange; font-weight: bold;');
    console.log(`   Points For: ${pointsFor}`);
    console.log(`   Scoring Margin: ${margin}`);
    console.log(`   Points Allowed: ${calculatedPointsAgainst}`);
    
    pointsAllowed = {
      value: calculatedPointsAgainst,
      perGame: calculatedPointsAgainst / 17, // Approximate
      rank: undefined, // Can't calculate rank
    };
  } else {
    pointsAllowed = EMPTY_STAT;
  }
  
  return {
    pointsAllowed,
    pointsAllowedPerGame: extractStatValue(findStat(allStats, ['pointsAgainstPerGame'])),
    yardsAllowed: extractStatValue(findStat(allStats, ['totalYardsAgainst', 'yardsAllowed'])),
    yardsAllowedPerGame: extractStatValue(findStat(allStats, ['yardsAgainstPerGame'])),
    sacks: extractStatValue(findStat(allStats, ['sacks', 'defensiveSacks', 'totalSacks'])),
    interceptions: extractStatValue(findStat(allStats, [
      'defensiveInterceptions', 
      'interceptionsTaken',
      'totalInterceptions'
    ])),
    fumblesRecovered: extractStatValue(findStat(allStats, ['fumblesRecovered'])),
    forcedFumbles: extractStatValue(findStat(allStats, ['fumblesForced', 'forcedFumbles'])),
    tacklesForLoss: extractStatValue(findStat(allStats, ['tacklesForLoss', 'TFL'])),
    passesDefended: extractStatValue(findStat(allStats, ['passesDefended', 'passDefended'])),
    safeties: extractStatValue(findStat(allStats, ['safeties'])),
  };
}

function parseTurnoverStats(allStats: ESPNStat[]): TurnoverStats {
  return {
    differential: extractStatValue(findStat(allStats, ['turnoverDifferential', 'turnoverMargin'])),
    takeaways: extractStatValue(findStat(allStats, ['totalTakeaways', 'takeaways'])),
    giveaways: extractStatValue(findStat(allStats, ['totalGiveaways', 'giveaways'])),
    interceptionsThrown: extractStatValue(findStat(allStats, ['interceptions', 'interceptionsThrown'])),
    interceptionsCaught: extractStatValue(findStat(allStats, ['defensiveInterceptions'])),
    fumblesLost: extractStatValue(findStat(allStats, ['fumblesLost'])),
    fumblesRecovered: extractStatValue(findStat(allStats, ['fumblesRecovered'])),
  };
}

function parseEfficiencyStats(allStats: ESPNStat[]): EfficiencyStats {
  return {
    thirdDownConversions: extractStatValue(findStat(allStats, ['thirdDownConvs', 'thirdDownConversions'])),
    thirdDownAttempts: extractStatValue(findStat(allStats, ['thirdDownAttempts'])),
    thirdDownPercentage: extractStatValue(findStat(allStats, ['thirdDownConvPct', 'thirdDownPct'])),
    fourthDownConversions: extractStatValue(findStat(allStats, ['fourthDownConvs'])),
    fourthDownAttempts: extractStatValue(findStat(allStats, ['fourthDownAttempts'])),
    fourthDownPercentage: extractStatValue(findStat(allStats, ['fourthDownConvPct'])),
    redZonePercentage: extractStatValue(findStat(allStats, ['redZoneScoringPct'])),
    yardsPerPlay: extractStatValue(findStat(allStats, ['yardsPerPlay'])),
    timeOfPossession: extractStatValue(findStat(allStats, ['possessionTime', 'avgTimeOfPossession'])),
    firstDowns: extractStatValue(findStat(allStats, ['firstDowns', 'totalFirstDowns'])),
    penalties: extractStatValue(findStat(allStats, ['penalties', 'totalPenalties'])),
    penaltyYards: extractStatValue(findStat(allStats, ['penaltyYards', 'totalPenaltyYards'])),
  };
}

function parseSpecialTeamsStats(allStats: ESPNStat[]): SpecialTeamsStats {
  return {
    kickReturnYards: extractStatValue(findStat(allStats, ['kickReturnYards'])),
    kickReturnAverage: extractStatValue(findStat(allStats, ['yardsPerKickReturn'])),
    kickReturnTouchdowns: extractStatValue(findStat(allStats, ['kickReturnTouchdowns'])),
    puntReturnYards: extractStatValue(findStat(allStats, ['puntReturnYards'])),
    puntReturnAverage: extractStatValue(findStat(allStats, ['yardsPerPuntReturn'])),
    puntReturnTouchdowns: extractStatValue(findStat(allStats, ['puntReturnTouchdowns'])),
    puntingAverage: extractStatValue(findStat(allStats, ['grossAvgPuntYards'])),
    fieldGoalPercentage: extractStatValue(findStat(allStats, ['fieldGoalPct'])),
  };
}

// ========================================================================
// MAIN HOOK
// ========================================================================

export function useTeamStats(): UseTeamStatsReturn {
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [rawCategories, setRawCategories] = useState<Map<string, ESPNStat[]>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      console.log('%c🏈 Fetching Enhanced Team Stats', 'color: #C83803; font-weight: bold; font-size: 14px;');

      const response = await fetch(BEARS_STATS_URL);
      
      if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status}`);
      }

      const data: ESPNStatisticsResponse = await response.json();
      const categories = data.splits?.categories || [];
      
      const categoryMap = organizeByCategory(categories);
      setRawCategories(categoryMap);
      
      // Log all stats for debugging
      console.log('%c📊 Available Categories:', 'color: blue; font-weight: bold;');
      categoryMap.forEach((catStats, name) => {
        console.log(`%c  📂 ${name}: ${catStats.length} stats`, 'color: purple;');
      });

      const allStats = flattenStats(categories);
      
      const passing = parsePassingStats(allStats);
      const rushing = parseRushingStats(allStats);
      const receiving = parseReceivingStats(allStats);
      const scoring = parseScoringStats(allStats);
      const defense = parseDefensiveStats(allStats);
      const turnovers = parseTurnoverStats(allStats);
      const efficiency = parseEfficiencyStats(allStats);
      const specialTeams = parseSpecialTeamsStats(allStats);

      const teamStats: TeamStats = {
        passing,
        rushing,
        receiving,
        scoring,
        defense,
        turnovers,
        efficiency,
        specialTeams,
        
        // Quick access
        passingYards: passing.yards.value,
        rushingYards: rushing.yards.value,
        pointsFor: scoring.totalPoints.value,
        pointsAgainst: defense.pointsAllowed.value,
        totalTurnovers: turnovers.giveaways.value,
        thirdDownPercentage: efficiency.thirdDownPercentage.value,
        passingTouchdowns: passing.touchdowns.value,
        rushingTouchdowns: rushing.touchdowns.value,
        receivingTouchdowns: receiving.touchdowns.value,
        interceptions: turnovers.interceptionsThrown.value,
        fumblesLost: turnovers.fumblesLost.value,
        sacks: defense.sacks.value,
        
        lastUpdated: new Date().toISOString(),
        source: 'live',
      };

      setStats(teamStats);
      console.log('%c✅ Stats parsed successfully', 'color: green; font-weight: bold;');
      console.log('Points Allowed:', teamStats.pointsAgainst);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('%c❌ Stats fetch error:', 'color: red; font-weight: bold;', errorMsg);
      setError(errorMsg);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, []);

  return {
    stats,
    rawCategories,
    loading,
    error,
    refetch: fetchStats,
  };
}

export default useTeamStats;