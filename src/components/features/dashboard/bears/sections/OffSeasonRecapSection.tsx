/**
 * src/components/features/dashboard/bears/sections/OffSeasonRecapSection.tsx
 * ========================================================================
 * Hero section for the off-season board.
 * Displays the final season record, division finish, and key season stats.
 *
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import React from 'react';
import { useBearsStats } from '@/hooks/useBearsStats';
import { useDivisionStandings } from '@/hooks/useDivisionStandings';

export default function OffSeasonRecapSection(): React.ReactElement {
  const { seasonStats, loading: statsLoading } = useBearsStats();
  const { bearsStanding, loading: standingsLoading } = useDivisionStandings();

  const loading = statsLoading || standingsLoading;

  const wins = bearsStanding?.wins ?? seasonStats?.wins ?? 0;
  const losses = bearsStanding?.losses ?? seasonStats?.losses ?? 0;
  const ties = bearsStanding?.ties ?? seasonStats?.ties ?? 0;
  const record = seasonStats?.record ?? `${wins}-${losses}${ties > 0 ? `-${ties}` : ''}`;
  const pointsFor = bearsStanding?.pointsFor ?? seasonStats?.pointsFor ?? 0;
  const pointsAgainst = bearsStanding?.pointsAgainst ?? seasonStats?.pointsAgainst ?? 0;
  const divisionRank = bearsStanding?.divisionRank ?? null;
  const divisionName = 'NFC North';

  const rankLabel =
    divisionRank === 1 ? '1st'
    : divisionRank === 2 ? '2nd'
    : divisionRank === 3 ? '3rd'
    : divisionRank === 4 ? '4th'
    : null;

  const pointDiff = pointsFor - pointsAgainst;
  const pointDiffLabel = pointDiff >= 0 ? `+${pointDiff}` : `${pointDiff}`;

  const skeleton = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  return (
    <section aria-label="2025 Season Recap">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Hero: Final Record ── */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/30 via-slate-900 to-slate-900 p-6">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-widest text-orange-400/70 uppercase mb-1">
              2025 Regular Season — Final
            </p>
            <p className="text-xs text-slate-400 mb-4">Year 1 of the Caleb Williams Era</p>

            {/* Record */}
            {loading ? (
              <div className={`${skeleton} h-16 w-40 mb-4`} />
            ) : (
              <div className="flex items-end gap-4 mb-4">
                <span className="text-7xl font-black tracking-tighter bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent leading-none">
                  {record}
                </span>
                <span className="text-slate-400 text-lg mb-2">W-L</span>
              </div>
            )}

            {/* Division badge */}
            {rankLabel && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                <span className="text-orange-400">{rankLabel}</span>
                <span>—</span>
                <span>{divisionName}</span>
              </span>
            )}
          </div>
        </div>

        {/* ── Key Season Numbers ── */}
        <div className="flex flex-col gap-4">
          {/* Points For */}
          <div className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 flex flex-col justify-between">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Points Scored
            </p>
            {loading ? (
              <div className={`${skeleton} h-10 w-24 mt-2`} />
            ) : (
              <div>
                <p className="text-4xl font-bold text-white">{pointsFor}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {wins + losses + ties > 0
                    ? `${(pointsFor / Math.max(wins + losses + ties, 1)).toFixed(1)} pts/game`
                    : ''}
                </p>
              </div>
            )}
          </div>

          {/* Points Against */}
          <div className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5 flex flex-col justify-between">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Points Allowed
            </p>
            {loading ? (
              <div className={`${skeleton} h-10 w-24 mt-2`} />
            ) : (
              <div>
                <p className="text-4xl font-bold text-white">{pointsAgainst}</p>
                <p className={`text-xs mt-1 ${pointDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {pointDiffLabel} point differential
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
