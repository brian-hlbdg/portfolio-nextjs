'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetchPlayerStats();
  }, [teamId, sport]);

  const fetchPlayerStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock player data - In production, fetch from ESPN API
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
            {
              id: '2',
              name: 'D\'Andre Swift',
              position: 'RB',
              number: '4',
              stat1Name: 'Rush Yards',
              stat1Value: 892,
              stat2Name: 'TDs',
              stat2Value: 6,
              stat3Name: 'Avg/Carry',
              stat3Value: '4.2',
            },
            {
              id: '3',
              name: 'Rome Odunze',
              position: 'WR',
              number: '15',
              stat1Name: 'Receptions',
              stat1Value: 47,
              stat2Name: 'Rec Yards',
              stat2Value: 523,
              stat3Name: 'TDs',
              stat3Value: 4,
            },
            {
              id: '4',
              name: 'Keenan Allen',
              position: 'WR',
              number: '13',
              stat1Name: 'Receptions',
              stat1Value: 28,
              stat2Name: 'Rec Yards',
              stat2Value: 342,
              stat3Name: 'Avg/Catch',
              stat3Value: '12.2',
            },
            {
              id: '5',
              name: 'Cole Kmet',
              position: 'TE',
              number: '85',
              stat1Name: 'Receptions',
              stat1Value: 32,
              stat2Name: 'Rec Yards',
              stat2Value: 289,
              stat3Name: 'TDs',
              stat3Value: 2,
            },
          ],
        },
        'cubs-MLB': {
          sport: 'MLB',
          statLabels: {
            stat1: 'Avg',
            stat2: 'HR',
            stat3: 'RBIs',
          },
          players: [
            {
              id: '1',
              name: 'Kyle Schwarber',
              position: 'OF',
              number: '12',
              stat1Name: 'Avg',
              stat1Value: '.282',
              stat2Name: 'HR',
              stat2Value: 22,
              stat3Name: 'RBIs',
              stat3Value: 65,
            },
            {
              id: '2',
              name: 'Seiya Suzuki',
              position: 'OF',
              number: '27',
              stat1Name: 'Avg',
              stat1Value: '.271',
              stat2Name: 'HR',
              stat2Value: 18,
              stat3Name: 'RBIs',
              stat3Value: 58,
            },
            {
              id: '3',
              name: 'Cody Bellinger',
              position: '1B',
              number: '17',
              stat1Name: 'Avg',
              stat1Value: '.254',
              stat2Name: 'HR',
              stat2Value: 15,
              stat3Name: 'RBIs',
              stat3Value: 51,
            },
          ],
        },
        'bulls-NBA': {
          sport: 'NBA',
          statLabels: {
            stat1: 'PPG',
            stat2: 'APG',
            stat3: 'RPG',
          },
          players: [
            {
              id: '1',
              name: 'DeMar DeRozan',
              position: 'SG',
              number: '11',
              stat1Name: 'PPG',
              stat1Value: '24.3',
              stat2Name: 'APG',
              stat2Value: '4.2',
              stat3Name: 'RPG',
              stat3Value: '3.8',
            },
            {
              id: '2',
              name: 'Zach LaVine',
              position: 'SF',
              number: '8',
              stat1Name: 'PPG',
              stat1Value: '19.7',
              stat2Name: 'APG',
              stat2Value: '2.3',
              stat3Name: 'RPG',
              stat3Value: '4.1',
            },
            {
              id: '3',
              name: 'Nikola Vucevic',
              position: 'C',
              number: '9',
              stat1Name: 'PPG',
              stat1Value: '17.8',
              stat2Name: 'RPG',
              stat2Value: '11.2',
              stat3Name: 'APG',
              stat3Value: '2.8',
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
  };

  return { playerData, loading, error, refetch: fetchPlayerStats };
}