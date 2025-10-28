'use client';

import { useState, useEffect } from 'react';

export interface TeamStats {
  name: string;
  sport: string;
  logo?: string;
  wins: number;
  losses: number;
  ties?: number;
  record: string;
  lastUpdated: string;
}

interface SportsStatsState {
  teams: TeamStats[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

const CACHE_KEY = 'chicago_sports_stats';

// TYPE HINTS:
// - These interfaces define the shape of data from ESPN API
// - Nesting optional properties allows defensive coding when API changes
// - We don't need CACHE_DURATION here since we always clear cache on fetch
interface Record {
  name?: string;
  displayValue?: string;
  wins?: number;
  losses?: number;
  ties?: number;
  summary?: string;
}

interface Competitor {
  team?: {
    displayName?: string;
    logo?: string;
    name?: string;
  };
  records?: Record[];
}

interface Competition {
  competitors?: Competitor[];
}

interface Event {
  competitions?: Competition[];
}

interface ScoreboardResponse {
  events?: Event[];
}

// CLEAN PARSING: Single responsibility - extracts win/loss/ties from API record
const parseRecord = (record: Record): Omit<TeamStats, 'name' | 'sport' | 'logo' | 'lastUpdated'> => {
  const recordStr = (record?.summary as string) || (record?.displayValue as string) || '0-0';
  const parts = recordStr.split('-');
  
  return {
    wins: parseInt(parts[0]) || 0,
    losses: parseInt(parts[1]) || 0,
    ties: parseInt(parts[2]) || 0,
    record: recordStr
  };
};

// SPORT CONFIGURATION: DRY principle - define sports once, use everywhere
const SPORTS_CONFIG = {
  NFL: {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1000',
    teamNames: ['Bears']
  },
  MLB: {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?limit=1000',
    teamNames: ['Cubs', 'White Sox']
  },
  NBA: {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?limit=1000',
    teamNames: ['Bulls']
  },
  NHL: {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?limit=1000',
    teamNames: ['Blackhawks']
  },
  MLS: {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/soccer/mls/scoreboard?limit=1000',
    teamNames: ['Fire']
  },
  WNBA: {
    endpoint: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?limit=1000',
    teamNames: ['Sky']
  }
} as const;

// REASON: Why we removed getSeasonYear()
// The ESPN API returns current season stats automatically
// getSeasonYear() was calculated but never used in the component
// If needed in future: could be extracted to a utility function

// GENERIC FETCHER: DRY approach - single function handles all sports
const fetchSportTeams = async (sport: keyof typeof SPORTS_CONFIG, teamNames: readonly string[]): Promise<TeamStats[]> => {
  try {
    const config = SPORTS_CONFIG[sport];
    const response = await fetch(config.endpoint);
    
    if (!response.ok) {
      console.error(`Error fetching ${sport} data: ${response.status}`);
      return [];
    }
    
    const data = (await response.json()) as ScoreboardResponse;
    const events = data.events || [];
    const teams: TeamStats[] = [];
    const foundTeams = new Set<string>();
    
    // LOOP LOGIC: Iterate events, find teams that match our list
    for (const event of events) {
      if (foundTeams.size === teamNames.length) break; // Exit early when all teams found
      
      const competitors = event.competitions?.[0]?.competitors || [];
      
      for (const competitor of competitors) {
        const displayName = competitor.team?.displayName || '';
        
        // Check if this competitor matches one of our target teams
        for (const teamName of teamNames) {
          if (displayName.includes(teamName) && !foundTeams.has(teamName)) {
            const record = competitor.records?.[0];
            
            if (record) {
              const { wins, losses, ties, record: recordStr } = parseRecord(record);
              
              // Construct full team name (Chicago + Team Name)
              const fullName = displayName.includes(teamName) 
                ? displayName 
                : `Chicago ${teamName}`;
              
              teams.push({
                name: fullName,
                sport,
                wins,
                losses,
                ties: ties || undefined,
                record: recordStr,
                lastUpdated: new Date().toLocaleDateString(),
                logo: competitor.team?.logo
              });
              
              foundTeams.add(teamName);
            }
            break; // Move to next competitor after found
          }
        }
      }
    }
    
    return teams;
  } catch (err) {
    console.error(`Error fetching ${sport} data:`, err);
    return [];
  }
};

export function useSportsStats() {
  const [state, setState] = useState<SportsStatsState>({
    teams: [],
    loading: true,
    error: null,
    lastFetch: null
  });

  useEffect(() => {
    fetchSportsStats();
  }, []);

  const fetchSportsStats = async () => {
    try {
      // Clear cache before fetching (reason: keep data fresh)
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(CACHE_KEY);
      }

      // PARALLEL FETCHING: All requests at once for better performance
      const allTeams = await Promise.all(
        Object.keys(SPORTS_CONFIG).map((sport) =>
          fetchSportTeams(sport as keyof typeof SPORTS_CONFIG, SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG].teamNames)
        )
      );
      
      // Flatten and maintain sport order
      const teams = allTeams.flat().sort((a, b) => {
        const sportOrder = Object.keys(SPORTS_CONFIG);
        return sportOrder.indexOf(a.sport) - sportOrder.indexOf(b.sport);
      });

      // Cache the data
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: teams,
          timestamp: Date.now()
        }));
      }

      setState({
        teams: teams.length > 0 ? teams : [],
        loading: false,
        error: null,
        lastFetch: new Date()
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch sports data'
      }));
      console.error('Error fetching sports stats:', err);
    }
  };

  const refetch = () => {
    setState(prev => ({ ...prev, loading: true }));
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    fetchSportsStats();
  };

  return { ...state, refetch };
}