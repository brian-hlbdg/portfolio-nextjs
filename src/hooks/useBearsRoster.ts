/**
 * src/hooks/useBearsRoster.ts - CORRECTED FOR ESPN ATHLETE STRUCTURE
 * ========================================================================
 * ESPN returns athletes, not roster items
 * 
 * Key differences:
 * - Property is called 'athletes' not 'roster'
 * - Player ID is 'id' or 'uid', not 'playerId'
 * - Uses 'fullName' not 'displayName'
 * - Position is nested object with 'abbreviation'
 * - Status field has different structure
 * ========================================================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { BearsPlayer } from '@/components/features/types/bears.types';

// ========================================================================
// TYPES - ESPN ATHLETE STRUCTURE
// ========================================================================

interface ESPNPosition {
  id?: string;
  name?: string;
  displayName?: string;
  abbreviation?: string;
}

interface ESPNStatus {
  type?: string;
  description?: string;
}

interface ESPNAthlete {
  id: string;
  uid?: string;
  fullName: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  jersey: string;
  position?: ESPNPosition;
  status?: ESPNStatus;
  active?: boolean;
  injuries?: Array<{
    status?: string;
    description?: string;
  }>;
  college?: string | object; // College might be object or string
  height?: string;
  weight?: string | number;
}

interface ESPNTeam {
  id: string;
  displayName: string;
  athletes?: ESPNAthlete[];
}

interface ESPNTeamResponse {
  team: ESPNTeam;
}

// ========================================================================
// TYPES - HOOK OUTPUT
// ========================================================================

export interface UseBearsRosterReturn {
  activePlayers: BearsPlayer[];
  injuredPlayers: BearsPlayer[];
  loading: boolean;
  error: string | null;
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  refetch: () => Promise<void>;
}

// ========================================================================
// CONSTANTS
// ========================================================================

const ENDPOINTS = {
  primary: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/3/roster',
  secondary: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/3?enable=roster',
};

const CACHE_KEY = 'bears_roster_cache';
const CACHE_TTL = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT = 8000;

const POSITION_MAP: Record<string, string> = {
  'QB': 'QB',
  'RB': 'RB',
  'WR': 'WR',
  'TE': 'TE',
  'OL': 'OL',
  'OT': 'OT',
  'OG': 'OG',
  'C': 'C',
  'DL': 'DL',
  'DE': 'DE',
  'DT': 'DT',
  'LB': 'LB',
  'DB': 'DB',
  'CB': 'CB',
  'S': 'S',
  'K': 'K',
  'P': 'P',
  'LS': 'LS',
};

// ========================================================================
// TYPE GUARDS & VALIDATORS
// ========================================================================

function isValidESPNAthlete(athlete: unknown): athlete is ESPNAthlete {
  if (typeof athlete !== 'object' || athlete === null) return false;

  const a = athlete as Record<string, unknown>;

  return (
    typeof a.id === 'string' &&
    typeof a.fullName === 'string' &&
    typeof a.jersey === 'string'
  );
}

// ========================================================================
// CACHE MANAGEMENT
// ========================================================================

interface CachedRosterData {
  activePlayers: BearsPlayer[];
  injuredPlayers: BearsPlayer[];
  timestamp: number;
}

function getCachedRoster(): CachedRosterData | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedRosterData = JSON.parse(cached);
    const age = Date.now() - data.timestamp;

    if (age > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

function setCachedRoster(activePlayers: BearsPlayer[], injuredPlayers: BearsPlayer[]): void {
  if (typeof window === 'undefined') return;

  try {
    const data: CachedRosterData = {
      activePlayers,
      injuredPlayers,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

// ========================================================================
// HELPERS
// ========================================================================

/**
 * Check if athlete is injured based on status and injuries array
 */
function isAthleteInjured(athlete: ESPNAthlete): boolean {
  // Check status field
  if (athlete.status?.type) {
    const statusType = athlete.status.type.toLowerCase();
    if (
      statusType.includes('out') ||
      statusType.includes('unavailable') ||
      statusType.includes('inactive')
    ) {
      return true;
    }
  }

  // Check injuries array
  if (Array.isArray(athlete.injuries) && athlete.injuries.length > 0) {
    for (const injury of athlete.injuries) {
      if (injury.status?.toLowerCase().includes('out')) {
        return true;
      }
    }
  }

  // Check active field
  if (athlete.active === false) {
    return true;
  }

  return false;
}

/**
 * Extract position from ESPN position object
 */
function extractPosition(position: ESPNPosition | undefined): string {
  if (!position) return 'POS';

  const abbr = position.abbreviation?.toUpperCase();
  if (abbr && POSITION_MAP[abbr]) {
    return POSITION_MAP[abbr];
  }

  const display = position.displayName?.toUpperCase() || position.name?.toUpperCase();
  if (display && POSITION_MAP[display]) {
    return POSITION_MAP[display];
  }

  return abbr ?? display ?? 'POS';
}

/**
 * Convert ESPN athlete to BearsPlayer
 */
function convertESPNAthleteToBearsPlayer(athlete: ESPNAthlete): BearsPlayer {
  // Parse weight carefully - ESPN might send it as string or number
  let weightNum: number | undefined;
  if (athlete.weight) {
    if (typeof athlete.weight === 'number') {
      weightNum = athlete.weight;
    } else if (typeof athlete.weight === 'string') {
      const parsed = parseInt(athlete.weight, 10);
      weightNum = isNaN(parsed) ? undefined : parsed;
    }
  }

  // Extract college name - ESPN sends it as object or string
  let collegeName: string | undefined;
  if (athlete.college) {
    if (typeof athlete.college === 'string') {
      collegeName = athlete.college;
    } else if (typeof athlete.college === 'object') {
      // Try to get name from object
      const collegeObj = athlete.college as Record<string, unknown>;
      if ('displayName' in collegeObj && typeof collegeObj.displayName === 'string') {
        collegeName = collegeObj.displayName;
      } else if ('name' in collegeObj && typeof collegeObj.name === 'string') {
        collegeName = collegeObj.name;
      }
    }
  }

  // Ensure jersey is valid number
  const jerseyNum = parseInt(athlete.jersey, 10);
  if (isNaN(jerseyNum)) {
    console.warn('Invalid jersey number:', athlete.jersey);
    return {
      id: `bears_${athlete.id}`,
      name: athlete.fullName || athlete.displayName || 'Unknown',
      number: 0,
      position: extractPosition(athlete.position),
      height: athlete.height,
      weight: weightNum,
      college: collegeName,
      nflId: athlete.id,
    };
  }

  return {
    id: `bears_${athlete.id}`,
    name: athlete.fullName || athlete.displayName || 'Unknown',
    number: jerseyNum,
    position: extractPosition(athlete.position),
    height: athlete.height,
    weight: weightNum,
    college: collegeName,
    nflId: athlete.id,
  };
}

/**
 * Process ESPN athletes into active/injured groups
 */
function processAthleteData(athletes: ESPNAthlete[]): {
  activePlayers: BearsPlayer[];
  injuredPlayers: BearsPlayer[];
} {
  const activePlayers: BearsPlayer[] = [];
  const injuredPlayers: BearsPlayer[] = [];

  for (const athlete of athletes) {
    // Skip athletes with missing required fields
    if (!athlete.id || !athlete.fullName || !athlete.jersey) {
      console.warn('Skipping athlete with missing fields:', athlete);
      continue;
    }

    const bearsPlayer = convertESPNAthleteToBearsPlayer(athlete);

    // Skip if conversion failed
    if (!bearsPlayer.name || !bearsPlayer.number) {
      console.warn('Skipping athlete - conversion failed:', bearsPlayer);
      continue;
    }

    if (isAthleteInjured(athlete)) {
      injuredPlayers.push(bearsPlayer);
    } else {
      activePlayers.push(bearsPlayer);
    }
  }

  return { activePlayers, injuredPlayers };
}

// ========================================================================
// FETCH LOGIC
// ========================================================================

async function fetchFromEndpoint(endpoint: string): Promise<ESPNAthlete[] | null> {
  try {
    console.log(`🔄 Fetching from: ${endpoint}`);

    const response = await Promise.race<Response>([
      fetch(endpoint, {
        headers: { Accept: 'application/json' },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
      ),
    ]);

    if (!response.ok) {
      console.warn(`❌ Endpoint failed: ${endpoint} (${response.status})`);
      return null;
    }

    const data: unknown = await response.json();
    console.log('📦 Response received');

    // Parse team.athletes
    if (
      typeof data === 'object' &&
      data !== null &&
      'team' in data &&
      typeof (data as Record<string, unknown>).team === 'object'
    ) {
      const team = (data as Record<string, unknown>).team as Record<string, unknown>;

      if (Array.isArray(team.athletes)) {
        const athletes = team.athletes as unknown[];
        const validAthletes = athletes.filter(isValidESPNAthlete);

        if (validAthletes.length > 0) {
          console.log(`✅ Found ${validAthletes.length} valid athletes`);
          return validAthletes;
        } else {
          console.warn('⚠️ team.athletes exists but contains invalid athletes');
        }
      }
    }

    console.warn('⚠️ Could not find team.athletes in response');
    return null;
  } catch (error) {
    console.warn(
      `❌ Fetch error: ${endpoint}`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

// ========================================================================
// MAIN HOOK
// ========================================================================

export function useBearsRoster(): UseBearsRosterReturn {
  const [activePlayers, setActivePlayers] = useState<BearsPlayer[]>([]);
  const [injuredPlayers, setInjuredPlayers] = useState<BearsPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  const [source, setSource] = useState<'live' | 'cache' | 'fallback'>('fallback');

  const fetchRoster = useCallback(async (): Promise<void> => {
    console.log('🏈 Starting roster fetch...');
    setLoading(true);
    setError(null);

    try {
      // 1. Check cache
      const cached = getCachedRoster();
      if (cached) {
        console.log('💾 Using cached roster');
        setActivePlayers(cached.activePlayers);
        setInjuredPlayers(cached.injuredPlayers);
        setLastUpdated(new Date(cached.timestamp).toLocaleString());
        setSource('cache');
        setLoading(false);
        return;
      }

      // 2. Try endpoints
      let athletes: ESPNAthlete[] | null = null;

      for (const [, endpoint] of Object.entries(ENDPOINTS)) {
        athletes = await fetchFromEndpoint(endpoint);
        if (athletes && athletes.length > 0) {
          console.log('✅ Successfully fetched athletes');
          break;
        }
      }

      // 3. Process athletes if found
      if (athletes && athletes.length > 0) {
        const { activePlayers: active, injuredPlayers: injured } =
          processAthleteData(athletes);

        setActivePlayers(active);
        setInjuredPlayers(injured);
        setLastUpdated(new Date().toLocaleString());
        setSource('live');

        setCachedRoster(active, injured);
        console.log(
          `✅ Roster loaded: ${active.length} active, ${injured.length} injured`
        );
        setLoading(false);
        return;
      }

      // 4. Fallback to cache
      const staleCache = getCachedRoster();
      if (staleCache) {
        console.log('⚠️ ESPN unavailable, using stale cache');
        setActivePlayers(staleCache.activePlayers);
        setInjuredPlayers(staleCache.injuredPlayers);
        setLastUpdated(new Date(staleCache.timestamp).toLocaleString());
        setSource('fallback');
        setError('Using cached roster data');
        setLoading(false);
        return;
      }

      // 5. Error state
      console.log('❌ Complete failure');
      setError('Unable to fetch roster data. ESPN API unavailable.');
      setActivePlayers([]);
      setInjuredPlayers([]);
      setLastUpdated('Failed');
      setSource('fallback');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('🔥 Error:', message);

      setError(`Roster fetch failed: ${message}`);
      setActivePlayers([]);
      setInjuredPlayers([]);
      setLastUpdated('Error');
      setSource('fallback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const refetch = useCallback(async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    await fetchRoster();
  }, [fetchRoster]);

  return {
    activePlayers,
    injuredPlayers,
    loading,
    error,
    lastUpdated,
    source,
    refetch,
  };
}