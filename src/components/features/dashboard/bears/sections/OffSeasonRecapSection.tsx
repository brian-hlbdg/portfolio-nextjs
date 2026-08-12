'use client';

import React from 'react';
import { BEARS_2025_SEASON } from '@/data/bears2025Season';

// The 2025 season is final — use static data exclusively.
// No API call needed; live APIs return current-year data which is wrong here.

export default function OffSeasonRecapSection(): React.ReactElement {
  const { wins, losses, ties, record, pointsFor, pointsAgainst, divisionFinish, divisionName } = BEARS_2025_SEASON;

  const rankLabel =
    divisionFinish === '1st' ? '1st'
    : divisionFinish === '2nd' ? '2nd'
    : divisionFinish === '3rd' ? '3rd'
    : '4th';

  const pointDiff = pointsFor - pointsAgainst;
  const pointDiffLabel = pointDiff >= 0 ? `+${pointDiff}` : `${pointDiff}`;
  const gamesPlayed = wins + losses + ties;

  return (
    <section aria-label="2025 Season Recap">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Hero: Final Record ── */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/30 via-slate-900 to-slate-900 p-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-widest text-orange-400/70 uppercase mb-1">
              2025 Regular Season — Final
            </p>
            <p className="text-xs text-slate-400 mb-4">Year 2 of the Caleb Williams Era · NFC North Champions</p>

            <div className="flex items-end gap-4 mb-4">
              <span className="text-7xl font-black tracking-tighter bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent leading-none">
                {record}
              </span>
              <span className="text-slate-400 text-lg mb-2">W-L</span>
            </div>

            {/* Division + Playoffs badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                <span className="text-orange-400">{rankLabel}</span>
                <span>—</span>
                <span>{divisionName}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 border border-green-500/30 text-green-400">
                🏆 Playoff Appearance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/15 border border-orange-500/30 text-orange-400">
                Wild Card Win vs GB
              </span>
            </div>
          </div>
        </div>

        {/* ── Key Season Numbers ── */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 flex flex-col justify-between">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Points Scored</p>
            <div>
              <p className="text-4xl font-bold text-white">{pointsFor}</p>
              <p className="text-xs text-slate-500 mt-1">
                {(pointsFor / Math.max(gamesPlayed, 1)).toFixed(1)} pts/game · 3rd in franchise history
              </p>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 flex flex-col justify-between">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Points Allowed</p>
            <div>
              <p className="text-4xl font-bold text-white">{pointsAgainst}</p>
              <p className={`text-xs mt-1 ${pointDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pointDiffLabel} point differential
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
