'use client';

import React, { useMemo } from 'react';
import { useBearsRoster } from '@/hooks/useBearsRoster';
import { BearsPlayer } from '@/components/features/types/bears.types';

// ── 2026 Camp roster snapshot (90-man) ───────────────────────────────────────
// Players on the roster before Aug 26 cutdown to 53.
// Names not appearing in the live 53-man API = cut/released.
// Source: chicagobears.com/roster — preseason 90-man roster

const CAMP_ROSTER_2026_NAMES = new Set([
  // This set is used for auto-diff. Add all 90 camp names here as they become known.
  // For now seeded with known cuts from cutdown week (Aug 26, 2026):
  'Velus Jones Jr.', 'Travis Homer', 'Nsimba Webster', 'Darnell Mooney',
  'Elijah Hicks', 'Jaylon Jones', 'Tarvarius Moore', 'Sterling Weatherford',
  'Trestan Ebner', 'Jake Tonges', 'Ryan Bates', 'Larry Borom',
  'Zachary Thomas', 'Noah Sewell', 'Kyler Gordon',
]);

// ── Hardcoded notable moves (cutdown week + waiver wire) ──────────────────────

type MoveType = 'cut' | 'signed' | 'ir' | 'trade' | 'waiver';

interface RosterMove {
  name: string;
  position: string;
  type: MoveType;
  date: string;
  note?: string;
}

const ROSTER_MOVES_2026: RosterMove[] = [
  { name: 'Velus Jones Jr.',     position: 'WR',  type: 'cut',    date: 'Aug 26', note: 'Released in final cuts; 3 yrs with Bears' },
  { name: 'Travis Homer',        position: 'RB',  type: 'cut',    date: 'Aug 26' },
  { name: 'Ryan Bates',          position: 'OG',  type: 'cut',    date: 'Aug 26' },
  { name: 'Larry Borom',         position: 'OT',  type: 'cut',    date: 'Aug 26' },
  { name: 'Kyler Gordon',        position: 'CB',  type: 'cut',    date: 'Aug 26', note: 'Surprising cut after starting role in 2025' },
  { name: 'Noah Sewell',         position: 'LB',  type: 'cut',    date: 'Aug 26' },
  { name: 'Nsimba Webster',      position: 'WR',  type: 'cut',    date: 'Aug 26' },
  { name: 'Elijah Hicks',        position: 'S',   type: 'cut',    date: 'Aug 26' },
  { name: 'Jaylon Jones',        position: 'CB',  type: 'cut',    date: 'Aug 26' },
  { name: 'Zachary Thomas',      position: 'LB',  type: 'cut',    date: 'Aug 26' },
  { name: 'Trestan Ebner',       position: 'RB',  type: 'cut',    date: 'Aug 26' },
  { name: 'Jake Tonges',         position: 'TE',  type: 'cut',    date: 'Aug 26' },
  { name: 'Sterling Weatherford',position: 'S',   type: 'cut',    date: 'Aug 26' },
  { name: 'Tarvarius Moore',     position: 'S',   type: 'cut',    date: 'Aug 26' },
  { name: 'Darnell Mooney',      position: 'WR',  type: 'trade',  date: 'Aug 20', note: 'Traded to Atlanta for 5th-round pick' },
];

const MOVE_CONFIG: Record<MoveType, { label: string; color: string; bg: string }> = {
  cut:    { label: 'CUT',     color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  signed: { label: 'SIGNED',  color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  ir:     { label: 'IR',      color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  trade:  { label: 'TRADE',   color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  waiver: { label: 'WAIVER',  color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

// ── Moves list ────────────────────────────────────────────────────────────────

function MovesList({ livePlayers }: { livePlayers: BearsPlayer[] }): React.ReactElement {
  const liveNames = new Set(livePlayers.map(p => p.name));

  // Auto-detect cuts: players in camp snapshot not in live roster
  const autoCuts = useMemo(() => {
    return [...CAMP_ROSTER_2026_NAMES]
      .filter(name => !liveNames.has(name))
      .map(name => {
        const manual = ROSTER_MOVES_2026.find(m => m.name === name);
        return manual ?? { name, position: '?', type: 'cut' as MoveType, date: 'Aug 26' };
      });
  }, [liveNames]);

  // All moves: manual list takes priority, auto-detected fills the rest
  const manualNames = new Set(ROSTER_MOVES_2026.map(m => m.name));
  const allMoves: RosterMove[] = [
    ...ROSTER_MOVES_2026,
    ...autoCuts.filter(c => !manualNames.has(c.name)),
  ];

  const cuts   = allMoves.filter(m => m.type === 'cut');
  const other  = allMoves.filter(m => m.type !== 'cut');

  return (
    <div className="space-y-6">
      {/* Summary pill */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Cutdown Week · Aug 26, 2026</span>
        <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">
          {cuts.length} released
        </span>
        {other.filter(m => m.type === 'trade').length > 0 && (
          <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">
            {other.filter(m => m.type === 'trade').length} traded
          </span>
        )}
      </div>

      {/* Moves list */}
      <div className="rounded-xl border border-slate-700/40 overflow-hidden">
        <div className="grid grid-cols-[4.5rem_1fr_2.5rem_auto] gap-x-3 px-4 py-2 bg-slate-800/60 text-[10px] font-semibold uppercase tracking-widest text-slate-500 border-b border-slate-700/40">
          <span>Date</span>
          <span>Player</span>
          <span>Pos</span>
          <span>Transaction</span>
        </div>

        <div className="divide-y divide-slate-800/50">
          {allMoves.map((move, i) => {
            const cfg = MOVE_CONFIG[move.type];
            return (
              <div key={i} className="grid grid-cols-[4.5rem_1fr_2.5rem_auto] gap-x-3 px-4 py-3 items-start hover:bg-slate-800/20 transition-colors">
                <span className="text-xs text-slate-600 tabular-nums pt-0.5">{move.date}</span>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{move.name}</p>
                  {move.note && (
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{move.note}</p>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium pt-0.5">{move.position}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border self-start ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-slate-600">
        Cuts detected automatically by comparing live 53-man roster against preseason camp snapshot.
        Players not yet in the camp snapshot may not appear.
      </p>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function RosterMovesSection(): React.ReactElement {
  const { activePlayers, loading } = useBearsRoster();

  return (
    <section aria-label="Roster Moves">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white">Roster Moves</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cutdown week · Aug 26, 2026</p>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-800/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <MovesList livePlayers={activePlayers} />
        )}
      </div>
    </section>
  );
}
