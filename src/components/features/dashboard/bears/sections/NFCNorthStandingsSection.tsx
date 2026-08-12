'use client';

import React from 'react';
import { useDivisionStandings, TeamStanding } from '@/hooks/useDivisionStandings';

// ── Playoff status badge ─────────────────────────────────────────────────────

function PlayoffBadge({ status, clinch }: { status: TeamStanding['playoffStatus']; clinch: string | null }): React.ReactElement | null {
  if (status === 'clinched_division') {
    return <span className="text-[9px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-1.5 py-0.5">y</span>;
  }
  if (status === 'clinched_wildcard') {
    return <span className="text-[9px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-1.5 py-0.5">x</span>;
  }
  if (status === 'clinched_bye') {
    return <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-1.5 py-0.5">z</span>;
  }
  if (status === 'eliminated') {
    return <span className="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-1.5 py-0.5">e</span>;
  }
  void clinch;
  return null;
}

// ── Standing row ─────────────────────────────────────────────────────────────

function StandingRow({ team, isBears }: { team: TeamStanding; isBears: boolean }): React.ReactElement {
  const streakColor = team.streakType === 'W' ? 'text-green-400' : team.streakType === 'L' ? 'text-red-400' : 'text-slate-400';

  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-3 items-center px-4 py-3 rounded-xl transition-colors ${
        isBears
          ? 'bg-orange-500/10 border border-orange-500/30'
          : 'bg-slate-900/40 border border-slate-700/30'
      }`}
    >
      {/* Rank */}
      <span className={`text-xs font-bold w-4 text-center ${isBears ? 'text-orange-400' : 'text-slate-500'}`}>
        {team.divisionRank}
      </span>

      {/* Team name + clinch badge */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-sm font-semibold truncate ${isBears ? 'text-orange-300' : 'text-white'}`}>
          {team.teamName}
        </span>
        <PlayoffBadge status={team.playoffStatus} clinch={team.clinchIndicator} />
      </div>

      {/* W-L */}
      <span className="text-sm text-slate-300 tabular-nums text-right whitespace-nowrap">
        {team.wins}-{team.losses}{team.ties > 0 ? `-${team.ties}` : ''}
      </span>

      {/* PCT */}
      <span className="text-xs text-slate-400 tabular-nums text-right w-10">
        {team.winPercentage.toFixed(3).replace(/^0/, '')}
      </span>

      {/* Div */}
      <span className="text-xs text-slate-500 tabular-nums text-right w-12 hidden sm:block">
        {team.divisionRecord}
      </span>

      {/* Streak */}
      <span className={`text-xs font-semibold tabular-nums text-right w-8 ${streakColor}`}>
        {team.streak}
      </span>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function StandingsSkeleton(): React.ReactElement {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 rounded-xl bg-slate-800/50 animate-pulse" />
      ))}
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────

export default function NFCNorthStandingsSection(): React.ReactElement {
  const { divisionStandings, currentWeek, loading, source } = useDivisionStandings();

  return (
    <section aria-label="NFC North Standings">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">NFC North Standings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Week {currentWeek} · 2026 Season{source === 'live' ? '' : ' · cached'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className={`w-1.5 h-1.5 rounded-full ${source === 'live' ? 'bg-green-400' : 'bg-slate-600'}`} />
            {source === 'live' ? 'Live' : 'Cached'}
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-3 px-4 pb-2 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
          <span className="w-4">#</span>
          <span>Team</span>
          <span className="text-right">W-L</span>
          <span className="text-right w-10">PCT</span>
          <span className="text-right w-12 hidden sm:block">DIV</span>
          <span className="text-right w-8">STK</span>
        </div>

        {loading ? (
          <StandingsSkeleton />
        ) : divisionStandings ? (
          <div className="space-y-2">
            {divisionStandings.teams.map((team) => (
              <StandingRow
                key={team.teamId}
                team={team}
                isBears={team.teamId === '3'}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-6">Standings unavailable.</p>
        )}

        {/* Legend */}
        {!loading && divisionStandings && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-600">
            <span><span className="text-orange-400 font-bold">y</span> — division clinched</span>
            <span><span className="text-green-400 font-bold">x</span> — playoff berth</span>
            <span><span className="text-blue-400 font-bold">z</span> — first-round bye</span>
            <span><span className="text-red-400 font-bold">e</span> — eliminated</span>
          </div>
        )}
      </div>
    </section>
  );
}
