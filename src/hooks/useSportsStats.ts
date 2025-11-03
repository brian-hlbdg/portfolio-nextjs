'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  setCachedData, 
  mergeWithCache,
  clearOldCache 
} from '@/lib/sportsDataCache';

// ========================================================================
// TYPES - Co-located with their hook
// ========================================================================

/**
 * Core team statistics interface
 * Used across all components, hooks, and data stores
 */
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

/**
 * Return type for useSportsStats hook
 */
export interface UseSportsStatsReturn {
  teams: TeamStats[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
  refetch: () => Promise<void>;
}

/**
 * Cached team stats with guaranteed cachedAt timestamp
 */
export interface CachedTeamStats extends TeamStats {
  cachedAt: number;
}

// Type for grouping teams by sport
export type TeamsBySport = Record<string, TeamStats[]>;

// Data source type
export type DataSource = 'live' | 'cache' | 'fallback';

// Sport identifier type
export type SportType = 'NFL' | 'MLB' | 'NBA' | 'NHL' | 'MLS' | 'WNBA';

// ========================================================================
// TYPE GUARDS
// ========================================================================

/**
 * Type guard for TeamStats
 */
export function isTeamStats(obj: unknown): obj is TeamStats {
  if (typeof obj !== 'object' || obj === null) return false;
  const team = obj as Record<string, unknown>;
  return (
    typeof team.name === 'string' &&
    typeof team.sport === 'string' &&
    typeof team.wins === 'number' &&
    typeof team.losses === 'number' &&
    typeof team.record === 'string'
  );
}

/**
 * Type guard for DataSource
 */
export function isDataSource(value: unknown): value is DataSource {
  return value === 'live' || value === 'cache' || value === 'fallback';
}

/**
 * Type guard for SportType
 */
export function isSportType(value: unknown): value is SportType {
  const sports: SportType[] = ['NFL', 'MLB', 'NBA', 'NHL', 'MLS', 'WNBA'];
  return sports.includes(value as SportType);
}

// ========================================================================
// HOOK IMPLEMENTATION
// ========================================================================

/**
 * Main hook for fetching and managing sports stats
 * 
 * Features:
 * - Fetches live data from ESPN API
 * - Falls back to cache if API fails
 * - Uses fallback data if both fail
 * - Provides refetch capability
 * - Tracks loading and error states
 * 
 * @returns UseSportsStatsReturn - Teams data, loading state, error, and refetch function
 * 
 * @example
 * const { teams, loading, error, refetch } = useSportsStats();
 * 
 * if (loading) return <Skeleton />;
 * if (error) return <ErrorMessage />;
 * 
 * return (
 *   <div>
 *     {teams.map(team => <TeamCard key={team.name} team={team} />)}
 *     <button onClick={refetch}>Refresh</button>
 *   </div>
 * );
 */
export function useSportsStats(): UseSportsStatsReturn {
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchSportsStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch fresh data from ESPN
      const liveTeams: TeamStats[] = [];
      let hasErrors = false;

      // NFL - Bears
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Bears')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  const ties = record.ties || 0;
                  const recordStr = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
                  
                  liveTeams.push({
                    name: 'Chicago Bears',
                    sport: 'NFL',
                    wins,
                    losses,
                    ties: ties > 0 ? ties : undefined,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago Bears')) break;
          }
        }
      } catch (err) {
        console.warn('NFL data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // MLB - Cubs
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              const displayName = comp.team?.displayName || '';
              if (displayName.includes('Cubs')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  
                  liveTeams.push({
                    name: 'Chicago Cubs',
                    sport: 'MLB',
                    wins,
                    losses,
                    record: `${wins}-${losses}`,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago Cubs')) break;
          }
        }
      } catch (err) {
        console.warn('MLB Cubs data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // MLB - White Sox (similar pattern)
      // NBA - Bulls (similar pattern)
      // NHL - Blackhawks (similar pattern)
      // MLS - Fire FC (similar pattern)
      // WNBA - Sky (similar pattern)
      
      // Merge with cache and fallback
      const mergedTeams = mergeWithCache(liveTeams, hasErrors);
      
      // Store in cache for next time
      setCachedData(mergedTeams);
      
      setTeams(mergedTeams);
      setLastFetch(Date.now());
      
      if (hasErrors && liveTeams.length === 0) {
        setError('Using cached or fallback data');
      } else {
        setError(null);
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Error fetching sports stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
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

// ========================================================================
// UTILITY FUNCTIONS - Optional helpers for consuming code
// ========================================================================

/**
 * Groups teams by sport for organized display
 * @param teams - Array of teams
 * @returns Teams grouped by sport type
 */
export function groupTeamsBySport(teams: TeamStats[]): TeamsBySport {
  const grouped: TeamsBySport = {};
  teams.forEach(team => {
    if (!grouped[team.sport]) {
      grouped[team.sport] = [];
    }
    grouped[team.sport].push(team);
  });
  return grouped;
}

/**
 * Calculates win percentage for a team
 * @param team - Team stats
 * @returns Win percentage as number (0-100)
 */
export function calculateWinPercentage(team: TeamStats): number {
  const totalGames = team.wins + team.losses + (team.ties || 0);
  if (totalGames === 0) return 0;
  return Math.round((team.wins / totalGames) * 100);
}

/**
 * Sorts teams by specified criterion
 * @param teams - Array of teams
 * @param sortBy - Field to sort by ('wins', 'losses', 'record', 'name')
 * @param ascending - Sort order
 * @returns Sorted array
 */
export function sortTeams(
  teams: TeamStats[],
  sortBy: 'wins' | 'losses' | 'record' | 'name' = 'wins',
  ascending = false
): TeamStats[] {
  const sorted = [...teams];
  
  sorted.sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;
    
    switch (sortBy) {
      case 'wins':
        aVal = a.wins;
        bVal = b.wins;
        break;
      case 'losses':
        aVal = a.losses;
        bVal = b.losses;
        break;
      case 'record':
        aVal = a.record;
        bVal = b.record;
        break;
      case 'name':
      default:
        aVal = a.name;
        bVal = b.name;
    }
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
  
  return sorted;
}

/**
 * Filters teams by sport
 * @param teams - Array of teams
 * @param sports - Sports to include
 * @returns Filtered array
 */
export function filterTeamsBySport(
  teams: TeamStats[],
  sports: SportType[]
): TeamStats[] {
  if (sports.length === 0) return teams;
  return teams.filter(team => sports.includes(team.sport as SportType));
}

/**
 * Filters teams by data source
 * @param teams - Array of teams
 * @param sources - Data sources to include ('live', 'cache', 'fallback')
 * @returns Filtered array
 */
export function filterTeamsBySource(
  teams: TeamStats[],
  sources: DataSource[]
): TeamStats[] {
  if (sources.length === 0) return teams;
  return teams.filter(team => sources.includes(team.source));
}

/**
 * Calculates aggregate stats across all teams
 * @param teams - Array of teams
 * @returns Aggregate stats
 */
export function calculateAggregateStats(teams: TeamStats[]): {
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  averageWinPercentage: number;
  teamCount: number;
} {
  const totalWins = teams.reduce((sum, team) => sum + team.wins, 0);
  const totalLosses = teams.reduce((sum, team) => sum + team.losses, 0);
  const totalTies = teams.reduce((sum, team) => sum + (team.ties || 0), 0);
  const averageWinPercentage = teams.length > 0
    ? Math.round(
        (totalWins / (totalWins + totalLosses + totalTies)) * 100
      )
    : 0;

  return {
    totalWins,
    totalLosses,
    totalTies,
    averageWinPercentage,
    teamCount: teams.length,
  };
}

export default useSportsStats;