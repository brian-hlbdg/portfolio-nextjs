/**
 * src/hooks/useDivisionStandings.ts
 * ========================================================================
 * Fetches NFL division standings data for the Bears
 * 
 * Data provided:
 * - Division rank (1st-4th in NFC North)
 * - Conference rank (1st-16th in NFC)
 * - Current streak (W2, L3, etc.)
 * - Playoff status (clinched, in the hunt, eliminated)
 * - Division record
 * - Conference record
 * - Home/Away records
 * 
 * ESPN Standings Endpoint:
 * https://cdn.espn.com/core/nfl/standings?xhr=1
 * 
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ========================================================================
// TYPES
// ========================================================================

/**
 * Team standing data from ESPN
 */
export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamAbbreviation: string;
  divisionRank: number;
  conferenceRank: number;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
  streak: string; // "W2", "L3", etc.
  streakType: 'W' | 'L' | 'T';
  streakLength: number;
  homeRecord: string;
  awayRecord: string;
  divisionRecord: string;
  conferenceRecord: string;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  playoffStatus: PlayoffStatus;
  clinchIndicator: string | null;
}

/**
 * Playoff status options
 */
export type PlayoffStatus = 
  | 'clinched_division'
  | 'clinched_wildcard'
  | 'clinched_bye'
  | 'in_the_hunt'
  | 'eliminated'
  | 'unknown';

/**
 * Division standings (all 4 teams)
 */
export interface DivisionStandings {
  divisionName: string;
  conference: 'NFC' | 'AFC';
  teams: TeamStanding[];
}

/**
 * What the hook returns
 */
export interface UseDivisionStandingsReturn {
  bearsStanding: TeamStanding | null;
  divisionStandings: DivisionStandings | null;
  currentWeek: number;
  loading: boolean;
  error: string | null;
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  refetch: () => Promise<void>;
}

// ========================================================================
// CONSTANTS
// ========================================================================

const BEARS_TEAM_ID = '3';
const BEARS_ABBREVIATION = 'CHI';

const STANDINGS_ENDPOINT = 'https://cdn.espn.com/core/nfl/standings?xhr=1';
const CACHE_KEY = 'bears_standings_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const REQUEST_TIMEOUT = 10000;

// ========================================================================
// ESPN RESPONSE TYPES
// ========================================================================

interface ESPNStandingsResponse {
  content?: {
    standings?: {
      groups?: ESPNConferenceGroup[];
    };
    week?: {
      number?: number;
    };
  };
}

interface ESPNConferenceGroup {
  name?: string;
  abbreviation?: string;
  groups?: ESPNDivisionGroup[];
}

interface ESPNDivisionGroup {
  name?: string;
  abbreviation?: string;
  standings?: {
    entries?: ESPNStandingEntry[];
  };
}

interface ESPNStandingEntry {
  team?: {
    id?: string;
    displayName?: string;
    abbreviation?: string;
    shortDisplayName?: string;
  };
  note?: {
    description?: string;
    rank?: number;
  };
  stats?: ESPNStat[];
}

interface ESPNStat {
  name?: string;
  displayName?: string;
  value?: number;
  displayValue?: string;
}

// ========================================================================
// CACHE HELPERS
// ========================================================================

interface CachedStandings {
  bearsStanding: TeamStanding;
  divisionStandings: DivisionStandings;
  currentWeek: number;
  timestamp: number;
}

function getCachedStandings(): CachedStandings | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached) as CachedStandings;
    const age = Date.now() - parsed.timestamp;
    
    if (age < CACHE_TTL) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedStandings(data: Omit<CachedStandings, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData: CachedStandings = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    console.warn('Failed to cache standings data');
  }
}

// ========================================================================
// PARSING HELPERS
// ========================================================================

function getStatValue(stats: ESPNStat[], statName: string): number {
  const stat = stats.find(s => s.name?.toLowerCase() === statName.toLowerCase());
  return stat?.value ?? 0;
}

function getStatDisplayValue(stats: ESPNStat[], statName: string): string {
  const stat = stats.find(s => s.name?.toLowerCase() === statName.toLowerCase());
  return stat?.displayValue ?? '0-0';
}

function parseStreak(streakStr: string): { type: 'W' | 'L' | 'T'; length: number } {
  const match = streakStr.match(/^([WLT])(\d+)$/i);
  if (match) {
    return {
      type: match[1].toUpperCase() as 'W' | 'L' | 'T',
      length: parseInt(match[2], 10),
    };
  }
  return { type: 'W', length: 0 };
}

function determinePlayoffStatus(
  clinchIndicator: string | null,
  noteDescription: string | null
): PlayoffStatus {
  if (!clinchIndicator && !noteDescription) {
    return 'in_the_hunt';
  }
  
  const indicator = clinchIndicator?.toLowerCase() ?? '';
  const note = noteDescription?.toLowerCase() ?? '';
  
  if (indicator === 'e' || note.includes('eliminated')) {
    return 'eliminated';
  }
  
  if (indicator === 'z' || note.includes('home') || note.includes('first round bye')) {
    return 'clinched_bye';
  }
  
  if (indicator === 'y' || note.includes('division')) {
    return 'clinched_division';
  }
  
  if (indicator === 'x' || note.includes('playoff') || note.includes('wild card')) {
    return 'clinched_wildcard';
  }
  
  return 'in_the_hunt';
}

function parseStandingEntry(
  entry: ESPNStandingEntry,
  divisionRank: number,
  conferenceRank: number
): TeamStanding | null {
  if (!entry.team || !entry.stats) {
    return null;
  }
  
  const stats = entry.stats;
  const streakStr = getStatDisplayValue(stats, 'streak');
  const { type: streakType, length: streakLength } = parseStreak(streakStr);
  
  let clinchIndicator: string | null = null;
  if (entry.note?.description) {
    const desc = entry.note.description.toLowerCase();
    if (desc.includes('eliminated')) clinchIndicator = 'e';
    else if (desc.includes('home')) clinchIndicator = 'z';
    else if (desc.includes('division')) clinchIndicator = 'y';
    else if (desc.includes('playoff') || desc.includes('wild')) clinchIndicator = 'x';
  }
  
  const pointsFor = getStatValue(stats, 'pointsFor');
  const pointsAgainst = getStatValue(stats, 'pointsAgainst');
  
  return {
    teamId: entry.team.id ?? '',
    teamName: entry.team.displayName ?? '',
    teamAbbreviation: entry.team.abbreviation ?? '',
    divisionRank,
    conferenceRank,
    wins: getStatValue(stats, 'wins'),
    losses: getStatValue(stats, 'losses'),
    ties: getStatValue(stats, 'ties'),
    winPercentage: getStatValue(stats, 'winPercent'),
    streak: streakStr || 'W0',
    streakType,
    streakLength,
    homeRecord: getStatDisplayValue(stats, 'Home'),
    awayRecord: getStatDisplayValue(stats, 'Road'),
    divisionRecord: getStatDisplayValue(stats, 'vs. Div'),
    conferenceRecord: getStatDisplayValue(stats, 'vs. Conf'),
    pointsFor,
    pointsAgainst,
    pointDifferential: pointsFor - pointsAgainst,
    playoffStatus: determinePlayoffStatus(clinchIndicator, entry.note?.description ?? null),
    clinchIndicator,
  };
}

// ========================================================================
// MAIN HOOK
// ========================================================================

export function useDivisionStandings(): UseDivisionStandingsReturn {
  const [bearsStanding, setBearsStanding] = useState<TeamStanding | null>(null);
  const [divisionStandings, setDivisionStandings] = useState<DivisionStandings | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  const [source, setSource] = useState<'live' | 'cache' | 'fallback'>('fallback');

  const fetchStandings = useCallback(async (): Promise<void> => {
    console.log('🏈 Fetching division standings...');
    setLoading(true);
    setError(null);

    try {
      // 1. Check cache first
      const cached = getCachedStandings();
      if (cached) {
        console.log('💾 Using cached standings data');
        setBearsStanding(cached.bearsStanding);
        setDivisionStandings(cached.divisionStandings);
        setCurrentWeek(cached.currentWeek);
        setLastUpdated(new Date(cached.timestamp).toLocaleString());
        setSource('cache');
        setLoading(false);
        return;
      }

      // 2. Fetch from ESPN
      const response = await Promise.race<Response>([
        fetch(STANDINGS_ENDPOINT, {
          headers: { Accept: 'application/json' },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT)
        ),
      ]);

      if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status}`);
      }

      const data = (await response.json()) as ESPNStandingsResponse;
      
      // 3. Extract current week
      const week = data.content?.week?.number ?? 1;
      setCurrentWeek(week);

      // 4. Find NFC North division
      const conferences = data.content?.standings?.groups ?? [];
      const nfcConference = conferences.find(
        conf => conf.abbreviation === 'NFC' || conf.name?.includes('National')
      );

      if (!nfcConference?.groups) {
        throw new Error('Could not find NFC conference in standings');
      }

      const nfcNorthDivision = nfcConference.groups.find(
        div => div.name?.includes('North') || div.abbreviation?.includes('North')
      );

      if (!nfcNorthDivision?.standings?.entries) {
        throw new Error('Could not find NFC North division in standings');
      }

      // 5. Parse division standings
      const entries = nfcNorthDivision.standings.entries;
      const parsedTeams: TeamStanding[] = [];
      let bearsData: TeamStanding | null = null;

      // Conference rank estimation based on division position
      const conferenceRankBase = 1;

      entries.forEach((entry, index) => {
        const divisionRank = index + 1;
        // Estimate conference rank - this is simplified
        const estimatedConfRank = conferenceRankBase + (divisionRank - 1) * 4;
        
        const teamStanding = parseStandingEntry(entry, divisionRank, estimatedConfRank);
        
        if (teamStanding) {
          parsedTeams.push(teamStanding);
          
          if (
            teamStanding.teamId === BEARS_TEAM_ID ||
            teamStanding.teamAbbreviation === BEARS_ABBREVIATION
          ) {
            bearsData = teamStanding;
          }
        }
      });

      if (bearsData === null) {
        throw new Error('Bears not found in standings data');
      }

      const divisionData: DivisionStandings = {
        divisionName: 'NFC North',
        conference: 'NFC',
        teams: parsedTeams,
      };

      // 6. Update state - bearsData is now guaranteed to be TeamStanding
      const confirmedBearsData: TeamStanding = bearsData;
      setBearsStanding(confirmedBearsData);
      setDivisionStandings(divisionData);
      setLastUpdated(new Date().toLocaleString());
      setSource('live');

      // 7. Cache the data
      setCachedStandings({
        bearsStanding: confirmedBearsData,
        divisionStandings: divisionData,
        currentWeek: week,
      });

      console.log('✅ Standings loaded successfully', {
        bearsRank: confirmedBearsData.divisionRank,
        streak: confirmedBearsData.streak,
        playoffStatus: confirmedBearsData.playoffStatus,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error fetching standings:', errorMessage);
      setError(errorMessage);
      
      // Try to use stale cache as fallback
      if (typeof window !== 'undefined') {
        try {
          const staleData = localStorage.getItem(CACHE_KEY);
          if (staleData) {
            const staleCache = JSON.parse(staleData) as CachedStandings;
            console.log('⚠️ Using stale cache as fallback');
            setBearsStanding(staleCache.bearsStanding);
            setDivisionStandings(staleCache.divisionStandings);
            setCurrentWeek(staleCache.currentWeek);
            setSource('fallback');
          }
        } catch {
          // Ignore parse errors
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  const refetch = useCallback(async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    await fetchStandings();
  }, [fetchStandings]);

  return {
    bearsStanding,
    divisionStandings,
    currentWeek,
    loading,
    error,
    lastUpdated,
    source,
    refetch,
  };
}

export default useDivisionStandings;