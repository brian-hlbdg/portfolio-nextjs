/**
 * src/components/features/bears-dashboard/sections/PlayerStatsSection.tsx
 * 
 * IMPORTANT CODE CONCEPT: Handling Unavailable Data
 * 
 * This section demonstrates UX best practices when data isn't available:
 * - Clear messaging instead of errors
 * - Explanatory text about why data may be unavailable
 * - Future-proofed (easy to add player data when available)
 * - No mock data - honest about limitations
 */

import React from 'react';
import { BearsPlayerStats } from '@/components/features/types/bears.types';

interface PlayerStatsSectionProps {
  playerStats: BearsPlayerStats[];
  loading?: boolean;
}

/**
 * PlayerStatsSection Component
 * 
 * Displays individual player statistics when available
 * Currently shows "unavailable" state as ESPN API has limitations
 * 
 * When player stats become available from API:
 * 1. Replace content in this component
 * 2. Add filtering/sorting options
 * 3. Create individual PlayerStatCard component
 */
export default function PlayerStatsSection({
  playerStats,
  loading = false,
}: PlayerStatsSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-slate-700 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-slate-700 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Player stats currently unavailable via ESPN API
  // Placeholder for future integration
  if (playerStats.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Player Statistics</h2>

        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 text-center">
          <div className="mb-3">
            <p className="text-blue-200 font-semibold mb-2">
              Player statistics currently unavailable
            </p>
            <p className="text-blue-300 text-sm">
              ESPN API has limited player-level statistics access. We're working on
              alternative sources to bring you detailed player performance data.
            </p>
          </div>

          <div className="text-xs text-blue-400 mt-4 border-t border-blue-500/30 pt-4">
            <p>
              When available, you'll see stats for passing yards, rushing yards,
              receiving statistics, and defensive performance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Once player stats are available, display them here
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Player Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playerStats.map((player) => (
          <div
            key={player.id}
            className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/60 transition-all"
          >
            {/* Player Info */}
            <div className="flex items-center gap-3 mb-3">
              <div>
                <p className="font-semibold text-white">{player.name}</p>
                <p className="text-sm text-slate-400">
                  #{player.number} {player.position}
                </p>
              </div>
            </div>

            {/* Stats (dynamic based on position) */}
            <div className="space-y-2 text-sm">
              {player.stats.passing && (
                <div className="text-slate-300">
                  <span className="text-slate-500">Passing:</span>{' '}
                  {player.stats.passing.completions}/{player.stats.passing.attempts}{' '}
                  {player.stats.passing.yards} yds
                </div>
              )}
              {player.stats.rushing && (
                <div className="text-slate-300">
                  <span className="text-slate-500">Rushing:</span>{' '}
                  {player.stats.rushing.attempts} att, {player.stats.rushing.yards} yds
                </div>
              )}
              {player.stats.receiving && (
                <div className="text-slate-300">
                  <span className="text-slate-500">Receiving:</span>{' '}
                  {player.stats.receiving.receptions} rec, {player.stats.receiving.yards} yds
                </div>
              )}
              {player.stats.defense && (
                <div className="text-slate-300">
                  <span className="text-slate-500">Defense:</span>{' '}
                  {player.stats.defense.tackles} tackles
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}