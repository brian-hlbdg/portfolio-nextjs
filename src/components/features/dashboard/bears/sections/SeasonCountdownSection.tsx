'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ScheduleGame } from '@/hooks/useTeamSchedule';
import { useTeamStats } from '@/hooks/useTeamStats';
import { ALL_NFL_TEAMS } from '@/data/nflTeamLogos';

// Carolina Panthers ESPN team ID
const PANTHERS_TEAM_ID = 29;

// Actual 2025 Carolina Panthers final stats (8-9, NFC South champions)
// Source: statmuse.com, ninertimes.com
const PANTHERS_2025_FALLBACK = {
  record: '8-9',
  ppg: 18.3,
  oppPpg: 22.4,
  rushYdsPg: 116.3,
  passYdsPg: 194.4,
  trend: 'up' as const,
};

// Approximate NFL 2026 regular season opener if schedule isn't loaded yet
const SEASON_FALLBACK_DATE = new Date('2026-09-04T19:20:00');

const PANTHERS_LOGO = ALL_NFL_TEAMS.find(t => t.abbreviation === 'CAR')?.logos.logo ?? '';

interface SeasonCountdownSectionProps {
  regularSeasonGames: ScheduleGame[];
  loading: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
}

function formatGameDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// ── Countdown digit block ─────────────────────────────────────────────────────

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-md" />
        <div className="relative bg-gradient-to-b from-slate-800 to-slate-950 border border-orange-500/30 rounded-2xl px-5 py-4 min-w-[80px] md:min-w-[96px] text-center shadow-2xl">
          <span className="text-4xl md:text-6xl font-black text-white tabular-nums leading-none tracking-tight">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/70 mt-3">
        {label}
      </span>
    </div>
  );
}

// ── Stat row for opponent panel ───────────────────────────────────────────────

function StatRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="text-right">
        <span className="text-sm font-bold text-white">{value}</span>
        {note && <span className="text-[10px] text-slate-500 ml-2">{note}</span>}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SeasonCountdownSection({ regularSeasonGames, loading }: SeasonCountdownSectionProps) {
  // Fetch Panthers 2025 season stats for opponent analysis panel
  const { stats: panthersStats, loading: panthersLoading } = useTeamStats(PANTHERS_TEAM_ID, 2025);

  const targetGame = useMemo(() => {
    return [...regularSeasonGames]
      .filter(g => g.status === 'scheduled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null;
  }, [regularSeasonGames]);

  const targetDate = useMemo(() => {
    if (targetGame) return new Date(targetGame.date);
    return SEASON_FALLBACK_DATE;
  }, [targetGame]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0, started: false,
  });

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, started: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        started: false,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // Derive Panthers stats values — fall back to hardcoded constants if ESPN returns nothing
  const panthersData = useMemo(() => {
    if (panthersStats) {
      const gamesPlayed = 17; // regular season
      return {
        record: PANTHERS_2025_FALLBACK.record, // ESPN stats API doesn't include W-L record
        ppg: panthersStats.scoring.pointsPerGame.value || PANTHERS_2025_FALLBACK.ppg,
        oppPpg: panthersStats.defense.pointsAllowedPerGame.value || PANTHERS_2025_FALLBACK.oppPpg,
        rushYdsPg: gamesPlayed > 0 ? Math.round(panthersStats.rushingYards / gamesPlayed * 10) / 10 : PANTHERS_2025_FALLBACK.rushYdsPg,
        passYdsPg: gamesPlayed > 0 ? Math.round(panthersStats.passingYards / gamesPlayed * 10) / 10 : PANTHERS_2025_FALLBACK.passYdsPg,
        trend: PANTHERS_2025_FALLBACK.trend,
      };
    }
    return PANTHERS_2025_FALLBACK;
  }, [panthersStats]);

  if (loading) {
    return (
      <section>
        <div className="bg-gradient-to-br from-orange-950/30 via-slate-900/80 to-slate-900/80 border border-orange-500/15 rounded-2xl p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700/50 rounded w-48 mx-auto" />
            <div className="flex justify-center gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 w-24 bg-slate-700/50 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (timeLeft.started) {
    return (
      <section>
        <div className="bg-gradient-to-br from-orange-950/30 via-slate-900/80 to-slate-900/80 border border-orange-500/20 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-3">🏈</p>
          <p className="text-xl font-bold text-white">The 2026 season has started!</p>
        </div>
      </section>
    );
  }

  const isHome = targetGame?.homeAway === 'home';

  return (
    <section>
      <div className="bg-gradient-to-br from-orange-950/30 via-slate-900/80 to-slate-900/80 border border-orange-500/15 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">

          {/* ── Left: Dramatic Countdown (60%) ─────────────────────────── */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-orange-500/10">
            {/* Label */}
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500 mb-1">
              Regular Season Countdown
            </p>
            <h2 className="text-lg font-black text-white mb-8">
              2026 Chicago Bears Season Kickoff
            </h2>

            {/* Digit blocks */}
            <div className="flex items-center gap-2 md:gap-4 mb-8">
              <CountdownBlock value={timeLeft.days} label="Days" />
              <span className="text-3xl font-black text-orange-500/40 pb-8">:</span>
              <CountdownBlock value={timeLeft.hours} label="Hours" />
              <span className="text-3xl font-black text-orange-500/40 pb-8">:</span>
              <CountdownBlock value={timeLeft.minutes} label="Min" />
              <span className="text-3xl font-black text-orange-500/40 pb-8">:</span>
              <CountdownBlock value={timeLeft.seconds} label="Sec" />
            </div>

            {/* Game info */}
            <div className="space-y-1">
              {targetGame ? (
                <>
                  <p className="text-white font-semibold text-sm">
                    Week 1 · {isHome ? 'vs.' : '@'}{' '}
                    <span className="text-orange-400">{targetGame.opponent}</span>
                  </p>
                  <p className="text-slate-500 text-xs">
                    {formatGameDate(targetGame.date)} · {targetGame.venue}
                  </p>
                  {targetGame.broadcast && (
                    <p className="text-slate-600 text-xs">📺 {targetGame.broadcast}</p>
                  )}
                </>
              ) : (
                <p className="text-slate-500 text-xs">
                  {formatGameDate(SEASON_FALLBACK_DATE.toISOString())} · Schedule releasing soon
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Opponent Analysis (40%) ─────────────────────────── */}
          <div className="md:col-span-2 p-6 md:p-8">
            {/* Panel header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                  Week 1 Opponent
                </p>
                <h3 className="text-base font-black text-white leading-tight">
                  Panthers Analysis
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">2025 Final Season Stats</p>
              </div>
              {PANTHERS_LOGO && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={PANTHERS_LOGO}
                  alt="Carolina Panthers"
                  className="w-12 h-12 object-contain flex-shrink-0"
                />
              )}
            </div>

            {/* Difficulty + history badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 uppercase tracking-wide">
                Average Opp.
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                Bears 2-0 last 2 vs CAR
              </span>
            </div>

            {/* Stats */}
            {panthersLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-slate-800/60 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div>
                <div className="mb-1">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 mb-1">
                    Record
                  </p>
                  <p className="text-2xl font-black text-white">{panthersData.record}</p>
                </div>
                <div className="mt-3">
                  <StatRow
                    label="Offense PPG"
                    value={`${panthersData.ppg.toFixed(1)}`}
                    note="pts/game"
                  />
                  <StatRow
                    label="Defense PPG"
                    value={`${panthersData.oppPpg.toFixed(1)}`}
                    note="allowed/game"
                  />
                  <StatRow
                    label="Rush Yds/Game"
                    value={`${panthersData.rushYdsPg.toFixed(0)}`}
                    note="yds"
                  />
                  <StatRow
                    label="Pass Yds/Game"
                    value={`${panthersData.passYdsPg.toFixed(0)}`}
                    note="yds"
                  />
                  <StatRow
                    label="2025 Trend"
                    value={panthersData.trend === 'up' ? '↑ Improving' : '↓ Declining'}
                    note="2nd-half vs 1st-half"
                  />
                </div>
              </div>
            )}

            {/* Scouting note */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <span className="text-orange-400 font-bold">Scouting note:</span>{' '}
                Panthers won the NFC South (8-9) and made the playoffs in 2025 but ranked near the bottom offensively (18.3 PPG, 27th). Bears have won the last 2 matchups including a 24-17 Week 1 win last season.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
