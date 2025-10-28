'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ScheduleGame {
  id: string;
  date: string;
  time: string;
  opponent: string;
  opponentLogo: string;
  location: string;
  venue: string;
  homeAway: 'home' | 'away';
  status: 'scheduled' | 'live' | 'final';
  score?: {
    team: number;
    opponent: number;
  };
  broadcast?: string;
}

export interface ScheduleData {
  games: ScheduleGame[];
  sport: string;
}

export function useTeamSchedule(teamId: string, sport: string) {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const mockSchedules: Record<string, ScheduleData> = {
        'bears-NFL': {
          sport: 'NFL',
          games: [
            {
              id: '1',
              date: 'Nov 3, 2025',
              time: '1:00 PM',
              opponent: 'Detroit Lions',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
              location: 'Detroit, MI',
              venue: 'Ford Field',
              homeAway: 'away',
              status: 'scheduled',
              broadcast: 'FOX',
            },
          ],
        },
      };

      const key = `${teamId}-${sport}`;
      const data = mockSchedules[key];

      if (data) {
        setScheduleData(data);
      } else {
        setError('Schedule not available for this team');
      }
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [teamId, sport]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return { scheduleData, loading, error, refetch: fetchSchedule };
}