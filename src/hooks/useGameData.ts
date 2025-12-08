/**
 * src/hooks/useGameData.ts
 * ========================================================================
 * Hook for fetching comprehensive game data including:
 * - Final score and result
 * - Quarterback statistics
 * - Team statistics comparison
 * - Key plays timeline
 * - Score progression by quarter
 * 
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { NFL_TEAMS, getNFLTeamName } from '@/data/nflTeamLogos';

function getAbbrFromEspnId(espnId: string): string | undefined {
  return Object.values(NFL_TEAMS).find((t) => t.espnId === espnId)?.abbreviation;
}



// ========================================================================
// TYPES - OUTPUT INTERFACES
// ========================================================================

export interface GameScore {
  period: number;
  teamScore: number;
  opponentScore: number;
  timestamp: string;
}

export interface QuarterbackStats {
  name: string;
  completions: number;
  attempts: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
  rating: number;
}

export interface KeyPlay {
  quarter: number;
  time: string;
  description: string;
  team: 'team' | 'opponent';
  playType: 'touchdown' | 'turnover' | 'big-gain' | 'field-goal';
}

export interface GameStatistics {
  totalYards: { team: number; opponent: number };
  passingYards: { team: number; opponent: number };
  rushingYards: { team: number; opponent: number };
  turnovers: { team: number; opponent: number };
  timeOfPossession: { team: string; opponent: string };
  thirdDowns: { team: string; opponent: string };
  penalties: { team: string; opponent: string };
}

export interface GameData {
  id: string;
  date: string;
  opponent: string; // full name for UI
  opponentAbbr?: string; // NEW: abbreviation, for logos/labels
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
  quarterbacks?: {
    team: QuarterbackStats;
    opponent: QuarterbackStats;
  };
  keyPlays?: KeyPlay[];
  statistics?: GameStatistics;
}

// ========================================================================
// TYPES - ESPN API RESPONSES
// ========================================================================

interface Competitor {
  team: { id: string; displayName: string; logo: string };
  score: number | { value?: number | string } | null;
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

// Summary endpoint types - using 'any' strategically only where ESPN API is truly dynamic
interface SummaryData {
  boxscore?: {
    teams?: Array<{
      team: { id: string };
      statistics?: Array<{
        name: string;
        displayValue?: string | { displayValue?: string };
        value?: number;
      }>;
    }>;
    players?: Array<{
      team: { id: string };
      statistics?: Array<{
        name: string;
        athletes?: Array<{
          athlete?: { displayName?: string };
          stats?: string[];
        }>;
      }>;
    }>;
  };
  drives?: {
    previous?: Array<{
      plays?: Array<{
        period?: { number?: number };
        clock?: { displayValue?: string };
        text?: string;
        scoringPlay?: boolean;
        scoreValue?: number;
        statYardage?: number;
        team?: { id?: string };
      }>;
    }>;
  };
}

// ========================================================================
// CONSTANTS
// ========================================================================

const TEAM_CODE_MAP: Record<string, string> = {
  bears: '3',
  cubs: '16',
  whitesox: '25',
  bulls: '2',
  blackhawks: '16',
  sky: '2',
  fire: '1902',
};

const REQUEST_TIMEOUT = 8000;

// ========================================================================
// MAIN HOOK
// ========================================================================

export function useGameData(teamId: string) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLastGame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const teamCode = TEAM_CODE_MAP[teamId];
      if (!teamCode) {
        setError('Team not found');
        return;
      }

      // STEP 1: Get the schedule to find the last completed game
      const scheduleRes = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamCode}/schedule`
      );

      if (!scheduleRes.ok) {
        throw new Error('Failed to fetch schedule');
      }

      const scheduleData = (await scheduleRes.json()) as ScheduleResponse;
      const events = scheduleData.events || [];

      // Get all completed games
      const completedGames = events.filter((e: Event) => {
        const status = e.competitions?.[0]?.status?.type?.name;
        return status === 'STATUS_FINAL' || status === 'Final';
      });

      // Sort by date, latest first
      completedGames.sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        return bTime - aTime;
      });

      const lastGame = completedGames[0];

      if (!lastGame) {
        setError('No completed games found');
        return;
      }

      // Parse basic game data first
      const basicData = parseBasicGameData(lastGame, teamCode);

      // STEP 2: Try to fetch detailed game summary
      try {
        const gameId = lastGame.id;
        const summaryRes = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`
        );

        if (summaryRes.ok) {
          const summaryData = (await summaryRes.json()) as SummaryData;
          
          // STEP 3: Parse comprehensive game data with enhanced stats
          const fullData = parseFullGameData(basicData, summaryData, teamCode);
          setGameData(fullData);
          
          console.log('✅ Game summary loaded with QB stats, key plays, and team statistics');
        } else {
          console.warn('Summary endpoint failed, using basic data only');
          setGameData(basicData);
        }
      } catch (summaryErr) {
        console.warn('Could not fetch summary data:', summaryErr);
        setGameData(basicData);
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

// ========================================================================
// HELPER FUNCTIONS - Parse ESPN Data
// ========================================================================

/**
 * Parse basic game data (fallback if summary endpoint fails)
 */
function parseBasicGameData(event: Event, teamCode: string): GameData {
  const competition = event.competitions[0];
  const competitors = competition.competitors;
  const homeTeam = competitors[0];
  const awayTeam = competitors[1];

  console.log('🏈 Parsing game data:', {
    homeTeam: homeTeam.team.displayName,
    awayTeam: awayTeam.team.displayName,
    ourTeamCode: teamCode,
    homeTeamId: homeTeam.team.id,
    awayTeamId: awayTeam.team.id,
  });

  const isHome = homeTeam.team.id === teamCode;
  const ourTeam = isHome ? homeTeam : awayTeam;
  const opponent = isHome ? awayTeam : homeTeam;

  const opponentAbbr = getAbbrFromEspnId(opponent.team.id);
  const opponentName = opponentAbbr
    ? getNFLTeamName(opponentAbbr) // full franchise name from local data
    : opponent.team.displayName;

  const opponentLogos = opponentAbbr
    ? NFL_TEAMS[opponentAbbr as keyof typeof NFL_TEAMS]?.logos
    : undefined;

  console.log('✅ Identified teams:', {
    ourTeam: ourTeam.team.displayName,
    opponent: opponent.team.displayName,
    isHome,
    opponentAbbr,
    opponentName,
  });

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

  // Safely extract score as number
  const getScore = (competitor: Competitor): number => {
    const raw = competitor.score;

    if (typeof raw === 'number') {
      return raw;
    }

    if (raw && typeof raw === 'object' && 'value' in raw) {
      const value = (raw as { value?: number | string }).value;
      return Number(value) || 0;
    }

    return 0;
  };

  const ourScore = getScore(ourTeam);
  const oppScore = getScore(opponent);
  const result: 'W' | 'L' | 'T' =
    ourScore > oppScore ? 'W' : ourScore < oppScore ? 'L' : 'T';

  return {
    id: event.id,
    date: new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }),
    opponent: opponentName,                 // full name
    opponentAbbr,                           // abbreviation (e.g. 'MIN')
    opponentLogo: opponentLogos?.scoreboard || opponent.team.logo,
    location: competition.venue?.fullName || 'Unknown Venue',
    finalScore: {
      team: ourScore,
      opponent: oppScore,
    },
    result,
    scoreProgression,
    highlights: competition.summary || '',
    venue: competition.venue?.city || '',
  };
}


/**
 * Parse full game data with statistics from summary endpoint
 */
function parseFullGameData(
  basicData: GameData,
  summaryData: SummaryData,
  teamCode: string
): GameData {
  // Extract enhanced statistics
  const quarterbacks = extractQuarterbackStats(summaryData, teamCode);
  const keyPlays = extractKeyPlays(summaryData, teamCode);
  const statistics = extractTeamStatistics(summaryData, teamCode);

  return {
    ...basicData,
    quarterbacks,
    keyPlays,
    statistics,
  };
}

/**
 * Extract QB stats from boxscore
 */
function extractQuarterbackStats(
  summaryData: SummaryData,
  teamCode: string
): { team: QuarterbackStats; opponent: QuarterbackStats } | undefined {
  try {
    const boxscore = summaryData?.boxscore;
    if (!boxscore?.players) {
      console.log('⚠️ No boxscore.players found');
      return undefined;
    }

    const teams = boxscore.players;
    const ourTeamStats = teams.find((t) => t.team.id === teamCode);
    const oppTeamStats = teams.find((t) => t.team.id !== teamCode);

    console.log('📊 Found teams:', {
      ourTeamId: ourTeamStats?.team.id,
      oppTeamId: oppTeamStats?.team.id,
    });

    const getQBStats = (teamData: typeof ourTeamStats): QuarterbackStats | null => {
      if (!teamData?.statistics) {
        console.log('⚠️ No team statistics found');
        return null;
      }

      // Find passing statistics
      const passingStats = teamData.statistics.find(
        (stat) => stat.name === 'passing'
      );

      if (!passingStats?.athletes?.[0]) {
        console.log('⚠️ No passing stats or athletes found');
        return null;
      }

      const qb = passingStats.athletes[0];
      const stats = qb.stats || [];

      console.log('🏈 QB Stats array:', {
        name: qb.athlete?.displayName,
        statsArray: stats,
      });

      // ESPN QB stats array format:
      // [0] = completions-attempts (e.g., "15/25")
      // [1] = yards
      // [2] = avg
      // [3] = touchdowns
      // [4] = interceptions
      // [5] = sacks (not used)
      // [6] = QBR or rating

      // Parse completions/attempts
      let completions = 0;
      let attempts = 0;
      
      if (stats[0] && typeof stats[0] === 'string' && stats[0].includes('/')) {
        const parts = stats[0].split('/');
        completions = parseInt(parts[0]) || 0;
        attempts = parseInt(parts[1]) || 0;
      }

      return {
        name: qb.athlete?.displayName || 'Unknown',
        completions,
        attempts,
        yards: parseInt(stats[1]) || 0,
        touchdowns: parseInt(stats[3]) || 0,
        interceptions: parseInt(stats[4]) || 0,
        rating: parseFloat(stats[6]) || 0.0,
      };
    };

    const teamQB = getQBStats(ourTeamStats);
    const oppQB = getQBStats(oppTeamStats);

    if (!teamQB || !oppQB) {
      console.log('⚠️ Missing QB stats:', { teamQB: !!teamQB, oppQB: !!oppQB });
      return undefined;
    }

    console.log('✅ QB Stats extracted:', { teamQB, oppQB });

    return {
      team: teamQB,
      opponent: oppQB,
    };
  } catch (err) {
    console.error('❌ Error parsing QB stats:', err);
    return undefined;
  }
}

/**
 * Extract key plays from play-by-play
 */
function extractKeyPlays(summaryData: SummaryData, teamCode: string): KeyPlay[] {
  try {
    const drives = summaryData?.drives?.previous || [];
    const keyPlays: KeyPlay[] = [];

    drives.forEach((drive) => {
      const drivePlays = drive.plays || [];

      drivePlays.forEach((play) => {
        // Identify key play types
        const text = play.text?.toLowerCase() || '';
        const isTouchdown = play.scoringPlay && (play.scoreValue || 0) >= 6;
        const isTurnover = text.includes('interception') || text.includes('fumble');
        const isBigGain = (play.statYardage || 0) >= 25;
        const isFieldGoal = play.scoringPlay && play.scoreValue === 3;

        if (isTouchdown || isTurnover || isBigGain || isFieldGoal) {
          keyPlays.push({
            quarter: play.period?.number || 1,
            time: play.clock?.displayValue || '',
            description: play.text || '',
            team: play.team?.id === teamCode ? 'team' : 'opponent',
            playType: isTouchdown
              ? 'touchdown'
              : isTurnover
              ? 'turnover'
              : isFieldGoal
              ? 'field-goal'
              : 'big-gain',
          });
        }
      });
    });

    // Optional: sort by quarter, then by clock (descending like game clock)
    keyPlays.sort((a, b) => {
    if (a.quarter !== b.quarter) return a.quarter - b.quarter;

    const toSeconds = (t: string): number => {
      const [m, s] = t.split(':').map((n) => Number(n));
      if (Number.isNaN(m) || Number.isNaN(s)) return 0;
      return m * 60 + s;
    };

    // later in the quarter (smaller clock) comes after earlier
    return toSeconds(b.time) - toSeconds(a.time);
  });

  return keyPlays;
    } catch (err) {
      console.error('Error extracting key plays:', err);
      return [];
    }
}

/**
 * Extract team statistics comparison
 */
function extractTeamStatistics(
  summaryData: SummaryData,
  teamCode: string
): GameStatistics | undefined {
  try {
    const boxscore = summaryData?.boxscore?.teams;
    if (!boxscore || boxscore.length < 2) return undefined;

    const ourTeam = boxscore.find((t) => t.team.id === teamCode);
    const oppTeam = boxscore.find((t) => t.team.id !== teamCode);

    if (!ourTeam?.statistics || !oppTeam?.statistics) return undefined;

    const getStat = (
      stats: typeof ourTeam.statistics,
      name: string,
      altNames: string[] = []
    ): string => {
      if (!stats) return '0';

      const candidates = [name, ...altNames];

      let stat:
        | {
            name: string;
            displayValue?: string | { displayValue?: string };
            value?: number;
          }
        | undefined;

      for (const n of candidates) {
        stat = stats.find((s) => s.name === n);
        if (stat) break;
      }

      if (!stat) return '0';

      if (typeof stat.displayValue === 'string') {
        return stat.displayValue;
      }

      if (
        stat.displayValue &&
        typeof stat.displayValue === 'object' &&
        'displayValue' in stat.displayValue
      ) {
        return String(stat.displayValue.displayValue);
      }

      if (stat.value !== undefined) {
        return String(stat.value);
      }

      return '0';
    };

    return {
      totalYards: {
        team: parseInt(getStat(ourTeam.statistics, 'totalYards')) || 0,
        opponent: parseInt(getStat(oppTeam.statistics, 'totalYards')) || 0,
      },
      passingYards: {
        team:
          parseInt(
            getStat(ourTeam.statistics, 'passingYards', [
              'netPassingYards',
              'totalPassingYards',
            ])
          ) || 0,
        opponent:
          parseInt(
            getStat(oppTeam.statistics, 'passingYards', [
              'netPassingYards',
              'totalPassingYards',
            ])
          ) || 0,
      },
      rushingYards: {
        team: parseInt(getStat(ourTeam.statistics, 'rushingYards')) || 0,
        opponent: parseInt(getStat(oppTeam.statistics, 'rushingYards')) || 0,
      },
      turnovers: {
        team: parseInt(getStat(ourTeam.statistics, 'turnovers')) || 0,
        opponent: parseInt(getStat(oppTeam.statistics, 'turnovers')) || 0,
      },
      timeOfPossession: {
        team: getStat(ourTeam.statistics, 'possessionTime'),
        opponent: getStat(oppTeam.statistics, 'possessionTime'),
      },
      thirdDowns: {
        team: getStat(ourTeam.statistics, 'thirdDownEff'),
        opponent: getStat(oppTeam.statistics, 'thirdDownEff'),
      },
      penalties: {
        team: getStat(ourTeam.statistics, 'totalPenaltiesYards'),
        opponent: getStat(oppTeam.statistics, 'totalPenaltiesYards'),
      },
    };
  } catch (err) {
    console.error('Error parsing team statistics:', err);
    return undefined;
  }
}