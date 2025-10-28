'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetchSchedule();
  }, [teamId, sport]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock schedule data - In production, fetch from ESPN API
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
            {
              id: '2',
              date: 'Nov 10, 2025',
              time: '12:00 PM',
              opponent: 'Green Bay Packers',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
              location: 'Chicago, IL',
              venue: 'Soldier Field',
              homeAway: 'home',
              status: 'scheduled',
              broadcast: 'FOX',
            },
            {
              id: '3',
              date: 'Nov 17, 2025',
              time: '7:20 PM',
              opponent: 'Minnesota Vikings',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',
              location: 'Chicago, IL',
              venue: 'Soldier Field',
              homeAway: 'home',
              status: 'scheduled',
              broadcast: 'ESPN',
            },
            {
              id: '4',
              date: 'Nov 24, 2025',
              time: '12:30 PM',
              opponent: 'Indianapolis Colts',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
              location: 'Indianapolis, IN',
              venue: 'Lucas Oil Stadium',
              homeAway: 'away',
              status: 'scheduled',
              broadcast: 'CBS',
            },
            {
              id: '5',
              date: 'Dec 1, 2025',
              time: '12:00 PM',
              opponent: 'Arizona Cardinals',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
              location: 'Chicago, IL',
              venue: 'Soldier Field',
              homeAway: 'home',
              status: 'scheduled',
              broadcast: 'FOX',
            },
          ],
        },
        'cubs-MLB': {
          sport: 'MLB',
          games: [
            {
              id: '1',
              date: 'Apr 1, 2025',
              time: '3:05 PM',
              opponent: 'St. Louis Cardinals',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/mlb/500/stl.png',
              location: 'Chicago, IL',
              venue: 'Wrigley Field',
              homeAway: 'home',
              status: 'scheduled',
              broadcast: 'MARQUEE',
            },
            {
              id: '2',
              date: 'Apr 2, 2025',
              time: '3:05 PM',
              opponent: 'St. Louis Cardinals',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/mlb/500/stl.png',
              location: 'Chicago, IL',
              venue: 'Wrigley Field',
              homeAway: 'home',
              status: 'scheduled',
              broadcast: 'MARQUEE',
            },
            {
              id: '3',
              date: 'Apr 3, 2025',
              time: '1:20 PM',
              opponent: 'St. Louis Cardinals',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/mlb/500/stl.png',
              location: 'Chicago, IL',
              venue: 'Wrigley Field',
              homeAway: 'home',
              status: 'scheduled',
              broadcast: 'MARQUEE',
            },
          ],
        },
        'bulls-NBA': {
          sport: 'NBA',
          games: [
            {
              id: '1',
              date: 'Oct 24, 2024',
              time: '7:00 PM',
              opponent: 'Miami Heat',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
              location: 'Chicago, IL',
              venue: 'United Center',
              homeAway: 'home',
              status: 'scheduled',
              broadcast: 'NBCSCH',
            },
            {
              id: '2',
              date: 'Oct 26, 2024',
              time: '7:00 PM',
              opponent: 'Cleveland Cavaliers',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
              location: 'Cleveland, OH',
              venue: 'Quicken Loans Arena',
              homeAway: 'away',
              status: 'scheduled',
              broadcast: 'NBCSCH',
            },
            {
              id: '3',
              date: 'Oct 28, 2024',
              time: '7:00 PM',
              opponent: 'Toronto Raptors',
              opponentLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
              location: 'Chicago, IL',
              venue: 'United Center',
              homeAway: 'home',
              status: 'scheduled',
              broadcast: 'NBCSCH',
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
  };

  return { scheduleData, loading, error, refetch: fetchSchedule };
}