/**
 * src/hooks/useDebugESPNData.ts
 * ========================================================================
 * DEBUG TOOL: Compare ESPN API Response vs. Expected Data Structure
 * 
 * Use this to see exactly what data ESPN returns and if it matches
 * the fields your component expects.
 * ========================================================================
 */

'use client';

import { useState, useCallback } from 'react';

interface TeamDataInfo {
  id: string;
  displayName: string;
  logo?: string;
  record?: string;
  wins?: number;
  losses?: number;
  ties?: number;
  sport?: string;
  name: string;
  hasLogo?: boolean;
  recordData?: {
    type: string;
    summary: string;
    displayValue: string;
    wins?: number;
    losses?: number;
    ties?: number;
  } | undefined;
  
}

/**
 * Raw ESPN API response structure
 */
export interface RawESPNResponse {
  events?: Array<{
    id: string;
    date: string;
    competitions?: Array<{
      id: string;
      date: string;
      competitors?: Array<{
        id: string;
        type: string;
        displayName: string;
        team?: {
          id: string;
          displayName: string;
          logo?: string;
        };
        records?: Array<{
          type: string;
          summary: string;
          displayValue: string;
          wins?: number;
          losses?: number;
          ties?: number;
        }>;
      }>;
    }>;
  }>;
}

export interface DebugInfo {
  endpoint: string;
  status: 'fetching' | 'success' | 'error';
  rawResponse: RawESPNResponse | null;
  bearsFound: boolean;
  bearsData: {
    displayName: string | null;
    team?: {
      displayName: string | null;
      logo: string | null;
    };
    record: {
      summary: string | null;
      displayValue: string | null;
      wins: number | null;
      losses: number | null;
      ties: number | null;
    } | null;
  } | null;
  error: string | null;
  timestamp: number;
}

/**
 * Debug hook to inspect ESPN API data
 * Returns raw response and parsed Bears data for comparison
 */
export function useDebugESPNData() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [allTeamsInfo, setAllTeamsInfo] = useState<TeamDataInfo[]>([]);

  /**
   * Fetch and log NFL data
   */
  const debugNFLData = useCallback(async () => {
    try {
      setDebugInfo({
        endpoint: 'NFL Scoreboard',
        status: 'fetching',
        rawResponse: null,
        bearsFound: false,
        bearsData: null,
        error: null,
        timestamp: Date.now(),
      });

      console.log('%c🏈 Fetching NFL Data from ESPN...', 'color: blue; font-size: 14px; font-weight: bold;');

      const response = await fetch(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?limit=1000'
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: RawESPNResponse = await response.json();

      // Log raw response
      console.log('%c📊 Raw ESPN API Response:', 'color: green; font-size: 12px; font-weight: bold;');
      console.log(JSON.stringify(data, null, 2));

      // Find Bears data
      let bearsFound = false;
      let bearsData = null;
      const teams: TeamDataInfo[] = [];

      if (data.events) {
        for (const event of data.events) {
          const competitors = event.competitions?.[0]?.competitors || [];
          
          for (const comp of competitors) {
            const teamName = comp.team?.displayName || comp.displayName || 'Unknown';
            
            // Log each team found
            console.log(`%c👥 Found Team: ${teamName}`, 'color: purple; font-size: 11px;');
            
            teams.push({
              id: comp.team?.id || comp.id || 'unknown-id',
              displayName: comp.team?.displayName || comp.displayName || teamName,
              name: teamName,
              hasLogo: !!comp.team?.logo,
              logo: comp.team?.logo,
              recordData: comp.records?.[0],
              record: comp.records?.[0]?.displayValue || undefined,
            });

            // Check if this is Bears
                        if (teamName.includes('Bears') || comp.team?.displayName?.includes('Bears')) {
                          bearsFound = true;
                          const record = comp.records?.[0];
            
                          bearsData = {
                            displayName: comp.team?.displayName ?? null,
                            team: {
                              displayName: comp.team?.displayName ?? null,
                              logo: comp.team?.logo ?? null,
                            },
                            record: record
                              ? {
                                  summary: record.summary ?? null,
                                  displayValue: record.displayValue ?? null,
                                  wins: record.wins ?? null,
                                  losses: record.losses ?? null,
                                  ties: record.ties ?? null,
                                }
                              : null,
                          };
            
                          console.log('%c🐻 BEARS DATA FOUND!', 'color: orange; font-size: 14px; font-weight: bold;');
                          console.log('%cBears Record:', 'color: orange; font-weight: bold;');
                          console.log(bearsData);
                        }
          }
        }
      }

      setDebugInfo({
        endpoint: 'NFL Scoreboard',
        status: 'success',
        rawResponse: data,
        bearsFound,
        bearsData,
        error: null,
        timestamp: Date.now(),
      });

      setAllTeamsInfo(teams);

      if (!bearsFound) {
        console.warn('%c⚠️  Bears NOT found in NFL data!', 'color: red; font-size: 12px; font-weight: bold;');
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('%c❌ Error fetching NFL data:', 'color: red; font-size: 12px; font-weight: bold;', error);

      setDebugInfo({
        endpoint: 'NFL Scoreboard',
        status: 'error',
        rawResponse: null,
        bearsFound: false,
        bearsData: null,
        error,
        timestamp: Date.now(),
      });
    }
  }, []);

  /**
   * Compare expected vs. actual fields
   */
  const compareFields = useCallback(() => {
    if (!debugInfo?.bearsData) {
      console.warn('No Bears data to compare');
      return;
    }

    const expected = {
      name: 'Chicago Bears (string)',
      sport: 'NFL (string)',
      wins: '(number)',
      losses: '(number)',
      ties: '(number or undefined)',
      record: '5-12 (string format)',
      lastUpdated: new Date().toLocaleDateString(),
      logo: 'https://... (string or null)',
      source: 'live | cache | fallback',
    };

    const actual = debugInfo.bearsData;

    console.table({
      Field: Object.keys(expected),
      Expected: Object.values(expected),
      Actual: Object.values(actual),
    });

    return {
      expected,
      actual,
    };
  }, [debugInfo]);

  /**
   * Get formatted Bears data (what your component should receive)
   */
  const getFormattedBearsData = useCallback(() => {
    if (!debugInfo?.bearsData?.record) {
      return null;
    }

    const record = debugInfo.bearsData.record;
    const wins = record.wins ?? 0;
    const losses = record.losses ?? 0;
    const ties = record.ties ?? 0;
    const recordStr = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;

    return {
      name: 'Chicago Bears',
      sport: 'NFL',
      wins,
      losses,
      ties: ties > 0 ? ties : undefined,
      record: recordStr,
      lastUpdated: new Date().toLocaleDateString(),
      logo: debugInfo.bearsData.team?.logo || undefined,
      source: 'live' as const,
    };
  }, [debugInfo]);

  return {
    debugInfo,
    allTeamsInfo,
    debugNFLData,
    compareFields,
    getFormattedBearsData,
  };
}

/**
 * ========================================================================
 * USAGE IN YOUR COMPONENT
 * ========================================================================
 * 
 * 'use client';
 * import { useDebugESPNData } from '@/hooks/useDebugESPNData';
 * 
 * export function DebugComponent() {
 *   const {
 *     debugInfo,
 *     allTeamsInfo,
 *     debugNFLData,
 *     compareFields,
 *     getFormattedBearsData,
 *   } = useDebugESPNData();
 * 
 *   return (
 *     <div className="p-4 bg-slate-900 text-white rounded">
 *       <button
 *         onClick={debugNFLData}
 *         className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
 *       >
 *         Fetch & Debug NFL Data
 *       </button>
 * 
 *       {debugInfo && (
 *         <div className="mt-4 space-y-4">
 *           <div>
 *             <h3 className="font-bold mb-2">Debug Status:</h3>
 *             <p>Status: {debugInfo.status}</p>
 *             <p>Bears Found: {debugInfo.bearsFound ? '✅ YES' : '❌ NO'}</p>
 *             <p>Teams Count: {allTeamsInfo.length}</p>
 *           </div>
 * 
 *           {debugInfo.bearsData && (
 *             <div className="bg-slate-800 p-3 rounded">
 *               <h3 className="font-bold mb-2">Bears Data Found:</h3>
 *               <pre className="text-xs overflow-auto">
 *                 {JSON.stringify(debugInfo.bearsData, null, 2)}
 *               </pre>
 *             </div>
 *           )}
 * 
 *           {debugInfo.error && (
 *             <div className="bg-red-900 p-3 rounded">
 *               <h3 className="font-bold mb-2">Error:</h3>
 *               <p>{debugInfo.error}</p>
 *             </div>
 *           )}
 * 
 *           <button
 *             onClick={() => {
 *               compareFields();
 *               console.log('Formatted:', getFormattedBearsData());
 *             }}
 *             className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
 *           >
 *             Compare Fields (see console)
 *           </button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */