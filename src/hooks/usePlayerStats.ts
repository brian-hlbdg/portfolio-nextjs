'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PlayerStat {
  id: string;
  name: string;
  position: string;
  number: string;
  stat1Name: string;
  stat1Value: number | string;
  stat2Name: string;
  stat2Value: number | string;
  stat3Name?: string;
  stat3Value?: number | string;
  imageUrl?: string;
}

export interface PlayerStatsData {
  players: PlayerStat[];
  sport: string;
  statLabels: {
    stat1: string;
    stat2: string;
    stat3?: string;
  };
}

export function usePlayerStats(teamId: string, sport: string) {
  const [playerData, setPlayerData] = useState<PlayerStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const mockPlayers: Record<string, PlayerStatsData> = {
        'bears-NFL': {
          sport: 'NFL',
          statLabels: {
            stat1: 'Pass Yards',
            stat2: 'TDs',
            stat3: 'Completion %',
          },
          players: [
            {
              id: '1',
              name: 'Caleb Williams',
              position: 'QB',
              number: '18',
              stat1Name: 'Pass Yards',
              stat1Value: 2847,
              stat2Name: 'TDs',
              stat2Value: 18,
              stat3Name: 'Completion %',
              stat3Value: '68.2%',
            },
          ],
        },
      };

      const key = `${teamId}-${sport}`;
      const data = mockPlayers[key];

      if (data) {
        setPlayerData(data);
      } else {
        setError('Player data not available for this team');
      }
    } catch (err) {
      setError('Failed to fetch player stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [teamId, sport]);

  useEffect(() => {
    fetchPlayerStats();
  }, [fetchPlayerStats]);

  return { playerData, loading, error, refetch: fetchPlayerStats };
}