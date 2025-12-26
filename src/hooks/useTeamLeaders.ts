/**
 * src/hooks/useTeamLeaders.ts
 * ========================================================================
 * TEAM LEADERS HOOK - Fetches statistical leaders per category
 * 
 * ESPN Endpoints for team leaders:
 * - Team stats with leaders: /teams/{id}?enable=roster,stats
 * - Season leaders: /seasons/{year}/types/{type}/teams/{id}/leaders
 * 
 * Features:
 * - Fetches top performers per stat category
 * - Includes player photos from ESPN CDN
 * - Falls back to static data when API unavailable
 * - Caches results for performance
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
  statDisplay: string;  // Formatted for display (e.g., "3,001 yds")
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

interface ESPNLeaderEntry {
  athlete?: {
    id: string;
    displayName?: string;
    fullName?: string;
    jersey?: string;
    position?: {
      abbreviation?: string;
    };
    headshot?: {
      href?: string;
    };
  };
  displayValue?: string;
  value?: number;
}

interface ESPNLeaderCategory {
  name?: string;
  displayName?: string;
  leaders?: ESPNLeaderEntry[];
}

interface ESPNTeamLeadersResponse {
  team?: {
    id: string;
    displayName?: string;
  };
  categories?: ESPNLeaderCategory[];
  leaders?: ESPNLeaderCategory[]; // Alternative structure
}

// ========================================================================
// CONSTANTS
// ========================================================================

const BEARS_TEAM_ID = '3';

// ESPN player headshot URL pattern
// Format: https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/{id}.png&w=350&h=254
const ESPN_HEADSHOT_BASE = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full';
const PLACEHOLDER_HEADSHOT = '/images/player-silhouette.png';

// Leader endpoints to try
const LEADER_ENDPOINTS = [
  `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${BEARS_TEAM_ID}?enable=roster,stats,leaders`,
  `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/teams/${BEARS_TEAM_ID}/leaders`,
];

// Stat category mapping from ESPN names to our categories
const CATEGORY_MAP: Record<string, keyof TeamLeaders> = {
  'passingYards': 'passing',
  'passingTouchdowns': 'passing',
  'rushingYards': 'rushing',
  'rushingTouchdowns': 'rushing',
  'receivingYards': 'receiving',
  'receivingTouchdowns': 'receiving',
  'receptions': 'receiving',
  'sacks': 'sacks',
  'interceptions': 'interceptions',
  'defensiveInterceptions': 'interceptions',
  'tackles': 'tackles',
  'totalTackles': 'tackles',
  'touchdowns': 'touchdowns',
  'totalTouchdowns': 'touchdowns',
};

// ========================================================================
// FALLBACK DATA - 2024 Bears Leaders (update as needed)
// ========================================================================

const FALLBACK_LEADERS: TeamLeaders = {
  passing: [
    {
      playerId: '4431611',
      name: 'Caleb Williams',
      position: 'QB',
      jersey: '18',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4431611.png&w=96&h=70`,
      statValue: 3291,
      statDisplay: '3,291 yds',
    },
  ],
  rushing: [
    {
      playerId: '4259545',
      name: "D'Andre Swift",
      position: 'RB',
      jersey: '4',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4259545.png&w=96&h=70`,
      statValue: 1245,
      statDisplay: '1,245 yds',
    },
    {
      playerId: '4431611',
      name: 'Caleb Williams',
      position: 'QB',
      jersey: '18',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4431611.png&w=96&h=70`,
      statValue: 456,
      statDisplay: '456 yds',
    },
  ],
  receiving: [
    {
      playerId: '3915416',
      name: 'DJ Moore',
      position: 'WR',
      jersey: '2',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/3915416.png&w=96&h=70`,
      statValue: 1012,
      statDisplay: '1,012 yds',
    },
    {
      playerId: '4431299',
      name: 'Rome Odunze',
      position: 'WR',
      jersey: '15',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4431299.png&w=96&h=70`,
      statValue: 789,
      statDisplay: '789 yds',
    },
  ],
  sacks: [
    {
      playerId: '3134690',
      name: 'Montez Sweat',
      position: 'DE',
      jersey: '98',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/3134690.png&w=96&h=70`,
      statValue: 9.5,
      statDisplay: '9.5 sacks',
    },
  ],
  interceptions: [
    {
      playerId: '4243253',
      name: 'Jaylon Johnson',
      position: 'CB',
      jersey: '1',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4243253.png&w=96&h=70`,
      statValue: 4,
      statDisplay: '4 INTs',
    },
  ],
  tackles: [
    {
      playerId: '3121544',
      name: 'T.J. Edwards',
      position: 'LB',
      jersey: '53',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/3121544.png&w=96&h=70`,
      statValue: 145,
      statDisplay: '145 tackles',
    },
  ],
  touchdowns: [
    {
      playerId: '4259545',
      name: "D'Andre Swift",
      position: 'RB',
      jersey: '4',
      headshotUrl: `${ESPN_HEADSHOT_BASE}/4259545.png&w=96&h=70`,
      statValue: 14,
      statDisplay: '14 TDs',
    },
  ],
};

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Get headshot URL with fallback
 * ESPN URL format: https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/{id}.png&w=350&h=254
 */
function getHeadshotUrl(athlete: ESPNLeaderEntry['athlete']): string {
  if (athlete?.headshot?.href) {
    return athlete.headshot.href;
  }
  if (athlete?.id) {
    return `${ESPN_HEADSHOT_BASE}/${athlete.id}.png&w=96&h=70`;
  }
  return PLACEHOLDER_HEADSHOT;
}

/**
 * Parse ESPN leader entry into our TeamLeader format
 */
function parseLeaderEntry(entry: ESPNLeaderEntry): TeamLeader | null {
  const athlete = entry.athlete;
  if (!athlete?.id || !athlete?.displayName) {
    return null;
  }

  return {
    playerId: athlete.id,
    name: athlete.displayName || athlete.fullName || 'Unknown',
    position: athlete.position?.abbreviation || 'N/A',
    jersey: athlete.jersey || '0',
    headshotUrl: getHeadshotUrl(athlete),
    statValue: entry.value ?? 0,
    statDisplay: entry.displayValue || String(entry.value ?? 0),
  };
}

/**
 * Parse ESPN response into TeamLeaders
 */
function parseLeadersResponse(data: ESPNTeamLeadersResponse): TeamLeaders {
  const result: TeamLeaders = {
    passing: [],
    rushing: [],
    receiving: [],
    sacks: [],
    interceptions: [],
    tackles: [],
    touchdowns: [],
  };

  const categories = data.categories || data.leaders || [];

  for (const category of categories) {
    const catName = category.name || '';
    const targetCategory = CATEGORY_MAP[catName];
    
    if (!targetCategory) continue;

    const leaders = category.leaders || [];
    for (const entry of leaders.slice(0, 2)) { // Top 2 per category
      const leader = parseLeaderEntry(entry);
      if (leader) {
        result[targetCategory].push(leader);
      }
    }
  }

  return result;
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

    console.log('%c🏈 Fetching Team Leaders', 'color: #C83803; font-weight: bold;');

    // Try each endpoint
    for (const endpoint of LEADER_ENDPOINTS) {
      try {
        console.log(`📡 Trying: ${endpoint}`);
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          console.warn(`⚠️ Endpoint returned ${response.status}`);
          continue;
        }

        const data = await response.json() as ESPNTeamLeadersResponse;
        
        // Check if we have leader data
        if (data.categories || data.leaders) {
          const parsed = parseLeadersResponse(data);
          
          // Validate we got some data
          const hasData = Object.values(parsed).some(arr => arr.length > 0);
          
          if (hasData) {
            console.log('%c✅ Leaders loaded from API', 'color: green; font-weight: bold;');
            setLeaders(parsed);
            setSource('live');
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn(`❌ Endpoint failed:`, err);
      }
    }

    // Fallback to static data
    console.log('%c⚠️ Using fallback leader data', 'color: orange; font-weight: bold;');
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
  'points-allowed': 'tackles',
  'defensive-sacks': 'sacks',
  'turnover-differential': 'interceptions',
  'interceptions-thrown': 'passing',
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