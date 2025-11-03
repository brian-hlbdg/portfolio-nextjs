/**
 * src/types/bears.types.ts
 * 
 * All Bears dashboard types
 * Clean separation: Bears data !== generic sports data
 */

export interface BearsSeasonStats {
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
  pointsFor: number;
  pointsAgainst: number;
  record: string; // "W-L-T" format
}

export interface BearsPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  height?: string;
  weight?: number;
  college?: string;
  nflId?: string;
}

export interface BearsPlayerStats extends BearsPlayer {
  stats: {
    passing?: {
      attempts: number;
      completions: number;
      yards: number;
      touchdowns: number;
      interceptions: number;
    };
    rushing?: {
      attempts: number;
      yards: number;
      average: number;
      touchdowns: number;
    };
    receiving?: {
      receptions: number;
      yards: number;
      average: number;
      touchdowns: number;
    };
    defense?: {
      tackles: number;
      sacks: number;
      interceptions: number;
      forcedFumbles: number;
    };
  };
  lastUpdated: string;
  source: 'live' | 'unavailable';
}

export interface BearsGame {
  id: string;
  week: number;
  date: string;
  opponent: {
    name: string;
    logo?: string;
  };
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'final';
  isBearsHome: boolean;
  lastUpdated: string;
  source: 'live' | 'unavailable';
}

export interface BearsDashboardState {
  seasonStats: BearsSeasonStats | null;
  upcomingGames: BearsGame[];
  recentGames: BearsGame[];
  playerStats: BearsPlayerStats[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface FetchResult<T> {
  data: T | null;
  error: string | null;
  source: 'live' | 'unavailable';
  timestamp: number;
}