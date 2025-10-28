'use client';

import { useState, useEffect } from 'react';

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

export function useGameData(teamId: string) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLastGame();
  }, [teamId]);

  const fetchLastGame = async () => {
    try {
      setLoading(true);
      setError(null);

      // Map team IDs to ESPN team codes
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

      // Fetch recent games from ESPN
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamCode}/schedule` // Adjust sport based on team
      );

      if (!res.ok) {
        throw new Error('Failed to fetch game data');
      }

      const data = await res.json();
      const events = data.events || [];

      // Find last completed game
      const lastGame = events.find((e: any) => {
        const status = e.competitions?.[0]?.status?.type?.name;
        return status === 'STATUS_FINAL' || status === 'Final';
      });

      if (lastGame) {
        const competition = lastGame.competitions[0];
        const competitors = competition.competitors;
        const homeTeam = competitors[0];
        const awayTeam = competitors[1];

        // Determine which is our team
        const isHome = homeTeam.team.id === teamCode;
        const ourTeam = isHome ? homeTeam : awayTeam;
        const opponent = isHome ? awayTeam : homeTeam;

        // Build score progression (simplified for now)
        const scoreProgression: GameScore[] = [];
        const quarters = competition.linescores || [];

        quarters.forEach((score: any, index: number) => {
          scoreProgression.push({
            period: index + 1,
            teamScore: ourTeam.linescores?.[index]?.value || 0,
            opponentScore: opponent.linescores?.[index]?.value || 0,
            timestamp: `Q${index + 1}`,
          });
        });

        // Determine result
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
  };

  return { gameData, loading, error, refetch: fetchLastGame };
}

