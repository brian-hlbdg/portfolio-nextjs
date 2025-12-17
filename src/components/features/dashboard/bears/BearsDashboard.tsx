/**
 * src/components/features/dashboard/bears/BearsDashboard.tsx
 * ========================================================================
 * CLEANED UP: Removed useSportsStats dependency
 * 
 * Changes:
 * - Removed useSportsStats() call (was fetching all 7 Chicago teams)
 * - Now uses useBearsStats() exclusively for Bears data
 * - Cleaner separation - Bears dashboard only fetches Bears data
 * ========================================================================
 */

'use client';

import React, { useMemo } from 'react';
import { useTeamSchedule } from '@/hooks/useTeamSchedule';
import { useBearsStats } from '@/hooks/useBearsStats';
import BearsDashboardHeader from './header/BearsDashboardHeader';
import OverviewSection from './sections/OverviewSection';
import ScheduleSection from './sections/ScheduleSection';
import PlayerStatsSection from './sections/PlayerStatsSection';
import RosterSection from './sections/RosterSection';
import { TeamStatsSection } from './sections/TeamStatsSection';
import { GameSummarySection } from './sections/GameSummarySection';


export default function BearsDashboard() {
  // ✅ Get Bears stats and NFL team records from Bears-specific hook
  const {
    seasonStats,
    nflTeamRecords,
    loading: bearsLoading,
    error: bearsStatsError,
    refetch: refetchBearsStats,
  } = useBearsStats();

  // ✅ Fetch Bears schedule
  const {
    scheduleData,
    loading: scheduleLoading,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useTeamSchedule('bears');

  // ✅ Convert seasonStats to the format OverviewSection expects
  // OverviewSection expects TeamStats type with: name, sport, wins, losses, record, etc.
  const bearsStats = useMemo(() => {
    if (!seasonStats) return null;
    
    // Parse wins/losses from record string if the individual values are 0
    // This handles cases where ESPN returns record string but not individual stats
    let wins = seasonStats.wins;
    let losses = seasonStats.losses;
    let ties = seasonStats.ties;
    
    if ((wins === 0 && losses === 0) && seasonStats.record) {
      const parts = seasonStats.record.split('-').map(Number);
      if (parts.length >= 2) {
        wins = parts[0] || 0;
        losses = parts[1] || 0;
        ties = parts[2] || 0;
      }
    }
    
    return {
      name: 'Chicago Bears',
      sport: 'NFL',
      wins,
      losses,
      ties,
      record: seasonStats.record,
      lastUpdated: new Date().toLocaleDateString(),
      source: 'live' as const,
    };
  }, [seasonStats]);

  // Separate upcoming and past games
  const upcomingGames = useMemo(() => {
    return scheduleData?.games?.filter(g => g.status === 'scheduled') || [];
  }, [scheduleData]);

  const recentGames = useMemo(() => {
    return scheduleData?.games?.filter(g => g.status === 'final') || [];
  }, [scheduleData]);

  // Overall loading state
  const loading = bearsLoading || scheduleLoading;

  // Bears-specific error handling
  const error = useMemo((): string | null => {
    if (scheduleError) {
      return `Schedule: ${scheduleError}`;
    }
    if (bearsStatsError) {
      return bearsStatsError;
    }
    return null;
  }, [scheduleError, bearsStatsError]);

  const lastUpdated = bearsStats?.lastUpdated || new Date().toLocaleDateString();

  const refetch = async () => {
    await Promise.all([refetchBearsStats(), refetchSchedule()]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <BearsDashboardHeader
        error={error}
        onRefetch={refetch}
        lastUpdated={lastUpdated}
        loading={loading}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Section 1: Overview Stats */}
        <section>
          <OverviewSection stats={bearsStats} loading={bearsLoading} />
        </section>

        {/* Section 2: Upcoming Games */}
        <section>
          <ScheduleSection 
            upcomingGames={upcomingGames} 
            loading={scheduleLoading} 
            nflTeamRecords={nflTeamRecords} 
          />
        </section>

        {/* Section 3: Game Summary */}
        <section>
          <GameSummarySection teamId="bears" />
        </section>

        {/* Section 4: Team Stats */}
        <section>
          <TeamStatsSection teamId="bears" teamName="Chicago Bears" />
        </section>

        {/* Section 5: Roster */}
        <section>
          <RosterSection />
        </section>

        {/* Section 6: Player Stats */}
        <section>
          <PlayerStatsSection playerStats={[]} loading={false} />
        </section>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400 space-y-2">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Debug Info</p>
            <p>
              <strong>Bears Stats:</strong> {bearsStats ? '✅ Loaded' : '❌ None'}
              {bearsStats && ` (${bearsStats.record})`}
            </p>
            <p>
              <strong>NFL Team Records:</strong> {nflTeamRecords?.size || 0} teams
            </p>
            <p>
              <strong>Upcoming Games:</strong> {upcomingGames.length} games
            </p>
            <p>
              <strong>Recent Results:</strong> {recentGames.length} games
            </p>
            <p>
              <strong>Bears Loading:</strong> {bearsLoading ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Schedule Loading:</strong> {scheduleLoading ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Bears Stats Error:</strong> {bearsStatsError || 'None'}
            </p>
            <p>
              <strong>Schedule Error:</strong> {scheduleError || 'None'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}