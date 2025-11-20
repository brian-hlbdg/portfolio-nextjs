/**
 * src/components/debug/RosterDiagnostic.tsx
 * ========================================================================
 * DIAGNOSTIC TOOL: See exactly what ESPN returns and how we parse it
 * 
 * Shows:
 * 1. Raw ESPN API response
 * 2. What fields we're looking for
 * 3. Whether data validates
 * 4. Parsed player output
 */

'use client';

import React, { useState } from 'react';

const ENDPOINTS = {
  primary: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/3/roster',
  secondary: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/3?enable=roster',
  tertiary: 'https://site.web.api.espn.com/apis/common/v2/sports/football/nfl/teams/3',
};

interface DiagnosticResult {
  endpoint: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  rawData?: unknown;
  structure?: string;
  rosterArray?: unknown[];
  validPlayers?: number;
  samplePlayer?: unknown;
}

export default function RosterDiagnostic() {
  const [results, setResults] = useState<Record<string, DiagnosticResult>>({});

  const testEndpoint = async (key: string, endpoint: string): Promise<void> => {
    setResults((prev) => ({
      ...prev,
      [key]: { endpoint, status: 'loading' },
    }));

    try {
      console.log(`\n🔍 Testing ${key}: ${endpoint}`);

      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: unknown = await response.json();
      console.log('Raw response:', data);

      let structure = 'Unknown';
      let rosterArray: unknown[] = [];
      let validPlayers = 0;
      let samplePlayer: unknown = null;

      // Try to find roster array
      if (typeof data === 'object' && data !== null) {
        const dataObj = data as Record<string, unknown>;

        // Check direct array
        if (Array.isArray(data)) {
          console.log('✓ Response is array');
          structure = 'Direct array';
          rosterArray = data;
        }
        // Check team.roster
        else if ('team' in dataObj && typeof dataObj.team === 'object') {
          const team = dataObj.team as Record<string, unknown>;
          const teamKeys = Object.keys(team);
          console.log('✓ Has team object, keys:', teamKeys);

          // Try common roster property names
          const rosterCandidates = ['roster', 'athletes', 'players', 'squad', 'members'];
          for (const key of rosterCandidates) {
            if (key in team && Array.isArray((team as Record<string, unknown>)[key])) {
              console.log(`✓ Found roster at team.${key}`);
              structure = `team.${key} (array)`;
              rosterArray = (team as Record<string, unknown>)[key] as unknown[];
              break;
            }
          }

          // If not found, show what we have
          if (rosterArray.length === 0) {
            console.log('Available team properties:', team);
            structure = `team object with keys: ${teamKeys.slice(0, 5).join(', ')}`;
          }
        }
        // Check plain roster
        else if ('roster' in dataObj && Array.isArray(dataObj.roster)) {
          console.log('✓ Has roster array');
          structure = 'roster (array)';
          rosterArray = dataObj.roster;
        }
        // Check sports.leagues.teams
        else if ('sports' in dataObj && Array.isArray(dataObj.sports)) {
          console.log('✓ Has sports array');
          const sports = dataObj.sports as Array<Record<string, unknown>>;
          for (const sport of sports) {
            if ('leagues' in sport && Array.isArray(sport.leagues)) {
              const leagues = sport.leagues as Array<Record<string, unknown>>;
              for (const league of leagues) {
                if ('teams' in league && Array.isArray(league.teams)) {
                  const teams = league.teams as Array<Record<string, unknown>>;
                  for (const team of teams) {
                    if ('roster' in team && Array.isArray(team.roster)) {
                      structure = 'sports.leagues.teams[].roster (nested)';
                      rosterArray = team.roster;
                      break;
                    }
                  }
                  if (rosterArray.length > 0) break;
                }
              }
              if (rosterArray.length > 0) break;
            }
          }
        }
        // Show available keys
        else {
          const keys = Object.keys(dataObj);
          console.log('Available top-level keys:', keys);
          structure = `Object with keys: ${keys.slice(0, 5).join(', ')}`;
        }
      }

      // Validate players
      if (rosterArray.length > 0) {
        console.log(`Found ${rosterArray.length} roster items`);

        for (const item of rosterArray) {
          if (typeof item === 'object' && item !== null) {
            const player = item as Record<string, unknown>;

            // Check for required fields
            const hasRequired =
              'playerId' in player &&
              'displayName' in player &&
              'jersey' in player &&
              'position' in player &&
              'status' in player;

            if (hasRequired) {
              validPlayers++;
              if (!samplePlayer) {
                samplePlayer = player;
              }
            } else {
              console.log('Invalid player (missing fields):', Object.keys(player));
            }
          }
        }

        console.log(`✓ Valid players: ${validPlayers}/${rosterArray.length}`);
        console.log('Sample player:', samplePlayer);
      }

      setResults((prev) => ({
        ...prev,
        [key]: {
          endpoint,
          status: 'success',
          rawData: data,
          structure,
          rosterArray,
          validPlayers,
          samplePlayer,
        },
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error: ${errorMsg}`);

      setResults((prev) => ({
        ...prev,
        [key]: {
          endpoint,
          status: 'error',
          error: errorMsg,
        },
      }));
    }
  };

  const runAllTests = async (): Promise<void> => {
    for (const [key, endpoint] of Object.entries(ENDPOINTS)) {
      await testEndpoint(key, endpoint);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Roster API Diagnostic</h2>
          <button
            onClick={runAllTests}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Run All Tests
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          This tool tests each ESPN endpoint and shows what data structure is returned.
          Check the browser console (F12) for detailed logs.
        </p>

        <div className="space-y-6">
          {Object.entries(results).map(([key, result]) => (
            <div
              key={key}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-white">{key}</h3>
                  <p className="text-xs text-slate-400 mt-1 break-all">{result.endpoint}</p>
                </div>

                {result.status === 'loading' && (
                  <div className="text-blue-400">Loading...</div>
                )}
                {result.status === 'error' && (
                  <div className="text-red-400">❌ Error</div>
                )}
                {result.status === 'success' && (
                  <div className="text-green-400">✅ Success</div>
                )}
              </div>

              {/* Error */}
              {result.error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded p-3">
                  <p className="text-red-300 text-sm">{result.error}</p>
                </div>
              )}

              {/* Success Details */}
              {result.status === 'success' && (
                <div className="space-y-3">
                  {/* Structure */}
                  <div className="bg-slate-700/30 rounded p-3">
                    <p className="text-xs text-slate-400 mb-1">Response Structure:</p>
                    <p className="text-white font-mono text-sm">{result.structure}</p>
                  </div>

                  {/* Stats */}
                  {result.rosterArray && result.rosterArray.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/30 rounded p-3">
                        <p className="text-xs text-slate-400">Total Items</p>
                        <p className="text-lg font-bold text-white">
                          {result.rosterArray.length}
                        </p>
                      </div>
                      <div className="bg-slate-700/30 rounded p-3">
                        <p className="text-xs text-slate-400">Valid Players</p>
                        <p className="text-lg font-bold text-green-400">
                          {result.validPlayers}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Sample Player */}
                  {result.samplePlayer && (
                    <div className="bg-slate-700/20 rounded p-3">
                      <p className="text-xs text-slate-400 mb-2">Sample Player:</p>
                      <pre className="text-xs text-slate-300 overflow-x-auto max-h-64">
                        {JSON.stringify(result.samplePlayer, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* No Valid Players Warning */}
                  {result.rosterArray && result.rosterArray.length > 0 && result.validPlayers === 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/50 rounded p-3">
                      <p className="text-yellow-300 text-sm">
                        ⚠️ Found roster array but no valid players. Data structure might be different.
                        Check sample above for available fields.
                      </p>
                    </div>
                  )}

                  {/* No Roster Array Warning */}
                  {(!result.rosterArray || result.rosterArray.length === 0) && (
                    <div className="bg-yellow-500/10 border border-yellow-500/50 rounded p-3">
                      <p className="text-yellow-300 text-sm">
                        ⚠️ Could not find roster array in response. Endpoint might be returning
                        unexpected format. Check raw data in browser console.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <h3 className="font-bold text-blue-300 mb-2">How to Use</h3>
        <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
          <li>Click "Run All Tests" above</li>
          <li>Wait for all 3 endpoints to complete</li>
          <li>Look for ✅ Success (green)</li>
          <li>Check the "Valid Players" number</li>
          <li>If any shows valid players, that's the endpoint that works</li>
          <li>Copy the "Sample Player" structure</li>
          <li>Share the working endpoint and sample with me</li>
        </ol>
      </div>
    </div>
  );
}