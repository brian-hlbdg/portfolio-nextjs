'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BearsSeasonStats,
  BearsGame,
  BearsPlayerStats,
  BearsDashboardState,
} from '@/components/features/types/bears.types';

const ESPN_NFL_SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

// ========================================================================
// TYPES
// ========================================================================

interface ESPNCompetitor {
  homeAway: string;
  team?: {
    displayName?: string;
    logo?: string;
  };
  score?: number;
  records?: Array<{
    type?: string;
    summary?: string;
    displayValue?: string;
    wins?: number;
    losses?: number;
    ties?: number;
    winpct?: number;
    pointsfor?: number;
    pointsagainst?: number;
  }>;
}

/**
 * NFL Team Record - exported for use in other components
 */
export interface NFLTeamRecord {
  name: string;
  record: string;
  wins: number;
  losses: number;
  ties: number;
}

// ========================================================================
// EXTENDED RETURN TYPE
// ========================================================================

interface UseBearsStatsReturn extends BearsDashboardState {
  refetch: () => Promise<void>;
  nflTeamRecords: Map<string, NFLTeamRecord>;
}

// ========================================================================
// MAIN HOOK
// ========================================================================

export function useBearsStats(): UseBearsStatsReturn {
  const [state, setState] = useState<BearsDashboardState>({
    seasonStats: null,
    upcomingGames: [],
    recentGames: [],
    playerStats: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  // Store all NFL team records
  const [nflTeamRecords, setNflTeamRecords] = useState<Map<string, NFLTeamRecord>>(
    new Map()
  );

  /**
   * Fetch season stats AND all NFL team records from scoreboard
   * Returns both Bears-specific stats and a map of all team records
   */
  const fetchSeasonStats = useCallback(
    async (): Promise<{
      bearsStats: BearsSeasonStats | null;
      allTeamRecords: Map<string, NFLTeamRecord>;
    }> => {
      const allTeamRecords = new Map<string, NFLTeamRecord>();

      try {
        const response = await Promise.race([
          fetch(ESPN_NFL_SCOREBOARD, {
            headers: { Accept: 'application/json' },
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 8000)
          ),
        ]);

        if (!response.ok) {
          throw new Error(`ESPN API error: ${response.status}`);
        }

        const data = await response.json();
        const events = data.events || [];

        let bearsStats: BearsSeasonStats | null = null;

        // Loop through all events and extract ALL team records
        for (const event of events) {
          const competitors = event.competitions?.[0]?.competitors || [];

          for (const competitor of competitors) {
            const displayName = competitor.team?.displayName || '';
            
            // Find the "total" record (overall season record)
            const totalRecord = competitor.records?.find(
              (r: { type?: string }) => r.type === 'total'
            );

            if (displayName && totalRecord) {
              // Extract wins/losses/ties
              const wins = totalRecord.wins ?? 0;
              const losses = totalRecord.losses ?? 0;
              const ties = totalRecord.ties ?? 0;
              
              // Get record string from displayValue/summary, or construct it
              const recordStr = 
                totalRecord.displayValue || 
                totalRecord.summary || 
                (ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`);

              // Store in map (lowercase key for easy lookup)
              allTeamRecords.set(displayName.toLowerCase(), {
                name: displayName,
                record: recordStr,
                wins,
                losses,
                ties,
              });

              // If this is the Bears, also extract their full stats
              if (displayName.includes('Bears')) {
                bearsStats = {
                  wins,
                  losses,
                  ties,
                  winPercentage: totalRecord.winpct ?? 0,
                  pointsFor: totalRecord.pointsfor ?? 0,
                  pointsAgainst: totalRecord.pointsagainst ?? 0,
                  record: recordStr,
                };
              }
            }
          }
        }

        console.log(`📊 Extracted ${allTeamRecords.size} NFL team records from scoreboard`);
        
        return { bearsStats, allTeamRecords };
      } catch (error) {
        console.error('Error fetching season stats:', error);
        return { bearsStats: null, allTeamRecords };
      }
    },
    []
  );

  const fetchBearsGames = useCallback(
    async (): Promise<{ upcoming: BearsGame[]; recent: BearsGame[] }> => {
      try {
        const response = await Promise.race([
          fetch(ESPN_NFL_SCOREBOARD, {
            headers: { Accept: 'application/json' },
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 8000)
          ),
        ]);

        if (!response.ok) {
          throw new Error(`ESPN API error: ${response.status}`);
        }

        const data = await response.json();
        const events = data.events || [];

        const upcoming: BearsGame[] = [];
        const recent: BearsGame[] = [];

        for (const event of events) {
          const comp = event.competitions?.[0];
          if (!comp) continue;

          const competitors = comp.competitors || [];
          const bearsTeam = competitors.find((c: ESPNCompetitor) =>
            c.team?.displayName?.includes('Bears')
          );

          if (!bearsTeam) continue;

          const homeTeam = competitors.find((c: ESPNCompetitor) => c.homeAway === 'home');
          const awayTeam = competitors.find((c: ESPNCompetitor) => c.homeAway === 'away');

          // Safely get the status
          const statusType = event.status?.type;
          const status = typeof statusType === 'string' ? statusType.toLowerCase() : 'scheduled';

          const game: BearsGame = {
            id: event.id,
            week: comp.week || 0,
            date: event.date,
            opponent: {
              name:
                bearsTeam.homeAway === 'home'
                  ? awayTeam?.team?.displayName || 'Unknown'
                  : homeTeam?.team?.displayName || 'Unknown',
              logo:
                bearsTeam.homeAway === 'home'
                  ? awayTeam?.team?.logo
                  : homeTeam?.team?.logo,
            },
            homeTeam: homeTeam?.team?.displayName || 'Unknown',
            awayTeam: awayTeam?.team?.displayName || 'Unknown',
            homeScore: homeTeam?.score,
            awayScore: awayTeam?.score,
            status: status as 'scheduled' | 'live' | 'final',
            isBearsHome: bearsTeam.homeAway === 'home',
            lastUpdated: new Date().toISOString(),
            source: 'live',
          };

          if (game.status === 'scheduled') {
            upcoming.push(game);
          } else {
            recent.push(game);
          }
        }

        return { upcoming, recent };
      } catch (error) {
        console.error('Error fetching Bears games:', error);
        return { upcoming: [], recent: [] };
      }
    },
    []
  );

  const fetchPlayerStats = useCallback(async (): Promise<BearsPlayerStats[]> => {
    try {
      return [];
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return [];
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [seasonData, gameData, playerStats] = await Promise.all([
        fetchSeasonStats(),
        fetchBearsGames(),
        fetchPlayerStats(),
      ]);

      // Update NFL team records
      setNflTeamRecords(seasonData.allTeamRecords);

      setState({
        seasonStats: seasonData.bearsStats,
        upcomingGames: gameData.upcoming,
        recentGames: gameData.recent,
        playerStats: playerStats,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Bears data';

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        lastUpdated: new Date().toISOString(),
      }));
    }
  }, [fetchSeasonStats, fetchBearsGames, fetchPlayerStats]);

  useEffect(() => {
    fetchAllData();

    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  return {
    ...state,
    refetch: fetchAllData,
    nflTeamRecords,  // NEW: expose all team records
  };
}