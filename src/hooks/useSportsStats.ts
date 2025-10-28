// src/hooks/useSportsStats.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  setCachedData, 
  mergeWithCache,
  clearOldCache 
} from '@/lib/sportsDataCache';

export interface TeamStats {
  name: string;
  sport: string;
  logo?: string;
  wins: number;
  losses: number;
  ties?: number;
  record: string;
  lastUpdated: string;
  source?: 'live' | 'cache' | 'fallback';
}

export interface UseSportsStatsReturn {
  teams: TeamStats[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
  refetch: () => Promise<void>;
}

export function useSportsStats(): UseSportsStatsReturn {
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchSportsStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch fresh data from ESPN
      const liveTeams: TeamStats[] = [];
      let hasErrors = false;

      // NFL - Bears
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Bears')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  const ties = record.ties || 0;
                  const recordStr = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
                  
                  liveTeams.push({
                    name: 'Chicago Bears',
                    sport: 'NFL',
                    wins,
                    losses,
                    ties: ties > 0 ? ties : undefined,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago Bears')) break;
          }
        }
      } catch (err) {
        console.warn('NFL data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // MLB - Cubs
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              const displayName = comp.team?.displayName || '';
              if (displayName.includes('Cubs')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  
                  liveTeams.push({
                    name: 'Chicago Cubs',
                    sport: 'MLB',
                    wins,
                    losses,
                    record: `${wins}-${losses}`,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago Cubs')) break;
          }
        }
      } catch (err) {
        console.warn('Cubs data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // MLB - White Sox
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              const displayName = comp.team?.displayName || '';
              if (displayName.includes('White Sox')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  
                  liveTeams.push({
                    name: 'Chicago White Sox',
                    sport: 'MLB',
                    wins,
                    losses,
                    record: `${wins}-${losses}`,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago White Sox')) break;
          }
        }
      } catch (err) {
        console.warn('White Sox data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // NBA - Bulls
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Bulls')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  
                  liveTeams.push({
                    name: 'Chicago Bulls',
                    sport: 'NBA',
                    wins,
                    losses,
                    record: `${wins}-${losses}`,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago Bulls')) break;
          }
        }
      } catch (err) {
        console.warn('NBA data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // NHL - Blackhawks
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Blackhawks')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  const ties = record.ties || 0;
                  const recordStr = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
                  
                  liveTeams.push({
                    name: 'Chicago Blackhawks',
                    sport: 'NHL',
                    wins,
                    losses,
                    ties: ties > 0 ? ties : undefined,
                    record: recordStr,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago Blackhawks')) break;
          }
        }
      } catch (err) {
        console.warn('NHL data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // MLS - Chicago Fire FC
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Fire')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  
                  liveTeams.push({
                    name: 'Chicago Fire FC',
                    sport: 'MLS',
                    wins,
                    losses,
                    record: `${wins}-${losses}`,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago Fire FC')) break;
          }
        }
      } catch (err) {
        console.warn('MLS data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // WNBA - Chicago Sky
      try {
        const res = await Promise.race([
          fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?limit=1000'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);

        if (res.ok) {
          const data = await res.json();
          const allEvents = data.events || [];
          
          for (const event of allEvents) {
            const competitors = event.competitions?.[0]?.competitors || [];
            for (const comp of competitors) {
              if (comp.team?.displayName?.includes('Sky')) {
                const record = comp.records?.[0];
                if (record) {
                  const wins = record.wins || 0;
                  const losses = record.losses || 0;
                  
                  liveTeams.push({
                    name: 'Chicago Sky',
                    sport: 'WNBA',
                    wins,
                    losses,
                    record: `${wins}-${losses}`,
                    lastUpdated: new Date().toLocaleDateString(),
                    logo: comp.team?.logo,
                    source: 'live'
                  });
                }
                break;
              }
            }
            if (liveTeams.find(t => t.name === 'Chicago Sky')) break;
          }
        }
      } catch (err) {
        console.warn('WNBA data fetch failed, will use cache/fallback:', err);
        hasErrors = true;
      }

      // Merge live data with cache (pass as any to avoid type issue, mergeWithCache handles it)
      const mergedTeams = mergeWithCache(liveTeams as any);

      // If we got ANY live data, cache it
      if (liveTeams.length > 0) {
        setCachedData(mergedTeams);
      }

      // Always set teams to show (either live or from cache/fallback)
      setTeams(mergedTeams);
      setLastFetch(Date.now());

      // Only show error if we got NO data at all
      if (mergedTeams.length === 0) {
        setError('Unable to load sports data');
      } else if (hasErrors) {
        // Show warning if some data failed but we have fallback
        console.warn('Some sports data sources failed, showing cached/fallback data');
        setError(null);
      } else {
        setError(null);
      }

      setLoading(false);

      // Clean up old cache periodically
      clearOldCache();
    } catch (err) {
      console.error('Error fetching sports stats:', err);
      
      // Last resort: try to load from cache via mergeWithCache
      const cachedTeams = mergeWithCache([]);
      if (cachedTeams && cachedTeams.length > 0) {
        setTeams(cachedTeams);
        setLastFetch(Date.now());
        setError(null);
      } else {
        setError('Unable to load sports data');
        setTeams([]);
      }
      
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSportsStats();

    // Refetch every 30 minutes
    const interval = setInterval(fetchSportsStats, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchSportsStats]);

  return { 
    teams, 
    loading, 
    error, 
    lastFetch,
    refetch: fetchSportsStats 
  };
}