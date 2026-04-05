/**
 * src/components/features/dashboard/bears/OffSeasonDashboard.tsx
 * ========================================================================
 * Off-season board for the Chicago Bears.
 * Renders when the regular NFL season has ended.
 *
 * Sections:
 *  1. Season Recap hero
 *  2. Final NFC North standings
 *  3. Season stats (reuses TeamStatsSection verbatim)
 *  4. Standout players
 *  5. Team news & updates
 *
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import React from 'react';
import BearsDashboardHeader from './header/BearsDashboardHeader';
import OffSeasonRecapSection from './sections/OffSeasonRecapSection';
import TeamNewsSection from './sections/TeamNewsSection';
import { TeamStatsSection } from './sections/TeamStatsSection';
import { useDivisionStandings, TeamStanding } from '@/hooks/useDivisionStandings';
import { useTeamLeaders, TeamLeader, TeamLeaders } from '@/hooks/useTeamLeaders';

// ========================================================================
// DIVISION STANDINGS TABLE
// ========================================================================

interface StandingsRowProps {
  team: TeamStanding;
  isBears: boolean;
}

function StandingsRow({ team, isBears }: StandingsRowProps): React.ReactElement {
  return (
    <div
      className={`grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center px-4 py-3 rounded-xl transition-colors ${
        isBears
          ? 'bg-orange-500/10 border border-orange-500/30'
          : 'bg-slate-900/40 border border-slate-700/30'
      }`}
    >
      {/* Team name + rank */}
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-xs font-bold w-5 text-center ${isBears ? 'text-orange-400' : 'text-slate-500'}`}>
          {team.divisionRank}
        </span>
        <span className={`text-sm font-semibold truncate ${isBears ? 'text-orange-300' : 'text-white'}`}>
          {team.teamName}
        </span>
      </div>
      {/* Record */}
      <span className="text-sm text-slate-300 tabular-nums text-right">
        {team.wins}-{team.losses}{team.ties > 0 ? `-${team.ties}` : ''}
      </span>
      {/* Win % */}
      <span className="text-xs text-slate-400 tabular-nums text-right w-12">
        {(Number(team.winPercentage) || 0).toFixed(3).replace(/^0/, '')}
      </span>
      {/* Differential */}
      <span className={`text-xs tabular-nums text-right w-12 ${
        team.pointDifferential >= 0 ? 'text-green-400' : 'text-red-400'
      }`}>
        {team.pointDifferential >= 0 ? '+' : ''}{team.pointDifferential}
      </span>
    </div>
  );
}

function DivisionStandingsSection(): React.ReactElement {
  const { divisionStandings, bearsStanding, loading } = useDivisionStandings();

  const sorted = divisionStandings
    ? [...divisionStandings.teams].sort((a, b) => a.divisionRank - b.divisionRank)
    : [];

  return (
    <section aria-label="NFC North Final Standings">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {divisionStandings?.divisionName ?? 'NFC North'} — Final Standings
          </h2>
          <span className="text-xs text-slate-500">2025 Season</span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 pb-2 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
          <span>Team</span>
          <span className="text-right">W-L</span>
          <span className="text-right w-12">PCT</span>
          <span className="text-right w-12">DIFF</span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-800/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((team) => (
              <StandingsRow
                key={team.teamId}
                team={team}
                isBears={team.teamId === bearsStanding?.teamId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ========================================================================
// STANDOUT PLAYERS
// ========================================================================

const FEATURED_CATEGORIES: Array<{ key: keyof TeamLeaders; label: string }> = [
  { key: 'passing', label: 'Passing Leader' },
  { key: 'rushing', label: 'Rushing Leader' },
  { key: 'receiving', label: 'Receiving Leader' },
  { key: 'sacks', label: 'Sack Leader' },
  { key: 'touchdowns', label: 'TD Leader' },
];

interface PlayerSpotlightCardProps {
  leader: TeamLeader;
  categoryLabel: string;
}

function PlayerSpotlightCard({ leader, categoryLabel }: PlayerSpotlightCardProps): React.ReactElement {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 flex flex-col items-center text-center gap-2">
      {/* Headshot */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
        {leader.headshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={leader.headshotUrl}
            alt={leader.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xl font-bold">
            {leader.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-orange-400/80 mb-0.5">
          {categoryLabel}
        </p>
        <p className="text-sm font-bold text-white leading-tight">{leader.name}</p>
        <p className="text-xs text-slate-400">{leader.position} · #{leader.jersey}</p>
      </div>

      {/* Stat */}
      <div className="mt-1 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/50">
        <p className="text-lg font-black text-white leading-none">{leader.statDisplay}</p>
      </div>
    </div>
  );
}

function StandoutPlayersSection(): React.ReactElement {
  const { leaders, loading } = useTeamLeaders();

  return (
    <section aria-label="2025 Standout Players">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">Standout Players</h2>
        <p className="text-xs text-slate-500 mt-0.5">2025 regular season leaders</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 h-44 animate-pulse"
              />
            ))
          : FEATURED_CATEGORIES.map(({ key, label }) => {
              const categoryLeaders = leaders?.[key] ?? [];
              const top = categoryLeaders[0];
              if (!top) return null;
              return (
                <PlayerSpotlightCard
                  key={key}
                  leader={top}
                  categoryLabel={label}
                />
              );
            })}
      </div>
    </section>
  );
}

// ========================================================================
// MAIN COMPONENT
// ========================================================================

export default function OffSeasonDashboard(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <BearsDashboardHeader subtitle="2025 Season Recap" />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* 1. Season recap hero */}
        <OffSeasonRecapSection />

        {/* 2. Division standings */}
        <DivisionStandingsSection />

        {/* 3. Season stats — reused verbatim */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Season Stats</h2>
            <p className="text-xs text-slate-500 mt-0.5">2025 regular season totals</p>
          </div>
          <TeamStatsSection teamId="bears" teamName="Chicago Bears" />
        </section>

        {/* 4. Standout players */}
        <StandoutPlayersSection />

        {/* 5. Team news */}
        <TeamNewsSection />
      </main>
    </div>
  );
}
