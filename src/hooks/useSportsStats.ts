// src/hooks/useSportsStats.ts
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
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface StatsEntry {
  name?: string;
  displayValue?: string;
}

interface Competition {
  competitors?: Array<{
    team?: {
      displayName?: string;
      logo?: string;
      name?: string;
    };
    records?: Array<{
      name?: string;
      displayValue?: string;
      wins?: number;
      losses?: number;
      ties?: number;
      summary?: string;
    }>;
  }>;
}

interface Event {
  competitions?: Competition[];
}

interface ScoreboardResponse {
  events?: Event[];
}

const getSeasonYear = (sport: string) => {
  const now = new Date();
  const month = now.getMonth();
  
  if (sport === 'NFL') {
    return month < 8 ? now.getFullYear() - 1 : now.getFullYear();
  }
  
  if (sport === 'MLB') {
    return month < 3 ? now.getFullYear() - 1 : now.getFullYear();
  }
  
  if (sport === 'NBA') {
    return month < 9 ? now.getFullYear() - 1 : now.getFullYear();
  }
  
  if (sport === 'NHL') {
    return month < 9 ? now.getFullYear() - 1 : now.getFullYear();
  }
  
  if (sport === 'MLS') {
    return month < 2 ? now.getFullYear() - 1 : now.getFullYear();
  }
  
  if (sport === 'WNBA') {
    return month < 4 ? now.getFullYear() - 1 : now.getFullYear();
  }
  
  return now.getFullYear();
};

const parseRecord = (record: Record<string, unknown>) => {
  const recordStr = (record?.summary as string) || (record?.displayValue as string) || '0-0';
  const parts = recordStr.split('-');
  return {
    wins: parseInt(parts[0]) || 0,
    losses: parseInt(parts[1]) || 0,
    ties: parseInt(parts[2]) || 0,
    recordStr
  };
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
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(CACHE_KEY);
      }

      const teams: TeamStats[] = [];

      // NFL - Bears
      try {
        const res = await fetch(
          'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1000'
        );
        
        if (res.ok) {
          const data = (await res.json()) as ScoreboardResponse;
          const allEvents = data.events || [];
          
          let found = false;
          for (const event of allEvents) {
            if (found) break;
            const competitors = event.competitions?.[0]?.competitors || [];
            
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Bears')) {
                const record = comp.records?.[0];
                if (record) {
                  const { wins, losses, ties, recordStr } = parseRecord(record);
                  teams.push({
                    name: 'Chicago Bears',
                    sport: 'NFL',
                    wins,
                    losses,
                    ties: ties || undefined,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo
                  });
                  found = true;
                }
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching NFL data:', err);
      }

      // MLB - Cubs and White Sox
      try {
        const res = await fetch(
          'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?limit=1000'
        );
        
        if (res.ok) {
          const data = (await res.json()) as ScoreboardResponse;
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              const displayName = comp.team?.displayName || '';
              if (displayName.includes('Cubs') && !teams.find(t => t.name === 'Chicago Cubs')) {
                const record = comp.records?.[0];
                if (record) {
                  const { wins, losses, recordStr } = parseRecord(record);
                  teams.push({
                    name: 'Chicago Cubs',
                    sport: 'MLB',
                    wins,
                    losses,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo
                  });
                }
              }
              if (displayName.includes('White Sox') && !teams.find(t => t.name === 'Chicago White Sox')) {
                const record = comp.records?.[0];
                if (record) {
                  const { wins, losses, recordStr } = parseRecord(record);
                  teams.push({
                    name: 'Chicago White Sox',
                    sport: 'MLB',
                    wins,
                    losses,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching MLB data:', err);
      }

      // NBA - Bulls
      try {
        const res = await fetch(
          'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?limit=1000'
        );
        
        if (res.ok) {
          const data = (await res.json()) as ScoreboardResponse;
          const allEvents = data.events || [];
          
          let found = false;
          for (const event of allEvents) {
            if (found) break;
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Bulls')) {
                const record = comp.records?.[0];
                if (record) {
                  const { wins, losses, recordStr } = parseRecord(record);
                  teams.push({
                    name: 'Chicago Bulls',
                    sport: 'NBA',
                    wins,
                    losses,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo
                  });
                  found = true;
                }
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching NBA data:', err);
      }

      // NHL - Blackhawks
      try {
        const res = await fetch(
          'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?limit=1000'
        );
        
        if (res.ok) {
          const data = (await res.json()) as ScoreboardResponse;
          const allEvents = data.events || [];
          
          let found = false;
          for (const event of allEvents) {
            if (found) break;
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Blackhawks')) {
                const record = comp.records?.[0];
                if (record) {
                  const { wins, losses, ties, recordStr } = parseRecord(record);
                  teams.push({
                    name: 'Chicago Blackhawks',
                    sport: 'NHL',
                    wins,
                    losses,
                    ties: ties || undefined,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo
                  });
                  found = true;
                }
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching NHL data:', err);
      }

      // WNBA - Sky
      try {
        const res = await fetch(
          'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?limit=1000'
        );
        
        if (res.ok) {
          const data = (await res.json()) as ScoreboardResponse;
          const allEvents = data.events || [];
          
          let found = false;
          for (const event of allEvents) {
            if (found) break;
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Sky')) {
                const record = comp.records?.[0];
                if (record) {
                  const { wins, losses, recordStr } = parseRecord(record);
                  teams.push({
                    name: 'Chicago Sky',
                    sport: 'WNBA',
                    wins,
                    losses,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo
                  });
                  found = true;
                }
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching WNBA data:', err);
      }

      // MLS - Chicago Fire FC
      try {
        const res = await fetch(
          'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?limit=1000'
        );
        
        if (res.ok) {
          const data = (await res.json()) as ScoreboardResponse;
          const allEvents = data.events || [];
          
          let found = false;
          for (const event of allEvents) {
            if (found) break;
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Fire')) {
                const record = comp.records?.[0];
                if (record) {
                  const { wins, losses, ties, recordStr } = parseRecord(record);
                  teams.push({
                    name: 'Chicago Fire FC',
                    sport: 'MLS',
                    wins,
                    losses,
                    ties: ties || undefined,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo
                  });
                  found = true;
                }
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching MLS data:', err);
      }

      // Sort by sport priority
      const sportOrder = ['NFL', 'MLB', 'NBA', 'NHL', 'MLS', 'WNBA'];
      teams.sort((a, b) => sportOrder.indexOf(a.sport) - sportOrder.indexOf(b.sport));

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