'use client';

import React from 'react';
import BearsDashboardHeader from './header/BearsDashboardHeader';
import TeamNewsSection from './sections/TeamNewsSection';
import RosterSection from './sections/RosterSection';

// ── Bracket data ──────────────────────────────────────────────────────────────
// Update these statically as the Bears advance through the playoffs.

// Update each round as the Bears advance through the 2026 playoffs.
// 2025 reference: Wild Card W vs Packers 31-27, Divisional L vs Rams 17-20 OT.
const PLAYOFF_ROUNDS = [
  { round: 'Wild Card',        result: 'TBD', opponent: 'TBD', date: 'Jan 2027' },
  { round: 'Divisional',      result: 'TBD', opponent: 'TBD', date: 'Jan 2027' },
  { round: 'NFC Championship', result: 'TBD', opponent: 'TBD', date: 'Jan 2027' },
  { round: 'Super Bowl LXI',  result: 'TBD', opponent: 'TBD', date: 'Feb 2027' },
];

const CURRENT_ROUND = 0; // 0-indexed — update as Bears advance

// ── Sub-components ────────────────────────────────────────────────────────────

function PlayoffBracket() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-black text-white">Road to the Super Bowl</h2>
        <p className="text-xs text-slate-500 mt-0.5">2026 NFC Playoff bracket</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLAYOFF_ROUNDS.map((round, idx) => {
          const isCurrent = idx === CURRENT_ROUND;
          const isPast = idx < CURRENT_ROUND;
          const isFuture = idx > CURRENT_ROUND;

          return (
            <div
              key={round.round}
              className={`relative rounded-2xl border p-5 transition-all ${
                isCurrent
                  ? 'bg-gradient-to-br from-orange-950/40 to-slate-900 border-orange-500/40 shadow-lg shadow-orange-500/10'
                  : isPast
                  ? 'bg-slate-900/30 border-green-500/20'
                  : 'bg-slate-900/20 border-slate-700/30 opacity-50'
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-2 left-4 text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-950 border border-orange-500/40 rounded-full px-2 py-0.5">
                  Now
                </span>
              )}

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                {round.round}
              </p>

              <div className="flex items-center gap-2 mb-3">
                {/* Bears vs opponent */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-orange-400">CHI</span>
                  <span className="text-slate-600 text-xs">vs</span>
                  <span className="text-sm font-bold text-slate-300">{round.opponent}</span>
                </div>
              </div>

              <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border ${
                round.result === 'W'
                  ? 'bg-green-500/15 text-green-400 border-green-500/30'
                  : round.result === 'L'
                  ? 'bg-red-500/15 text-red-400 border-red-500/30'
                  : 'bg-slate-700/40 text-slate-500 border-slate-600/30'
              }`}>
                {round.result === 'TBD' ? '⏳ Upcoming' : round.result === 'W' ? '✓ Win' : '✗ Loss'}
              </div>

              <p className="text-[10px] text-slate-600 mt-2">{round.date}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PlayoffSeedCard() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Seed */}
        <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/30 to-slate-900 p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-2">NFC Seed</p>
          <p className="text-6xl font-black text-white">#1</p>
          <p className="text-xs text-slate-500 mt-1">NFC North Champions</p>
        </div>

        {/* Record */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Season Record</p>
          <p className="text-5xl font-black text-white">TBD</p>
          <p className="text-xs text-slate-500 mt-1">Regular season final</p>
        </div>

        {/* Next game */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Next Game</p>
          <p className="text-lg font-black text-white">Wild Card</p>
          <p className="text-xs text-orange-400 mt-1">vs. TBD · Jan 2027</p>
        </div>
      </div>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PostSeasonDashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <BearsDashboardHeader
        subtitle="2026 Playoffs · Road to the Super Bowl"
        loading={false}
        error={null}
        onRefetch={() => {}}
        lastUpdated={new Date().toLocaleDateString()}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        <PlayoffSeedCard />
        <PlayoffBracket />
        <TeamNewsSection />
        <RosterSection />
      </main>
    </div>
  );
}
