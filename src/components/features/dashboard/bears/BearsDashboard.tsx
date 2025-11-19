/**
 * src/components/features/bears-dashboard/BearsDashboard.tsx - FIXED
 * ========================================================================
 * Now includes schedule fetching and passes data to ScheduleSection
 * ========================================================================
 */

'use client';

import React, { useMemo } from 'react';
import { useSportsStats, TeamStats } from '@/hooks/useSportsStats';
import { useTeamSchedule } from '@/hooks/useTeamSchedule';
import BearsDashboardHeader from './header/BearsDashboardHeader';
import OverviewSection from './sections/OverviewSection';
import ScheduleSection from './sections/ScheduleSection';
import PlayerStatsSection from './sections/PlayerStatsSection';

export default function BearsDashboard() {
  // ✅ Fetch season stats
  const {
    teams,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useSportsStats();

  // ✅ Fetch schedule
  const {
    scheduleData,
    loading: scheduleLoading,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useTeamSchedule('bears');

  // ✅ Find Bears in teams array (return null when not found to match OverviewSection prop)
  const bearsStats = useMemo((): TeamStats | null => {
    return teams.find((team: TeamStats) => team.name === 'Chicago Bears') || null;
  }, [teams]);

  // Separate upcoming and past games
  const upcomingGames = useMemo(() => {
    return scheduleData?.games?.filter(g => g.status === 'scheduled') || [];
  }, [scheduleData]);

  const recentGames = useMemo(() => {
    return scheduleData?.games?.filter(g => g.status === 'final') || [];
  }, [scheduleData]);

  // Overall state
  const loading = statsLoading || scheduleLoading;
  const error = statsError || scheduleError;
  const lastUpdated = bearsStats?.lastUpdated || new Date().toLocaleDateString();

  const refetch = async () => {
    await Promise.all([refetchStats(), refetchSchedule()]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
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
          <OverviewSection stats={bearsStats} loading={statsLoading} />
        </section>

        {/* Section 2: Upcoming Games */}
        <section>
          <ScheduleSection upcomingGames={upcomingGames} loading={scheduleLoading} />
        </section>

        {/* Section 3: Recent Results */}

        {/* Section 4: Player Stats */}
        <section>
          <PlayerStatsSection playerStats={[]} loading={false} />
        </section>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-xs text-gray-400 space-y-2">
            <p>
              <strong>Bears Stats:</strong> {bearsStats ? 'Loaded' : 'None'} (
              {bearsStats?.record})
            </p>
            <p>
              <strong>Upcoming Games:</strong> {upcomingGames.length} games
            </p>
            <p>
              <strong>Recent Results:</strong> {recentGames.length} games
            </p>
            <p>
              <strong>Stats Loading:</strong> {statsLoading ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Schedule Loading:</strong> {scheduleLoading ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Stats Error:</strong> {statsError || 'None'}
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