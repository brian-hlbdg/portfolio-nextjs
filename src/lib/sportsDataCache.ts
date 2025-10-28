// src/lib/sportsDataCache.ts
// Persistent cache for sports stats with fallback logic

interface CachedTeamStats {
  name: string;
  sport: string;
  wins: number;
  losses: number;
  ties?: number;
  record: string;
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  cachedAt?: number; // Optional - will be set when storing
  logo?: string; // Optional - from ESPN API
}

interface SportsDataCache {
  teams: Record<string, CachedTeamStats>;
  lastFetch: number;
}

// Default fallback data (last season or best known stats)
const FALLBACK_DATA: Record<string, CachedTeamStats> = {
  'Chicago Bears': {
    name: 'Chicago Bears',
    sport: 'NFL',
    wins: 5,
    losses: 12,
    ties: 0,
    record: '5-12',
    lastUpdated: new Date().toLocaleDateString(),
    source: 'fallback',
    cachedAt: Date.now()
  },
  'Chicago Cubs': {
    name: 'Chicago Cubs',
    sport: 'MLB',
    wins: 84,
    losses: 78,
    record: '84-78',
    lastUpdated: new Date().toLocaleDateString(),
    source: 'fallback',
    cachedAt: Date.now()
  },
  'Chicago White Sox': {
    name: 'Chicago White Sox',
    sport: 'MLB',
    wins: 41,
    losses: 121,
    record: '41-121',
    lastUpdated: new Date().toLocaleDateString(),
    source: 'fallback',
    cachedAt: Date.now()
  },
  'Chicago Bulls': {
    name: 'Chicago Bulls',
    sport: 'NBA',
    wins: 19,
    losses: 63,
    record: '19-63',
    lastUpdated: new Date().toLocaleDateString(),
    source: 'fallback',
    cachedAt: Date.now()
  },
  'Chicago Blackhawks': {
    name: 'Chicago Blackhawks',
    sport: 'NHL',
    wins: 28,
    losses: 46,
    ties: 8,
    record: '28-46-8',
    lastUpdated: new Date().toLocaleDateString(),
    source: 'fallback',
    cachedAt: Date.now()
  },
  'Chicago Fire FC': {
    name: 'Chicago Fire FC',
    sport: 'MLS',
    wins: 9,
    losses: 19,
    record: '9-19',
    lastUpdated: new Date().toLocaleDateString(),
    source: 'fallback',
    cachedAt: Date.now()
  },
  'Chicago Sky': {
    name: 'Chicago Sky',
    sport: 'WNBA',
    wins: 13,
    losses: 27,
    record: '13-27',
    lastUpdated: new Date().toLocaleDateString(),
    source: 'fallback',
    cachedAt: Date.now()
  }
};

const CACHE_KEY = 'chicago_sports_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cached sports data from localStorage
 */
export function getCachedData(): SportsDataCache | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: SportsDataCache = JSON.parse(cached);
    return data;
  } catch (error) {
    console.error('Error reading sports cache:', error);
    return null;
  }
}

/**
 * Save sports data to cache
 */
export function setCachedData(teams: CachedTeamStats[]): void {
  if (typeof window === 'undefined') return;

  try {
    const cache: SportsDataCache = {
      teams: teams.reduce((acc, team) => {
        acc[team.name] = {
          ...team,
          cachedAt: Date.now() // Always set current timestamp
        };
        return acc;
      }, {} as Record<string, CachedTeamStats>),
      lastFetch: Date.now()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving sports cache:', error);
  }
}

/**
 * Merge live data with cache
 * Keeps any data that's still valid, adds new data
 */
export function mergeWithCache(liveTeams: CachedTeamStats[]): CachedTeamStats[] {
  const cached = getCachedData();
  const merged: Record<string, CachedTeamStats> = {};

  // Start with cached data
  if (cached && cached.teams) {
    Object.assign(merged, cached.teams);
  }

  // Override/add with live data
  liveTeams.forEach(team => {
    if (team && team.name) {
      merged[team.name] = {
        ...team,
        source: 'live' as const,
        cachedAt: Date.now()
      };
    }
  });

  // Convert back to array and ensure all teams have data
  const result = Object.values(merged);

  // Add any missing teams from fallback
  Object.entries(FALLBACK_DATA).forEach(([teamName, fallbackTeam]) => {
    if (!result.find(t => t.name === teamName)) {
      result.push(fallbackTeam);
    }
  });

  return result;
}

/**
 * Clear old cache (call periodically to clean up)
 */
export function clearOldCache(): void {
  if (typeof window === 'undefined') return;

  try {
    const cached = getCachedData();
    if (cached && Date.now() - cached.lastFetch > CACHE_DURATION * 7) {
      // Clear if older than 7 days
      localStorage.removeItem(CACHE_KEY);
    }
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats() {
  const cached = getCachedData();
  if (!cached) return null;

  return {
    teamCount: Object.keys(cached.teams).length,
    lastFetch: new Date(cached.lastFetch).toLocaleString(),
    ageInHours: Math.round((Date.now() - cached.lastFetch) / (1000 * 60 * 60)),
    isStale: Date.now() - cached.lastFetch > CACHE_DURATION
  };
}