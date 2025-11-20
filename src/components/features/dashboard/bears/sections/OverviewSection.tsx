/**
 * src/components/features/bears-dashboard/sections/OverviewSection.tsx
 * 
 * FIXED VERSION - Correct math and calculations
 * 
 * Issues fixed:
 * 1. winPercentage NaN → Calculate locally from wins/losses
 * 2. Loss percentage wrong → Fixed calculation
 * 3. No game data → Placeholder for upcoming/recent games
 */

import React, { useMemo } from 'react';
import StatCard from '../cards/StatCard';
import { TeamStats } from '@/hooks/useSportsStats';

interface OverviewSectionProps {
  stats: TeamStats | null;
  loading?: boolean;
}

/**
 * OverviewSection Component
 * 
 * Displays Bears season overview with proper calculations
 */
export default function OverviewSection({
  stats,
  loading = false,
}: OverviewSectionProps) {
  // CALCULATE ALL STATS LOCALLY
  const calculations = useMemo(() => {
    if (!stats) {
      return {
        totalGames: 0,
        winPercentage: 0,
        winPercentageDisplay: 'N/A',
        lossPercentageDisplay: 'N/A',
      };
    }

    // Total games = wins + losses + ties
    const totalGames = stats.wins + stats.losses + (stats.ties || 0);

    // Win percentage = wins / total games
    const winPercentage = totalGames > 0 ? stats.wins / totalGames : 0;
    const winPercentageDisplay = (winPercentage * 100).toFixed(1);

    // Loss percentage = losses / total games
    const lossPercentage = totalGames > 0 ? stats.losses / totalGames : 0;
    const lossPercentageDisplay = (lossPercentage * 100).toFixed(1);

    return {
      totalGames,
      winPercentage,
      winPercentageDisplay,
      lossPercentageDisplay,
    };
  }, [stats]);

  // LOADING STATE
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">2025 Season Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-50 dark:bg-slate-700 rounded w-1/3 mb-2" />
              <div className="h-8 bg-gray-50 dark:bg-slate-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // NO DATA STATE
  if (!stats) {
    return (
      <div className="bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-slate-300">Season stats currently unavailable</p>
      </div>
    );
  }

  // RENDER
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">2025 Season Overview</h2>

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
          value={`${calculations.winPercentageDisplay}%`}
          subtext={`${stats.wins}-${stats.losses}${stats.ties ? `-${stats.ties}` : ''} overall`}
        />

        {/* CARD 3: Wins */}
        <StatCard
          label="Wins"
          value={stats.wins.toString()}
          subtext={`${calculations.totalGames} total games`}
        />

        {/* CARD 4: Losses */}
        <StatCard
          label="Losses"
          value={stats.losses.toString()}
          subtext={`${calculations.lossPercentageDisplay}% of games`}
        />
      </div>

      {/* Data Source Info */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300 px-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                stats.source === 'live'
                  ? '#10b981'
                  : stats.source === 'cache'
                    ? '#eab308'
                    : '#ef4444',
            }}
          />
          <span>
            Data source: <strong>{stats.source}</strong>
          </span>
        </div>
        <span>Last updated: {stats.lastUpdated}</span>
      </div>
    </div>
  );
}