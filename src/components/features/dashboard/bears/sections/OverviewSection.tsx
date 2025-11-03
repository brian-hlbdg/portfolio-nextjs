/**
 * src/components/features/bears-dashboard/sections/OverviewSection.tsx
 * 
 * IMPORTANT CODE CONCEPT: Section Component
 * 
 * This demonstrates:
 * - Composition pattern: uses StatCard components
 * - Separation of concerns: fetches in parent, displays here
 * - Conditional rendering for unavailable data
 * - Clean prop interface
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
 * Displays current season overview:
 * - Record (W-L)
 * - Win percentage
 * - Points for/against
 * 
 * Handles loading and unavailable states gracefully
 */
export default function OverviewSection({
  stats,
  loading = false,
}: OverviewSectionProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-5 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
            <div className="h-8 bg-slate-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 text-center">
        <p className="text-slate-400">Season stats currently unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">2024 Season Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Record */}
        <StatCard
          label="Record"
          value={stats.record}
          badge={`${stats.wins} Wins`}
          badgeColor="orange"
          variant="highlight"
        />

        {/* Win Percentage */}
        <StatCard
          label="Win Percentage"
          value={`${(stats.winPercentage * 100).toFixed(1)}%`}
          subtext={`${stats.wins}-${stats.losses} overall`}
        />

        {/* Points For */}
        <StatCard
          label="Points For"
          value={stats.pointsFor}
          subtext="total this season"
        />

        {/* Points Against */}
        <StatCard
          label="Points Against"
          value={stats.pointsAgainst}
          subtext="total this season"
        />
      </div>
    </div>
  );
}