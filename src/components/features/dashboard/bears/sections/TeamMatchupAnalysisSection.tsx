'use client';

import React, { useMemo } from 'react';
import { useTeamStats } from '@/hooks/useTeamStats';
import { ALL_NFL_TEAMS } from '@/data/nflTeamLogos';

// ── Static 2025 fallback data ─────────────────────────────────────────────────
// Both teams played 17 regular season games in 2025.

const GAMES = 17;

const BEARS_2025 = {
  ppg: 25.9,        // 441 pts / 17
  oppPpg: 24.4,     // 415 pts / 17
  passYdsPg: 243.6, // Caleb Williams 3,942 + backups ~200 = ~4,141 / 17
  rushYdsPg: 115.3, // Swift 1,087 + Monangai 783 + others ≈ 1,960 / 17
  toDiff: 22,       // Led NFL in turnover differential
  sacksPerG: 2.8,   // ~47 team sacks / 17
};

const PANTHERS_2025 = {
  ppg: 18.3,
  oppPpg: 22.4,
  passYdsPg: 194.4,
  rushYdsPg: 116.3,
  toDiff: -4,
  sacksPerG: 2.1,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeNum(v: number | null | undefined): number {
  return Number.isFinite(v as number) ? (v as number) : 0;
}

function fmt1(v: number): string { return v.toFixed(1); }
function fmtDiff(v: number): string { return `${v >= 0 ? '+' : ''}${v}`; }

// Compute per-game from season totals (17 games)
function pgFromStats(total: number): number {
  return total / GAMES;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface TeamData {
  ppg: number;
  oppPpg: number;
  passYdsPg: number;
  rushYdsPg: number;
  toDiff: number;
  sacksPerG: number;
}

interface Category {
  label: string;
  sublabel: string;
  bearsValue: number;
  opponentValue: number;
  higherIsBetter: boolean;
  format: (v: number) => string;
}

// ── Bar row ───────────────────────────────────────────────────────────────────

function CategoryRow({ cat, idx }: { cat: Category; idx: number }): React.ReactElement {
  const { bearsValue, opponentValue, higherIsBetter, label, sublabel, format } = cat;
  const total = bearsValue + opponentValue;
  const bearsWidth = total > 0 ? (bearsValue / total) * 100 : 50;
  const oppWidth = 100 - bearsWidth;

  const bearsLeads = higherIsBetter
    ? bearsValue > opponentValue
    : bearsValue < opponentValue;
  const tied = bearsValue === opponentValue;

  return (
    <div className={`rounded-xl border p-4 ${idx % 2 === 0 ? 'bg-slate-900/40 border-slate-700/30' : 'bg-slate-800/20 border-slate-700/20'}`}>
      {/* Label row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
          <span className="text-[10px] text-slate-600">{sublabel}</span>
        </div>
        {!tied && (
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
            bearsLeads
              ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}>
            {bearsLeads ? 'Bears Edge' : 'Panthers Edge'}
          </span>
        )}
        {tied && (
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Even</span>
        )}
      </div>

      {/* Value + bar row */}
      <div className="flex items-center gap-3">
        {/* Bears value */}
        <span className={`text-lg font-black tabular-nums w-16 text-right flex-shrink-0 ${
          bearsLeads ? 'text-orange-400' : 'text-slate-300'
        }`}>
          {format(bearsValue)}
        </span>

        {/* Bar */}
        <div className="flex-1 flex h-3 rounded-full overflow-hidden bg-slate-800">
          <div
            className={`h-full transition-all rounded-l-full ${bearsLeads ? 'bg-orange-500' : 'bg-orange-500/30'}`}
            style={{ width: `${bearsWidth}%` }}
          />
          <div
            className={`h-full transition-all rounded-r-full ${!bearsLeads ? 'bg-sky-500' : 'bg-sky-500/30'}`}
            style={{ width: `${oppWidth}%` }}
          />
        </div>

        {/* Panthers value */}
        <span className={`text-lg font-black tabular-nums w-16 flex-shrink-0 ${
          !bearsLeads ? 'text-sky-400' : 'text-slate-300'
        }`}>
          {format(opponentValue)}
        </span>
      </div>
    </div>
  );
}

// ── Prediction card ───────────────────────────────────────────────────────────

function PredictionCard({ categories }: { categories: Category[] }): React.ReactElement {
  const bearsEdges = categories.filter(c => {
    if (c.bearsValue === c.opponentValue) return false;
    return c.higherIsBetter ? c.bearsValue > c.opponentValue : c.bearsValue < c.opponentValue;
  }).length;

  const total = categories.length;
  const pantherEdges = total - bearsEdges;

  let verdict: string;
  let verdictColor: string;
  let narrative: string;

  if (bearsEdges >= 4) {
    verdict = 'Bears Favored';
    verdictColor = 'text-orange-400';
    narrative = `Chicago holds the statistical edge in ${bearsEdges} of ${total} key categories. The +22 turnover differential from 2025 is the most telling number — teams that win the turnover battle consistently win games. Caleb Williams\' passing attack (24+ PPG) should exploit a Panthers defense that allowed 22.4 per game last year.`;
  } else if (bearsEdges <= 2) {
    verdict = 'Panthers Favored';
    verdictColor = 'text-sky-400';
    narrative = `Carolina holds the edge in ${pantherEdges} of ${total} categories. The Panthers\' improved defense could slow the Bears\' offense early in the new season.`;
  } else {
    verdict = 'Toss-Up';
    verdictColor = 'text-yellow-400';
    narrative = `Both teams are evenly matched across key categories. Home-field advantage at Soldier Field could be the deciding factor.`;
  }

  return (
    <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-950/20 to-slate-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">2025 Stats Verdict</h3>
        <span className="text-[10px] text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full">
          Based on full 2025 season
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <p className={`text-2xl font-black ${verdictColor}`}>{verdict}</p>
        <div className="flex gap-1 items-center">
          <span className="text-sm font-bold text-orange-400">{bearsEdges}</span>
          <span className="text-slate-600 text-sm">–</span>
          <span className="text-sm font-bold text-sky-400">{pantherEdges}</span>
          <span className="text-xs text-slate-500 ml-1">edges</span>
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">{narrative}</p>

      <p className="text-[10px] text-slate-600 mt-3">
        * Analysis based on 2025 regular season stats. 2026 data updates as the season progresses.
      </p>
    </div>
  );
}

// ── Team logo ─────────────────────────────────────────────────────────────────

function TeamLogo({ abbr, name, size = 10 }: { abbr: string; name: string; size?: number }): React.ReactElement {
  const team = ALL_NFL_TEAMS.find(t => t.abbreviation === abbr);
  if (!team?.logos?.logo) {
    return <div className={`w-${size} h-${size} rounded-full bg-slate-700`} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={team.logos.logo}
      alt={name}
      className={`w-${size} h-${size} object-contain`}
    />
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function TeamMatchupAnalysisSection(): React.ReactElement {
  const { stats: bearsStats, loading: bearsLoading } = useTeamStats(3, 2025);
  const { stats: panthersStats, loading: panthersLoading } = useTeamStats(29, 2025);

  const loading = bearsLoading || panthersLoading;

  const bears: TeamData = useMemo(() => {
    if (!bearsStats) return BEARS_2025;
    return {
      ppg: safeNum(pgFromStats(bearsStats.pointsFor)) || BEARS_2025.ppg,
      oppPpg: safeNum(pgFromStats(bearsStats.pointsAgainst)) || BEARS_2025.oppPpg,
      passYdsPg: safeNum(pgFromStats(bearsStats.passingYards)) || BEARS_2025.passYdsPg,
      rushYdsPg: safeNum(pgFromStats(bearsStats.rushingYards)) || BEARS_2025.rushYdsPg,
      toDiff: safeNum(bearsStats.interceptions - bearsStats.totalTurnovers) || BEARS_2025.toDiff,
      sacksPerG: safeNum(pgFromStats(bearsStats.sacks)) || BEARS_2025.sacksPerG,
    };
  }, [bearsStats]);

  const panthers: TeamData = useMemo(() => {
    if (!panthersStats) return PANTHERS_2025;
    return {
      ppg: safeNum(pgFromStats(panthersStats.pointsFor)) || PANTHERS_2025.ppg,
      oppPpg: safeNum(pgFromStats(panthersStats.pointsAgainst)) || PANTHERS_2025.oppPpg,
      passYdsPg: safeNum(pgFromStats(panthersStats.passingYards)) || PANTHERS_2025.passYdsPg,
      rushYdsPg: safeNum(pgFromStats(panthersStats.rushingYards)) || PANTHERS_2025.rushYdsPg,
      toDiff: safeNum(panthersStats.interceptions - panthersStats.totalTurnovers) || PANTHERS_2025.toDiff,
      sacksPerG: safeNum(pgFromStats(panthersStats.sacks)) || PANTHERS_2025.sacksPerG,
    };
  }, [panthersStats]);

  const categories: Category[] = useMemo(() => [
    {
      label: 'Scoring Offense',
      sublabel: 'PPG',
      bearsValue: bears.ppg,
      opponentValue: panthers.ppg,
      higherIsBetter: true,
      format: fmt1,
    },
    {
      label: 'Scoring Defense',
      sublabel: 'Points allowed / G',
      bearsValue: bears.oppPpg,
      opponentValue: panthers.oppPpg,
      higherIsBetter: false,
      format: fmt1,
    },
    {
      label: 'Passing Attack',
      sublabel: 'Yds / G',
      bearsValue: bears.passYdsPg,
      opponentValue: panthers.passYdsPg,
      higherIsBetter: true,
      format: fmt1,
    },
    {
      label: 'Ground Game',
      sublabel: 'Rush yds / G',
      bearsValue: bears.rushYdsPg,
      opponentValue: panthers.rushYdsPg,
      higherIsBetter: true,
      format: fmt1,
    },
    {
      label: 'Turnover Battle',
      sublabel: 'Differential (season)',
      bearsValue: bears.toDiff,
      opponentValue: panthers.toDiff,
      higherIsBetter: true,
      format: fmtDiff,
    },
    {
      label: 'Pass Rush',
      sublabel: 'Sacks / G',
      bearsValue: bears.sacksPerG,
      opponentValue: panthers.sacksPerG,
      higherIsBetter: true,
      format: fmt1,
    },
  ], [bears, panthers]);

  return (
    <section aria-label="Week 1 Matchup Analysis">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Matchup Analysis</h2>
            <p className="text-xs text-slate-500 mt-0.5">Week 1 · Sep 5, 2026 · Soldier Field · Based on 2025 season stats</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <TeamLogo abbr="CHI" name="Bears" size={8} />
              <span className="text-sm font-bold text-orange-400">Bears</span>
            </div>
            <span className="text-slate-600 font-bold">vs</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-sky-400">Panthers</span>
              <TeamLogo abbr="CAR" name="Panthers" size={8} />
            </div>
          </div>
        </div>

        {/* Column labels */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 text-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-orange-400/70">Chicago Bears</span>
          <span className="text-slate-600 w-16 text-center">Category</span>
          <span className="text-sky-400/70">Carolina Panthers</span>
        </div>

        {/* Category bars */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-800/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat, i) => (
              <CategoryRow key={cat.label} cat={cat} idx={i} />
            ))}
          </div>
        )}

        {/* Prediction */}
        {!loading && <PredictionCard categories={categories} />}
      </div>
    </section>
  );
}
