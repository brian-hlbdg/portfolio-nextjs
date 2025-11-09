'use client';

import React, { useMemo } from 'react';
import { useSportsStats, TeamStats } from '@/hooks/useSportsStats';
import BearsDashboardHeader from './header/BearsDashboardHeader';
import OverviewSection from './sections/OverviewSection';
import ScheduleSection from './sections/ScheduleSection';
import PlayerStatsSection from './sections/PlayerStatsSection';
import DebugESPNData from '@/components/debug/DebugESPNData';

export default function BearsDashboard() {
  // ✅ Call useSportsStats directly - no intermediate hook needed!
  const { teams, loading, error, refetch } = useSportsStats();

  // ✅ Find Bears in the teams array
  const bearsStats = useMemo((): TeamStats | null => {
    return teams.find((team: TeamStats) => team.name === 'Chicago Bears') ?? null;
  }, [teams]);

  // Format last updated
  const lastUpdated = bearsStats?.lastUpdated || new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Glow Elements */}
      <DebugESPNData />
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
        {/* Overview Section */}
        <section>
          <OverviewSection stats={bearsStats} loading={loading} />
        </section>

        {/* Schedule Section */}
        <section>
          <ScheduleSection
            upcomingGames={[]}
            recentGames={[]}
            loading={loading}
          />
        </section>

        {/* Player Stats Section */}
        <section>
          <PlayerStatsSection playerStats={[]} loading={loading} />
        </section>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-xs text-gray-400 space-y-2">
            <p>
              <strong>Bears Data:</strong> {bearsStats ? 'Loaded' : 'None'}
            </p>
            <p>
              <strong>Record:</strong> {bearsStats?.record || 'N/A'}
            </p>
            <p>
              <strong>Source:</strong> {bearsStats?.source || 'N/A'}
            </p>
            <p>
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Error:</strong> {error || 'None'}
            </p>
            <p>
              <strong>Total Teams Loaded:</strong> {teams.length}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}