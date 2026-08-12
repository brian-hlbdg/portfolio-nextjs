/**
 * src/hooks/useTeamLeaders.ts
 * ========================================================================
 * TEAM LEADERS HOOK - Fetches statistical leaders per category
 * 
 * UPDATED: Using correct ESPN endpoints
 * 
 * Working ESPN Endpoints:
 * 1. Team with stats: site.api.espn.com/apis/site/v2/sports/football/nfl/teams/{id}?enable=roster,stats
 * 2. NFL Leaders: site.web.api.espn.com/apis/site/v3/sports/football/nfl/teamleaders
 * 3. Season Leaders: sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/{year}/types/2/leaders
 * 
 * Features:
 * - Fetches top performers per stat category
 * - Includes player photos from ESPN CDN
 * - Falls back to static data when API unavailable
 * - Correct ESPN player IDs for headshots
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
 * A single team leader for a stat category
 */
export interface TeamLeader {
  playerId: string;
  name: string;
  position: string;
  jersey: string;
  headshotUrl: string;
  statValue: number;
  statDisplay: string;
}

/**
 * Leaders organized by category
 */
export interface TeamLeaders {
  passing: TeamLeader[];
  rushing: TeamLeader[];
  receiving: TeamLeader[];
  sacks: TeamLeader[];
  interceptions: TeamLeader[];
  tackles: TeamLeader[];
  touchdowns: TeamLeader[];
}

/**
 * What the hook returns
 */
export interface UseTeamLeadersReturn {
  leaders: TeamLeaders | null;
  loading: boolean;
  error: string | null;
  source: 'live' | 'fallback';
  refetch: () => Promise<void>;
}

// ========================================================================
// ESPN API TYPES
// ========================================================================

interface ESPNAthlete {
  id: string;
  uid?: string;
  displayName?: string;
  fullName?: string;
  shortName?: string;
  jersey?: string;
  position?: {
    abbreviation?: string;
    name?: string;
  };
  headshot?: {
    href?: string;
    alt?: string;
  };
}

interface ESPNLeaderEntry {
  athlete?: ESPNAthlete;
  displayValue?: string;
  value?: number;
  statistics?: {
    displayValue?: string;
    value?: number;
  };
}

interface ESPNLeaderCategory {
  name?: string;
  displayName?: string;
  abbreviation?: string;
  type?: string;
  leaders?: ESPNLeaderEntry[];
  entries?: ESPNLeaderEntry[];
}

interface ESPNTeamResponse {
  team?: {
    id: string;
    displayName?: string;
    leaders?: ESPNLeaderCategory[];
  };
  leaders?: ESPNLeaderCategory[];
}

interface ESPNCoreLeadersResponse {
  categories?: ESPNLeaderCategory[];
}

// ========================================================================
// CONSTANTS
// ========================================================================

const BEARS_TEAM_ID = '3';
const CURRENT_SEASON = '2025'; // 2025 completed regular season

// ESPN player headshot URL pattern
const ESPN_HEADSHOT_BASE = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full';
const PLACEHOLDER_HEADSHOT = '/images/player-silhouette.png';

/**
 * Extract correct player ID from uid
 * ESPN uid format: "s:20~l:28~a:4431611" - we want the part after "~a:"
 */
function extractPlayerIdFromUid(uid: string | undefined, fallbackId: string): string {
  if (!uid) return fallbackId;
  const match = uid.match(/~a:(\d+)/);
  return match?.[1] || fallbackId;
}

// Endpoints to try (in order of preference)
const LEADER_ENDPOINTS = [
  // Primary: Team endpoint with stats enabled
  `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${BEARS_TEAM_ID}?enable=roster,stats`,
  // Secondary: NFL-wide leaders (we'll filter for Bears)
  `https://site.web.api.espn.com/apis/site/v3/sports/football/nfl/teamleaders`,
  // Tertiary: Core API season leaders
  `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${CURRENT_SEASON}/types/2/teams/${BEARS_TEAM_ID}/leaders`,
];

// Map ESPN category names to our categories
const CATEGORY_MAP: Record<string, keyof TeamLeaders> = {
  // Passing
  'passing': 'passing',
  'passingYards': 'passing',
  'passingTouchdowns': 'passing',
  'passingyards': 'passing',
  'passingtouchdowns': 'passing',
  // Rushing  
  'rushing': 'rushing',
  'rushingYards': 'rushing',
  'rushingTouchdowns': 'rushing',
  'rushingyards': 'rushing',
  'rushingtouchdowns': 'rushing',
  // Receiving
  'receiving': 'receiving',
  'receivingYards': 'receiving',
  'receivingTouchdowns': 'receiving',
  'receptions': 'receiving',
  'receivingyards': 'receiving',
  'receivingtouchdowns': 'receiving',
  // Defense
  'sacks': 'sacks',
  'defensiveSacks': 'sacks',
  'defensivesacks': 'sacks',
  'interceptions': 'interceptions',
  'defensiveInterceptions': 'interceptions',
  'defensiveinterceptions': 'interceptions',
  'tackles': 'tackles',
  'totalTackles': 'tackles',
  'totaltackles': 'tackles',
  'combinedTackles': 'tackles',
  // Touchdowns
  'touchdowns': 'touchdowns',
  'totalTouchdowns': 'touchdowns',
  'totaltouchdowns': 'touchdowns',
  'scoringTouchdowns': 'touchdowns',
};

// ========================================================================
// FALLBACK DATA - 2025 Bears Season Stats with CORRECT ESPN IDs
// ========================================================================
//
// Source: chicagobears.com/news/by-the-numbers-bears-2025-season-stats
// ESPN IDs from espn.com player URLs
// ========================================================================

const FALLBACK_LEADERS: TeamLeaders = {
  passing: [
    {
      playerId: '4431611',
      name: 'Caleb Williams',
      position: 'QB',
      jersey: '18',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4431611.png&w=96&h=70`,
      statValue: 3942,
      statDisplay: '3,942 yds', // Franchise single-season record
    },
  ],
  rushing: [
    {
      playerId: '4259545',
      name: "D'Andre Swift",
      position: 'RB',
      jersey: '4',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4259545.png&w=96&h=70`,
      statValue: 1087,
      statDisplay: '1,087 yds',
    },
    {
      playerId: '4608686',
      name: 'Kyle Monangai',
      position: 'RB',
      jersey: '25',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4608686.png&w=96&h=70`,
      statValue: 783,
      statDisplay: '783 yds',
    },
  ],
  receiving: [
    {
      playerId: '3915416',
      name: 'DJ Moore',
      position: 'WR',
      jersey: '2',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/3915416.png&w=96&h=70`,
      statValue: 761,
      statDisplay: '761 yds',
    },
    {
      playerId: '4723086',
      name: 'Colston Loveland',
      position: 'TE',
      jersey: '18',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4723086.png&w=96&h=70`,
      statValue: 713,
      statDisplay: '713 yds', // 1st rookie TE to lead Bears since Mike Ditka (1961)
    },
    {
      playerId: '4431299',
      name: 'Rome Odunze',
      position: 'WR',
      jersey: '15',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4431299.png&w=96&h=70`,
      statValue: 661,
      statDisplay: '661 yds',
    },
  ],
  sacks: [
    {
      playerId: '3134690',
      name: 'Montez Sweat',
      position: 'DE',
      jersey: '98',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/3134690.png&w=96&h=70`,
      statValue: 10.0,
      statDisplay: '10.0 sacks',
    },
  ],
  interceptions: [
    {
      playerId: '2574056',
      name: 'Kevin Byard III',
      position: 'S',
      jersey: '31',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/2574056.png&w=96&h=70`,
      statValue: 7,
      statDisplay: '7 INTs', // NFL leader, 1st-team All-Pro
    },
  ],
  tackles: [
    {
      playerId: '3929950',
      name: 'Tremaine Edmunds',
      position: 'LB',
      jersey: '49',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/3929950.png&w=96&h=70`,
      statValue: 112,
      statDisplay: '112 tackles',
    },
  ],
  touchdowns: [
    {
      playerId: '4259545',
      name: "D'Andre Swift",
      position: 'RB',
      jersey: '4',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4259545.png&w=96&h=70`,
      statValue: 9,
      statDisplay: '9 TDs',
    },
    {
      playerId: '4723086',
      name: 'Colston Loveland',
      position: 'TE',
      jersey: '18',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4723086.png&w=96&h=70`,
      statValue: 6,
      statDisplay: '6 TDs',
    },
  ],
};

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Get headshot URL with fallback
 * Uses correct player ID extraction from uid if available
 */
function getHeadshotUrl(athlete: ESPNAthlete | undefined): string {
  if (!athlete) return PLACEHOLDER_HEADSHOT;
  
  // Try headshot href first
  if (athlete.headshot?.href) {
    return athlete.headshot.href;
  }
  
  // Extract correct ID from uid if available
  const correctId = extractPlayerIdFromUid(athlete.uid, athlete.id);
  
  if (correctId) {
    return `${ESPN_HEADSHOT_BASE}/${correctId}.png&w=96&h=70`;
  }
  
  return PLACEHOLDER_HEADSHOT;
}

/**
 * Parse ESPN leader entry into our TeamLeader format
 */
function parseLeaderEntry(entry: ESPNLeaderEntry): TeamLeader | null {
  const athlete = entry.athlete;
  if (!athlete?.id) {
    return null;
  }

  // Get correct player ID
  const correctId = extractPlayerIdFromUid(athlete.uid, athlete.id);
  
  // Get display name
  const name = athlete.displayName || athlete.fullName || athlete.shortName || 'Unknown';
  
  // Get stat value and display
  const statValue = entry.value ?? entry.statistics?.value ?? 0;
  const statDisplay = entry.displayValue ?? entry.statistics?.displayValue ?? String(statValue);

  return {
    playerId: correctId,
    name,
    position: athlete.position?.abbreviation || 'N/A',
    jersey: athlete.jersey || '0',
    headshotUrl: getHeadshotUrl(athlete),
    statValue,
    statDisplay,
  };
}

/**
 * Initialize empty leaders object
 */
function createEmptyLeaders(): TeamLeaders {
  return {
    passing: [],
    rushing: [],
    receiving: [],
    sacks: [],
    interceptions: [],
    tackles: [],
    touchdowns: [],
  };
}

/**
 * Parse team response with leaders
 */
function parseTeamResponse(data: ESPNTeamResponse): TeamLeaders {
  const result = createEmptyLeaders();
  
  // Try team.leaders first, then top-level leaders
  const categories = data.team?.leaders || data.leaders || [];
  
  console.log(`📊 Found ${categories.length} leader categories`);
  
  for (const category of categories) {
    const catName = category.name?.toLowerCase() || category.type?.toLowerCase() || '';
    const targetCategory = CATEGORY_MAP[catName];
    
    if (!targetCategory) {
      console.log(`  ⏭️ Skipping unmapped category: ${catName}`);
      continue;
    }
    
    console.log(`  ✅ Mapping ${catName} → ${targetCategory}`);
    
    // Try leaders array, then entries array
    const entries = category.leaders || category.entries || [];
    
    for (const entry of entries.slice(0, 3)) { // Top 3 per category
      const leader = parseLeaderEntry(entry);
      if (leader) {
        result[targetCategory].push(leader);
        console.log(`    👤 ${leader.name}: ${leader.statDisplay}`);
      }
    }
  }
  
  return result;
}

/**
 * Parse core API leaders response
 */
function parseCoreLeadersResponse(data: ESPNCoreLeadersResponse): TeamLeaders {
  const result = createEmptyLeaders();
  
  const categories = data.categories || [];
  
  console.log(`📊 Core API: Found ${categories.length} categories`);
  
  for (const category of categories) {
    const catName = category.name?.toLowerCase() || category.abbreviation?.toLowerCase() || '';
    const targetCategory = CATEGORY_MAP[catName];
    
    if (!targetCategory) continue;
    
    const entries = category.leaders || category.entries || [];
    
    for (const entry of entries.slice(0, 3)) {
      const leader = parseLeaderEntry(entry);
      if (leader) {
        result[targetCategory].push(leader);
      }
    }
  }
  
  return result;
}

/**
 * Check if leaders object has any data
 */
function hasLeaderData(leaders: TeamLeaders): boolean {
  return Object.values(leaders).some(arr => arr.length > 0);
}

// ========================================================================
// MAIN HOOK
// ========================================================================

export function useTeamLeaders(): UseTeamLeadersReturn {
  const [leaders, setLeaders] = useState<TeamLeaders | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'fallback'>('fallback');

  const fetchLeaders = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    console.log('%c🏈 Fetching Team Leaders', 'color: #C83803; font-weight: bold; font-size: 14px;');

    // Try each endpoint
    for (const endpoint of LEADER_ENDPOINTS) {
      try {
        console.log(`📡 Trying: ${endpoint}`);
        
        const response = await Promise.race([
          fetch(endpoint, {
            headers: { 'Accept': 'application/json' },
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 8000)
          ),
        ]);
        
        if (!response.ok) {
          console.warn(`⚠️ Endpoint returned ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        console.log('📦 Response structure:', Object.keys(data));
        
        // Parse based on response structure
        let parsed: TeamLeaders;
        
        if (data.team?.leaders || data.leaders) {
          parsed = parseTeamResponse(data as ESPNTeamResponse);
        } else if (data.categories) {
          parsed = parseCoreLeadersResponse(data as ESPNCoreLeadersResponse);
        } else {
          console.warn('⚠️ Unknown response structure');
          continue;
        }
        
        // Validate we got some data
        if (hasLeaderData(parsed)) {
          console.log('%c✅ Leaders loaded from API', 'color: green; font-weight: bold;');
          setLeaders(parsed);
          setSource('live');
          setLoading(false);
          return;
        } else {
          console.warn('⚠️ Parsed response but no leader data found');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn(`❌ Endpoint failed: ${message}`);
      }
    }

    // Fallback to static data
    console.log('%c⚠️ Using fallback leader data', 'color: orange; font-weight: bold;');
    console.log('   Fallback data has correct ESPN IDs for headshots');
    setLeaders(FALLBACK_LEADERS);
    setSource('fallback');
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchLeaders();
  }, [fetchLeaders]);

  return {
    leaders,
    loading,
    error,
    source,
    refetch: fetchLeaders,
  };
}

// ========================================================================
// HELPER: Get leader for specific stat
// ========================================================================

/**
 * Map stat card IDs to leader categories
 */
const STAT_TO_LEADER_MAP: Record<string, keyof TeamLeaders> = {
  'passing-yards': 'passing',
  'passing-tds': 'passing',
  'rushing-yards': 'rushing',
  'rushing-tds': 'rushing',
  'receiving-yards': 'receiving',
  'scoring-offense': 'touchdowns',
  'red-zone': 'touchdowns',
  'points-allowed': 'tackles',
  'defensive-sacks': 'sacks',
  'turnover-differential': 'interceptions',
  'interceptions-thrown': 'passing',
  'third-down': 'passing',
  'yards-per-play': 'rushing',
};

/**
 * Get the appropriate leader(s) for a stat card
 */
export function getLeaderForStat(
  statId: string,
  leaders: TeamLeaders | null
): TeamLeader[] {
  if (!leaders) return [];
  
  const category = STAT_TO_LEADER_MAP[statId];
  if (!category) return [];
  
  return leaders[category].slice(0, 2);
}

export default useTeamLeaders;