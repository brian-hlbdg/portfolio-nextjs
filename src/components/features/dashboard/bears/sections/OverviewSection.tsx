/**
 * src/components/features/bears-dashboard/sections/OverviewSection.tsx
 * 
 * CORRECTED VERSION - Uses ONLY fields that exist in BearsSeasonStats
 * 
 * This demonstrates:
 * - Composition pattern: uses StatCard components
 * - Separation of concerns: fetches in parent, displays here
 * - Conditional rendering for unavailable data
 * - Clean prop interface
 * - Uses ONLY: wins, losses, record, winPercentage, source, lastUpdated
 * 
 * Location in code:
 * Line 1-80: Imports and type definitions
 * Line 82-95: Loading skeleton state
 * Line 97-103: No data state
 * Line 105-160: Main render with stat cards
 */

import React from 'react';
import StatCard from '../cards/StatCard';
import { BearsSeasonStats } from '@/components/features/types/bears.types';

interface OverviewSectionProps {
  stats: BearsSeasonStats | null;
  loading?: boolean;
}

/**
 * OverviewSection Component
 * 
 * Displays current season overview using available BearsSeasonStats fields:
 * - Record (W-L) - from stats.record string
 * - Win percentage - from stats.winPercentage (0-1 range)
 * - Wins breakdown - from stats.wins number
 * - Losses breakdown - from stats.losses number
 * 
 * Handles loading and unavailable states gracefully
 */
export default function OverviewSection({
  stats,
  loading = false,
}: OverviewSectionProps) {
  // LOADING STATE
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">2024 Season Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-5 animate-pulse"
            >
              <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
              <div className="h-8 bg-slate-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // NO DATA STATE
  if (!stats) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 text-center">
        <p className="text-slate-400">Season stats currently unavailable</p>
      </div>
    );
  }

  // CALCULATE DERIVED VALUES
  // Calculate total games played
  const totalGames = stats.wins + stats.losses + (stats.ties || 0);
  
  // Convert winPercentage from decimal (0-1) to percentage display
  const winPercentageDisplay = (stats.winPercentage * 100).toFixed(1);
  
  // Calculate losses percentage
  const lossPercentageDisplay = totalGames > 0
    ? ((stats.losses / totalGames) * 100).toFixed(1)
    : '0';

  // RENDER
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">2024 Season Overview</h2>

      {/* Main Stats Grid - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Record */}
        <StatCard
          label="Record"
          value={stats.record}
          badge={`${stats.wins}W`}
          badgeColor="orange"
          variant="highlight"
        />

        {/* CARD 2: Win Percentage */}
        <StatCard
          label="Win Percentage"
          value={`${winPercentageDisplay}%`}
          subtext={`${stats.wins}-${stats.losses}${stats.ties ? `-${stats.ties}` : ''} overall`}
        />

        {/* CARD 3: Wins */}
        <StatCard
          label="Wins"
          value={stats.wins.toString()}
          subtext={`${totalGames} total games`}
        />

        {/* CARD 4: Losses */}
        <StatCard
          label="Losses"
          value={stats.losses.toString()}
          subtext={`${lossPercentageDisplay}% of games`}
        />
      </div>

      {/* Data Source Info - Shows where data came from and when */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{
            backgroundColor: stats.source === 'live' ? '#10b981' : stats.source === 'cache' ? '#eab308' : '#ef4444'
          }} />
          <span>Data source: <strong>{stats.source}</strong></span>
        </div>
        <span>Last updated: {stats.lastUpdated}</span>
      </div>
    </div>
  );
}