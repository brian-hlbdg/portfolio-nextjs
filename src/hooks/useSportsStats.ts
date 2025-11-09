'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  setCachedData, 
  mergeWithCache,
  clearOldCache 
} from '@/lib/sportsDataCache';

// ========================================================================
// TYPES
// ========================================================================

export interface TeamStats {
  name: string;
  sport: string;
  logo?: string;
  wins: number;
  losses: number;
  ties?: number;
  record: string;
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  cachedAt?: number;
}

export interface UseSportsStatsReturn {
  teams: TeamStats[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
  refetch: () => Promise<void>;
}

// ========================================================================
// CHICAGO TEAMS CONFIGURATION
// ========================================================================

const CHICAGO_TEAMS = [
  { name: 'Chicago Bears', sport: 'NFL', endpoint: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/chi' },
  { name: 'Chicago Cubs', sport: 'MLB', endpoint: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/chc' },
  { name: 'Chicago White Sox', sport: 'MLB', endpoint: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/cws' },
  { name: 'Chicago Bulls', sport: 'NBA', endpoint: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/chi' },
  { name: 'Chicago Blackhawks', sport: 'NHL', endpoint: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams/chi' },
  { name: 'Chicago Sky', sport: 'WNBA', endpoint: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams/chi' },
  { name: 'Chicago Fire FC', sport: 'MLS', endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/teams/chi' },
];

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Extract stats from ESPN stats array
 * @param stats - Array of stat objects from ESPN
 * @returns wins, losses, ties
 */
function extractStats(stats: any[]): { wins: number; losses: number; ties: number } {
  const findStat = (name: string) =>
    stats.find(s => s.name === name)?.value || 0;

  return {
    wins: findStat('wins'),
    losses: findStat('losses'),
    ties: findStat('ties'),
  };
}

/**
 * Format record string
 */
function formatRecord(wins: number, losses: number, ties: number): string {
  return ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
}

/**
 * Fetch single team's stats
 */
async function fetchTeamStats(
  teamName: string,
  sport: string,
  endpoint: string,
  timeoutMs: number = 5000
): Promise<TeamStats | null> {
  try {
    const response = await Promise.race([
      fetch(endpoint),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    ]);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const team = data.team;

    if (!team) {
      console.warn(`Team data not found for ${teamName}`);
      return null;
    }

    // Get the total record (first item should be season total)
    const totalRecord = team.record?.items?.[0];
    if (!totalRecord?.stats) {
      console.warn(`No record data for ${teamName}`);
      return null;
    }

    // Extract stats
    const { wins, losses, ties } = extractStats(totalRecord.stats);
    const recordStr = formatRecord(wins, losses, ties);

    // Get logo (prefer default logo)
    const logo = team.logos?.find((l: any) => l.rel?.includes('default'))?.href 
      || team.logos?.[0]?.href;

    console.log(`✅ ${sport}: ${teamName} fetched successfully - ${recordStr}`);

    return {
      name: teamName,
      sport,
      wins,
      losses,
      ties: ties > 0 ? ties : undefined,
      record: recordStr,
      lastUpdated: new Date().toLocaleDateString(),
      logo,
      source: 'live'
    };
  } catch (err) {
    console.warn(`Failed to fetch ${teamName}:`, err instanceof Error ? err.message : err);
    return null;
  }
}

// ========================================================================
// HOOK
// ========================================================================

export function useSportsStats(): UseSportsStatsReturn {
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchSportsStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching Chicago sports stats...');

      // Fetch all teams in parallel
      const fetchPromises = CHICAGO_TEAMS.map(team =>
        fetchTeamStats(team.name, team.sport, team.endpoint)
      );

      const results = await Promise.allSettled(fetchPromises);

      // Filter out null/failed results
      const liveTeams: TeamStats[] = results
        .map(result => result.status === 'fulfilled' ? result.value : null)
        .filter((team): team is TeamStats => team !== null);

      console.log(`✅ Successfully fetched ${liveTeams.length}/${CHICAGO_TEAMS.length} teams`);

      // If we got some live data, use it. Otherwise use cache/fallback
      const hasErrors = liveTeams.length < CHICAGO_TEAMS.length;
      const mergedTeams = mergeWithCache(liveTeams, hasErrors);
      
      setCachedData(mergedTeams);
      setTeams(mergedTeams);
      setLastFetch(Date.now());

      if (hasErrors && liveTeams.length === 0) {
        setError('Unable to fetch live data, using cached or fallback data');
      } else if (hasErrors) {
        setError(`Fetched ${liveTeams.length}/${CHICAGO_TEAMS.length} teams. Some data may be cached.`);
      } else {
        setError(null);
      }

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error fetching sports stats:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    console.log('🔄 Refetching sports stats...');
    await fetchSportsStats();
  }, [fetchSportsStats]);

  // Fetch on mount
  useEffect(() => {
    fetchSportsStats();
  }, [fetchSportsStats]);

  return {
    teams,
    loading,
    error,
    lastFetch,
    refetch
  };
}

export default useSportsStats;