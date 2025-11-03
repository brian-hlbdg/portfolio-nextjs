'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BearsSeasonStats,
  BearsGame,
  BearsPlayerStats,
  BearsDashboardState,
} from '@/components/features/types/bears.types';

const ESPN_NFL_SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

interface ESPNCompetitor {
  homeAway: string;
  team?: {
    displayName?: string;
    logo?: string;
  };
  score?: number;
  records?: Array<{
    wins?: number;
    losses?: number;
    ties?: number;
    winpct?: number;
    pointsfor?: number;
    pointsagainst?: number;
  }>;
}

interface UseBearsStatsReturn extends BearsDashboardState {
  refetch: () => Promise<void>;
}

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

  const fetchSeasonStats = useCallback(
    async (): Promise<BearsSeasonStats | null> => {
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

        for (const event of events) {
          const competitors = event.competitions?.[0]?.competitors || [];

          for (const competitor of competitors) {
            const displayName = competitor.team?.displayName || '';

            if (displayName.includes('Bears')) {
              const record = competitor.records?.[0];

              if (record) {
                return {
                  wins: record.wins || 0,
                  losses: record.losses || 0,
                  ties: record.ties || 0,
                  winPercentage: record.winpct || 0,
                  pointsFor: record.pointsfor || 0,
                  pointsAgainst: record.pointsagainst || 0,
                  record: `${record.wins || 0}-${record.losses || 0}${
                    record.ties ? `-${record.ties}` : ''
                  }`,
                };
              }
            }
          }
        }

        return null;
      } catch (error) {
        console.error('Error fetching Bears season stats:', error);
        return null;
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
      const [seasonStats, gameData, playerStats] = await Promise.all([
        fetchSeasonStats(),
        fetchBearsGames(),
        fetchPlayerStats(),
      ]);

      setState({
        seasonStats: seasonStats,
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
  };
}