'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GameScore {
  period: number;
  teamScore: number;
  opponentScore: number;
  timestamp: string;
}

export interface GameData {
  id: string;
  date: string;
  opponent: string;
  opponentLogo: string;
  location: string;
  finalScore: {
    team: number;
    opponent: number;
  };
  result: 'W' | 'L' | 'T';
  scoreProgression: GameScore[];
  highlights: string;
  venue: string;
}

interface Competitor {
  team: { id: string; displayName: string; logo: string };
  score: number;
  linescores?: Array<{ value: number }>;
}

interface Event {
  id: string;
  date: string;
  competitions: Array<{
    competitors: Competitor[];
    status?: { type?: { name?: string } };
    linescores?: Array<{ value: number }>;
    venue?: { fullName?: string; city?: string };
    summary?: string;
  }>;
}

interface ScheduleResponse {
  events?: Event[];
}

export function useGameData(teamId: string) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLastGame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const teamCodeMap: Record<string, string> = {
        bears: '3',
        cubs: '16',
        whitesox: '25',
        bulls: '2',
        blackhawks: '16',
        sky: '2',
        fire: '1902',
      };

      const teamCode = teamCodeMap[teamId];
      if (!teamCode) {
        setError('Team not found');
        return;
      }

      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamCode}/schedule`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch game data');
      }

      const data = (await res.json()) as ScheduleResponse;
      const events = data.events || [];

      const lastGame = events.find((e: Event) => {
        const status = e.competitions?.[0]?.status?.type?.name;
        return status === 'STATUS_FINAL' || status === 'Final';
      });

      if (lastGame) {
        const competition = lastGame.competitions[0];
        const competitors = competition.competitors;
        const homeTeam = competitors[0];
        const awayTeam = competitors[1];

        const isHome = homeTeam.team.id === teamCode;
        const ourTeam = isHome ? homeTeam : awayTeam;
        const opponent = isHome ? awayTeam : homeTeam;

        const scoreProgression: GameScore[] = [];
        const quarters = competition.linescores || [];

        quarters.forEach((score, index: number) => {
          scoreProgression.push({
            period: index + 1,
            teamScore: ourTeam.linescores?.[index]?.value || 0,
            opponentScore: opponent.linescores?.[index]?.value || 0,
            timestamp: `Q${index + 1}`,
          });
        });

        const ourScore = ourTeam.score;
        const oppScore = opponent.score;
        const result = ourScore > oppScore ? 'W' : ourScore < oppScore ? 'L' : 'T';

        setGameData({
          id: lastGame.id,
          date: new Date(lastGame.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          }),
          opponent: opponent.team.displayName,
          opponentLogo: opponent.team.logo,
          location: competition.venue?.fullName || 'Unknown Venue',
          finalScore: {
            team: ourScore,
            opponent: oppScore,
          },
          result,
          scoreProgression,
          highlights: competition.summary || '',
          venue: competition.venue?.city || '',
        });
      } else {
        setError('No completed games found');
      }
    } catch (err) {
      setError('Failed to fetch game data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchLastGame();
  }, [fetchLastGame]);

  return { gameData, loading, error, refetch: fetchLastGame };
}