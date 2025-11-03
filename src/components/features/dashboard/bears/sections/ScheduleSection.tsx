/**
 * src/components/features/bears-dashboard/sections/ScheduleSection.tsx
 * 
 * IMPORTANT CODE CONCEPT: Conditional Rendering & Empty States
 * 
 * Shows:
 * - Upcoming games (next 5)
 * - Recent games (last 3)
 * 
 * Handles:
 * - Empty schedule
 * - Loading state
 * - No data available
 */

import React, { useMemo } from 'react';
import GameCard from '../cards/GameCard';
import { BearsGame } from '@/components/features/types/bears.types';

interface ScheduleSectionProps {
  upcomingGames: BearsGame[];
  recentGames: BearsGame[];
  loading?: boolean;
}

/**
 * ScheduleSection Component
 * 
 * Displays Bears schedule with upcoming and recent games
 * Automatically limits display (next 5 upcoming, last 3 recent)
 */
export default function ScheduleSection({
  upcomingGames,
  recentGames,
  loading = false,
}: ScheduleSectionProps) {
  // Limit displayed games for readability
  const displayUpcoming = useMemo(
    () => upcomingGames.slice(0, 5),
    [upcomingGames]
  );

  const displayRecent = useMemo(
    () => recentGames.slice(0, 3),
    [recentGames]
  );

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(2)].map((_, section) => (
          <div key={section}>
            <div className="h-6 bg-slate-700 rounded w-1/4 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 animate-pulse"
                >
                  <div className="h-4 bg-slate-700 rounded mb-2" />
                  <div className="h-8 bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upcoming Games */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Upcoming Games</h2>

        {upcomingGames.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 text-center">
            <p className="text-slate-400">No upcoming games scheduled</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayUpcoming.map((game) => (
              <GameCard key={game.id} game={game} variant="upcoming" />
            ))}
            {upcomingGames.length > 5 && (
              <div className="md:col-span-2 text-center text-slate-500 text-sm pt-2">
                +{upcomingGames.length - 5} more games
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Games */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Results</h2>

        {recentGames.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 text-center">
            <p className="text-slate-400">No recent games to display</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayRecent.map((game) => (
              <GameCard key={game.id} game={game} variant="recent" />
            ))}
            {recentGames.length > 3 && (
              <div className="md:col-span-2 text-center text-slate-500 text-sm pt-2">
                +{recentGames.length - 3} more games
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}