/**
 * src/hooks/useTeamSchedule.ts - DEBUG VERSION (STRICT TYPESCRIPT)
 * ========================================================================
 * Same as before but with detailed logging to see what ESPN returns
 * Full TypeScript with no `any` types
 * ========================================================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ========================================================================
// TYPES - ESPN API RESPONSES
// ========================================================================

interface ESPNTeam {
  id: string;
  displayName: string;
  logo?: string;
}

interface ESPNCompetitor {
  homeAway: 'home' | 'away';
  team: ESPNTeam;
  score?: number;
  records?: Array<{
    id?: string;
    abbreviation?: string;
    displayName?: string;
    shortDisplayName?: string;
    description?: string;
    type: string;
    displayValue?: string;
    summary?: string;
  }>;

}

interface ESPNVenue {
  fullName?: string;
  city?: string;
  state?: string;
}

interface ESPNBroadcast {
  names?: string[];
  media?: {
    shortName?: string;
  };
  type?: {
    id?: string;
    shortName?: string;
  };
  market?: {
    id?: string;
    type?: string;
  };
}

interface ESPNCompetition {
  id: string;
  date: string;
  status?: {
    type?: {
      name?: string;
    };
  };
  competitors: ESPNCompetitor[];
  venue?: ESPNVenue;
  broadcasts?: ESPNBroadcast[];
}

interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  competitions: ESPNCompetition[];
}

interface ESPNScheduleResponse {
  events?: ESPNEvent[];
}

// ========================================================================
// TYPES - OUTPUT
// ========================================================================

export interface ScheduleGame {
  id: string;
  date: string;
  time: string;
  opponent: string;
  opponentLogo: string;
  opponentRecord?: string;
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

// ========================================================================
// TYPES - CONFIG
// ========================================================================

interface TeamEndpoint {
  endpoint: string;
  sport: string;
  bearTeamId: string;
}

interface TeamEndpoints {
  [key: string]: TeamEndpoint;
}

// ========================================================================
// ESPN TEAM IDs AND ENDPOINTS
// ========================================================================

const TEAM_ENDPOINTS: TeamEndpoints = {
  'bears': {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/chi/schedule',
    sport: 'NFL',
    bearTeamId: '3',
  },
  'cubs': {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/chc/schedule',
    sport: 'MLB',
    bearTeamId: '16',
  },
  'whitesox': {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/cws/schedule',
    sport: 'MLB',
    bearTeamId: '25',
  },
  'bulls': {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/chi/schedule',
    sport: 'NBA',
    bearTeamId: '2',
  },
  'blackhawks': {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams/chi/schedule',
    sport: 'NHL',
    bearTeamId: '16',
  },
  'sky': {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams/chi/schedule',
    sport: 'WNBA',
    bearTeamId: '2',
  },
  'fire': {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/teams/chi/schedule',
    sport: 'MLS',
    bearTeamId: '2118',
  },
};

// ========================================================================
// HELPER FUNCTIONS - STRICTLY TYPED
// ========================================================================

/**
 * Map ESPN status to our status
 */
function mapStatus(espnStatus: string | undefined): 'scheduled' | 'live' | 'final' {
  if (!espnStatus) return 'scheduled';

  const lower = espnStatus.toLowerCase();
  if (lower.includes('final')) return 'final';
  if (lower.includes('inprogress') || lower.includes('live')) return 'live';

  return 'scheduled';
}

/**
 * Format date and time
 */
function formatDateTime(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);

  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { date: dateStr, time: timeStr };
}

/**
 * Get opponent from competitors array
 */
function getOpponent(
  competitors: ESPNCompetitor[],
  ourTeamId: string
): { name: string; logo?: string; record?: string } {
  const opponent = competitors.find((c: ESPNCompetitor): boolean => c.team.id !== ourTeamId);

  // Find the "overall" or "total" record from the records array
  const overallRecord = opponent?.records?.find(
    (r) => r.type === 'total'
  );

  return {
    name: opponent?.team?.displayName || 'Unknown',
    logo: opponent?.team?.logo,
    record: overallRecord?.displayValue || overallRecord?.summary,
  };
}

/**
 * Get our score from competitors
 */
function getOurScore(competitors: ESPNCompetitor[], ourTeamId: string): number | undefined {
  const ourTeam = competitors.find((c: ESPNCompetitor): boolean => c.team.id === ourTeamId);
  return ourTeam?.score;
}

/**
 * Parse ESPN event into ScheduleGame
 */
function parseGame(
  event: ESPNEvent,
  competition: ESPNCompetition,
  sport: string,
  ourTeamId: string
): ScheduleGame {
  const { date, time } = formatDateTime(event.date);
  const opponent = getOpponent(competition.competitors, ourTeamId);
  const ourTeam = competition.competitors.find(
    (c: ESPNCompetitor): boolean => c.team.id === ourTeamId
  );
  const opposingTeam = competition.competitors.find(
    (c: ESPNCompetitor): boolean => c.team.id !== ourTeamId
  );

  const status = mapStatus(competition.status?.type?.name);
  const ourScore = getOurScore(competition.competitors, ourTeamId);
  const opponentScore = opposingTeam?.score;

  const broadcasts = competition.broadcasts || [];
  const broadcast = broadcasts.length > 0 
    ? broadcasts[0].media?.shortName || broadcasts[0].names?.[0]
    : undefined;

  return {
    id: event.id,
    date,
    time,
    opponent: opponent.name,
    opponentLogo: opponent.logo || '',
    opponentRecord: opponent.record,
    location: competition.venue?.city || 'Unknown',
    venue: competition.venue?.fullName || 'Unknown Venue',
    homeAway: ourTeam?.homeAway || 'away',
    status,
    score:
      status === 'final' && ourScore !== undefined && opponentScore !== undefined
        ? { team: ourScore, opponent: opponentScore }
        : undefined,
    broadcast,
  };
}

// ========================================================================
// LOGGING HELPERS
// ========================================================================

function logDebugInfo(event: ESPNEvent, competition: ESPNCompetition): void {
  console.log(`   Event:`, {
    id: event.id,
    date: event.date,
    competitionsCount: event.competitions?.length,
  });

  const competitors = competition.competitors || [];
  console.log(`   Competitors:`, competitors.map((c: ESPNCompetitor) => ({
    id: c.team?.id,
    name: c.team?.displayName,
    homeAway: c.homeAway,
  })));
}

// ========================================================================
// MAIN HOOK
// ========================================================================

interface UseTeamScheduleReturn {
  scheduleData: ScheduleData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch team schedule from ESPN with debug logging
 */
export function useTeamSchedule(teamId: string): UseTeamScheduleReturn {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const config = TEAM_ENDPOINTS[teamId];
      if (!config) {
        throw new Error(`Unknown team: ${teamId}`);
      }

      console.log(`📅 Fetching ${teamId} schedule from ESPN...`);
      console.log(`   Endpoint: ${config.endpoint}`);
      console.log(`   Team ID: ${config.bearTeamId}`);

      const response = await Promise.race<Response>([
        fetch(config.endpoint),
        new Promise<never>((_, reject): void => {
          setTimeout((): void => {
            reject(new Error('Schedule fetch timeout'));
          }, 5000);
        }),
      ]);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: ESPNScheduleResponse = await response.json();
      console.log(`📦 Raw ESPN response:`, data);

      const events: ESPNEvent[] = data.events || [];
      console.log(`   Total events: ${events.length}`);

      if (events.length === 0) {
        console.warn(`⚠️ No events returned from ESPN`);
      }

      const games: ScheduleGame[] = [];

      for (let i = 0; i < events.length; i++) {
        const event = events[i];

        const competition = event.competitions?.[0];
        if (!competition) {
          console.warn(`   ⚠️ Event ${i + 1} has no competitions`);
          continue;
        }

        logDebugInfo(event, competition);

        const game = parseGame(event, competition, config.sport, config.bearTeamId);
        games.push(game);
        console.log(`   ✅ Parsed game ${i + 1}:`, game);
      }

      console.log(`✅ Total games parsed: ${games.length}`);

      setScheduleData({
        games,
        sport: config.sport,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`❌ Failed to fetch schedule: ${errorMessage}`, err);
      setError(errorMessage);
      setScheduleData(null);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  const refetch = useCallback(async (): Promise<void> => {
    console.log(`🔄 Refetching schedule...`);
    await fetchSchedule();
  }, [fetchSchedule]);

  useEffect((): void => {
    void fetchSchedule();
  }, [fetchSchedule]);

  return {
    scheduleData,
    loading,
    error,
    refetch,
  };
}