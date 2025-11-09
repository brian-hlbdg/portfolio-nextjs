'use client';

import React from 'react';
import { useBearsStats } from '@/hooks/useBearsStats';
import BearsDashboardHeader from './header/BearsDashboardHeader';
import OverviewSection from './sections/OverviewSection';
import ScheduleSection from './sections/ScheduleSection';
import PlayerStatsSection from './sections/PlayerStatsSection';
import DebugESPNData from '@/components/debug/DebugESPNData';

export default function BearsDashboard() {
  // Call hook¸¸¸
  const stats = useBearsStats();

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
        error={stats.error}
        onRefetch={stats.refetch}
        lastUpdated={stats.lastUpdated}
        loading={stats.loading}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Overview Section */}
        <section>
          <OverviewSection stats={stats.seasonStats} loading={stats.loading} />
        </section>

        {/* Schedule Section */}
        <section>
          <ScheduleSection
            upcomingGames={stats.upcomingGames}
            recentGames={stats.recentGames}
            loading={stats.loading}
          />
        </section>

        {/* Player Stats Section */}
        <section>
          <PlayerStatsSection playerStats={stats.playerStats} loading={stats.loading} />
        </section>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-xs text-gray-400 space-y-2">
            <p>
              <strong>Stats:</strong> {stats.seasonStats ? 'Loaded' : 'None'}
            </p>
            <p>
              <strong>Games:</strong> {stats.upcomingGames.length + stats.recentGames.length} total
            </p>
            <p>
              <strong>Loading:</strong> {stats.loading ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Error:</strong> {stats.error || 'None'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}