/**
 * src/hooks/useTeamStats_DEBUG.ts
 * ========================================================================
 * DEBUG VERSION - Fully Typed TypeScript with comprehensive logging
 * 
 * Logs all ESPN statistics to console to identify exact field names
 */

'use client';

import { useState, useEffect } from 'react';

// ========================================================================
// TYPES - Strict TypeScript (NO ANY)
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
  };
  season?: {
    year?: number;
    type?: number;
  };
}

export interface TeamStats {
  passingYards: number;
  rushingYards: number;
  pointsFor: number;
  pointsAgainst: number;
  turnovers: number;
  thirdDownConversions: number;
  thirdDownAttempts: number;
  thirdDownPercentage: number;
  sacks: number;
}

interface UseTeamStatsReturn {
  stats: TeamStats | null;
  loading: boolean;
  error: string | null;
}

// ========================================================================
// CONSTANTS
// ========================================================================

const EMPTY_STATS: TeamStats = {
  passingYards: 0,
  rushingYards: 0,
  pointsFor: 0,
  pointsAgainst: 0,
  turnovers: 0,
  thirdDownConversions: 0,
  thirdDownAttempts: 0,
  thirdDownPercentage: 0,
  sacks: 0,
};

// ========================================================================
// HELPER FUNCTIONS - Strictly Typed
// ========================================================================

function toNumber(value: number | string | undefined): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Log all stats found in a flat array
 */
function logAllStats(stats: ESPNStat[]): void {
  console.log('%c📊 ALL AVAILABLE STATS:', 'color: blue; font-weight: bold; font-size: 14px;');
  
  for (const stat of stats) {
    const value = toNumber(stat.value);
    console.log(
      `%c  • ${stat.name} = ${value}`,
      'color: gray; font-size: 12px;'
    );
    if (stat.displayName) {
      console.log(
        `%c    (displayName: ${stat.displayName})`,
        'color: lightgray; font-size: 11px;'
      );
    }
  }
}

/**
 * Find a stat by checking multiple possible names
 */
function findStat(
  stats: ESPNStat[],
  possibleNames: string[]
): { found: boolean; value: number; actualName: string } {
  for (const fieldName of possibleNames) {
    const lowerFieldName = fieldName.toLowerCase();
    
    const found = stats.find((stat: ESPNStat): boolean => {
      const statName = (stat.name || '').toLowerCase();
      const displayName = (stat.displayName || '').toLowerCase();
      
      return statName.includes(lowerFieldName) || displayName.includes(lowerFieldName);
    });
    
    if (found) {
      const value = toNumber(found.value);
      return {
        found: true,
        value,
        actualName: found.name,
      };
    }
  }
  
  return {
    found: false,
    value: 0,
    actualName: 'NOT_FOUND',
  };
}

/**
 * Log search results for a field
 */
function logSearch(
  searchName: string,
  result: { found: boolean; value: number; actualName: string }
): void {
  if (result.found) {
    console.log(
      `%c✅ ${searchName}: ${result.value} (actual field: "${result.actualName}")`,
      'color: green; font-weight: bold;'
    );
  } else {
    console.log(
      `%c❌ ${searchName}: NOT FOUND`,
      'color: red; font-weight: bold;'
    );
  }
}

/**
 * Extract all stats from categories into flat array
 */
function flattenStats(categories: ESPNCategory[]): ESPNStat[] {
  const allStats: ESPNStat[] = [];
  
  for (const category of categories) {
    console.log(
      `%c📂 Category: ${category.name || 'unknown'}`,
      'color: purple; font-size: 12px;'
    );
    
    if (Array.isArray(category.stats)) {
      allStats.push(...category.stats);
    }
  }
  
  return allStats;
}

/**
 * Calculate percentage safely
 */
function calculatePercentage(made: number, attempted: number): number {
  if (attempted === 0) {
    return 0;
  }
  return Math.round((made / attempted) * 100);
}

/**
 * Parse statistics response with full logging
 */
function parseStatisticsWithLogging(data: ESPNStatisticsResponse): TeamStats {
  try {
    console.log(
      '%c========== STATISTICS PARSING ==========',
      'color: blue; font-weight: bold; font-size: 14px;'
    );
    
    const splits = data.splits;

    if (!splits || !Array.isArray(splits.categories)) {
      console.warn('⚠️ No categories found in statistics response');
      return EMPTY_STATS;
    }

    console.log(
      `%c📦 Found ${splits.categories.length} categories`,
      'color: blue; font-size: 12px;'
    );

    // Flatten all stats
    const allStats = flattenStats(splits.categories);
    
    console.log(
      `%c📋 Total stats found: ${allStats.length}`,
      'color: blue; font-size: 12px;'
    );

    // Log all available stats
    logAllStats(allStats);

    // Search for each field we need
    console.log(
      '%c🔍 SEARCHING FOR REQUIRED FIELDS:',
      'color: orange; font-weight: bold; font-size: 12px;'
    );

    const passingResult = findStat(allStats, ['passingyards']);
    logSearch('Passing Yards', passingResult);

    const rushingResult = findStat(allStats, ['rushingyards']);
    logSearch('Rushing Yards', rushingResult);

    const turnoversResult = findStat(allStats, ['totalgiveaways', 'turnovers']);
    logSearch('Turnovers', turnoversResult);

    const thirdDownConvsResult = findStat(allStats, [
      'thirddownconvs',
      'thirddownconversions',
    ]);
    logSearch('3rd Down Conversions', thirdDownConvsResult);

    const thirdDownAttemptsResult = findStat(allStats, ['thirddownattempts']);
    logSearch('3rd Down Attempts', thirdDownAttemptsResult);

    // ⚠️ KEY ISSUE: Search for points in statistics endpoint
    const pointsForResult = findStat(allStats, [
      'totalpoints',
      'pointsfor',
      'points for',
      'scoringoffense',
    ]);
    logSearch('Points For (Scoring Offense)', pointsForResult);

    const pointsAgainstResult = findStat(allStats, [
      'pointsallowed',
      'pointsagainst',
      'points against',
      'scoringdefense',
      'defensivepoints',
    ]);
    logSearch('Points Against (Scoring Defense)', pointsAgainstResult);

    // Construct final stats
    const thirdDownPercentage = calculatePercentage(
      thirdDownConvsResult.value,
      thirdDownAttemptsResult.value
    );

    const finalStats: TeamStats = {
      passingYards: passingResult.value,
      rushingYards: rushingResult.value,
      pointsFor: pointsForResult.value,
      pointsAgainst: pointsAgainstResult.value,
      turnovers: turnoversResult.value,
      thirdDownConversions: thirdDownConvsResult.value,
      thirdDownAttempts: thirdDownAttemptsResult.value,
      thirdDownPercentage,
      sacks: findStat(allStats, ['sacks']).value,
    };

    console.log(
      '%c========== FINAL PARSED STATS ==========',
      'color: green; font-weight: bold; font-size: 14px;'
    );
    console.log('%cFinal TeamStats object:', 'color: green; font-weight: bold;');
    console.table(finalStats);

    return finalStats;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
    console.error('❌ Error parsing statistics:', errorMsg);
    return EMPTY_STATS;
  }
}

// ========================================================================
// MAIN HOOK
// ========================================================================

export function useTeamStats(): UseTeamStatsReturn {
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamStats = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          '%c🏈 STARTING TEAM STATS FETCH',
          'color: blue; font-weight: bold; font-size: 16px;'
        );

        const statsUrl =
          'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/teams/3/statistics';

        console.log(`%c📡 Fetching from: ${statsUrl}`, 'color: blue; font-size: 11px;');

        const statsResponse = await fetch(statsUrl);

        if (!statsResponse.ok) {
          throw new Error(`Statistics API error: ${statsResponse.status}`);
        }

        const statsData: ESPNStatisticsResponse = await statsResponse.json();

        console.log(
          '%c📦 Raw ESPN Response:',
          'color: blue; font-weight: bold; font-size: 12px;'
        );
        console.log(JSON.stringify(statsData, null, 2));

        // Parse with comprehensive logging
        const finalStats = parseStatisticsWithLogging(statsData);

        setStats(finalStats);

        console.log(
          '%c✅ Stats loading complete',
          'color: green; font-weight: bold; font-size: 12px;'
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error(
          '%c❌ Error in useTeamStats:',
          'color: red; font-weight: bold; font-size: 12px;',
          errorMessage
        );
        setError(errorMessage);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchTeamStats();
  }, []);

  return { stats, loading, error };
}

export default useTeamStats;

/**
 * ========================================================================
 * HOW TO USE THIS DEBUG VERSION
 * ========================================================================
 * 
 * 1. Replace your useTeamStats.ts with this file
 * 2. Open browser DevTools Console (F12 or Cmd+Option+I)
 * 3. Look for the blue "🏈 STARTING TEAM STATS FETCH" message
 * 4. Scroll through all the logged stats to see EXACT field names
 * 5. Look especially for:
 *    - "Points For (Scoring Offense)" - what is the actual field name?
 *    - "Points Against (Scoring Defense)" - what is the actual field name?
 * 6. Copy/paste the console output
 * 
 * The actual field names will be shown in green (✅) if found
 * or red (❌) if not found
 */