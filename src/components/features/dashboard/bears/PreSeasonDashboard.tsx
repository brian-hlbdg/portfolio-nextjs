'use client';

import React, { useMemo } from 'react';
import { ScheduleData, useTeamSchedule } from '@/hooks/useTeamSchedule';
import { NFLTeamRecord } from '@/hooks/useBearsStats';
import BearsDashboardHeader from './header/BearsDashboardHeader';
import SeasonCountdownSection from './sections/SeasonCountdownSection';
import PreSeasonScheduleSection from './sections/PreSeasonScheduleSection';
import RosterSection from './sections/RosterSection';
import TeamNewsSection from './sections/TeamNewsSection';
import OffSeasonRecapSection from './sections/OffSeasonRecapSection';
import BearsTrendChart from './sections/BearsTrendChart';

interface PreSeasonDashboardProps {
  scheduleData: ScheduleData | null;
  nflTeamRecords: Map<string, NFLTeamRecord>;
  scheduleLoading: boolean;
}

export default function PreSeasonDashboard({
  scheduleData,
  nflTeamRecords,
  scheduleLoading,
}: PreSeasonDashboardProps) {
  const allGames = scheduleData?.games ?? [];

  // Preseason games for the schedule display (passed in from parent)
  const preseasonGames = useMemo(() =>
    allGames.filter(g => g.gameType === 'preseason'),
    [allGames]
  );

  // Fetch regular season schedule separately so the countdown has real game data
  const {
    scheduleData: regularScheduleData,
    loading: regularLoading,
  } = useTeamSchedule('bears', 2);

  const regularSeasonGames = useMemo(() =>
    regularScheduleData?.games?.filter(g => g.status === 'scheduled') ?? [],
    [regularScheduleData]
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <BearsDashboardHeader
        subtitle="NFL · 2026 Preseason"
        loading={scheduleLoading}
        error={null}
        onRefetch={() => {}}
        lastUpdated={new Date().toLocaleDateString()}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        <SeasonCountdownSection
          regularSeasonGames={regularSeasonGames}
          loading={regularLoading}
        />

        <PreSeasonScheduleSection
          games={preseasonGames}
          nflTeamRecords={nflTeamRecords}
          loading={scheduleLoading}
        />

        <BearsTrendChart />

        <RosterSection />

        <TeamNewsSection />

        <OffSeasonRecapSection />
      </main>
    </div>
  );
}
