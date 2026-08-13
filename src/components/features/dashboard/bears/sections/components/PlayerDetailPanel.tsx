'use client';

import React, { useEffect, useState } from 'react';
import { BearsPlayer } from '@/components/features/types/bears.types';

// ── 2025 season stats by ESPN player ID ──────────────────────────────────────
// Only includes players with confirmed stats; everyone else sees the default.

interface StatLine { label: string; value: string }

const STATS_2025: Record<string, StatLine[]> = {
  '4431611': [ // Caleb Williams — QB
    { label: 'Pass Yds', value: '3,942' },
    { label: 'TD / INT', value: '36 / 5' },
    { label: 'Comp %', value: '67.8%' },
    { label: 'QBR', value: '78.4' },
  ],
  '4259545': [ // D'Andre Swift — RB
    { label: 'Rush Yds', value: '1,087' },
    { label: 'Rush TDs', value: '9' },
    { label: 'YPC', value: '4.8' },
    { label: 'Rec Yds', value: '312' },
  ],
  '4608686': [ // Kyle Monangai — RB
    { label: 'Rush Yds', value: '783' },
    { label: 'Rush TDs', value: '4' },
    { label: 'YPC', value: '4.2' },
  ],
  '3915416': [ // DJ Moore — WR
    { label: 'Rec Yds', value: '761' },
    { label: 'Receptions', value: '62' },
    { label: 'Rec TDs', value: '6' },
  ],
  '4723086': [ // Colston Loveland — TE
    { label: 'Rec Yds', value: '713' },
    { label: 'Receptions', value: '58' },
    { label: 'Rec TDs', value: '6' },
  ],
  '4431299': [ // Rome Odunze — WR
    { label: 'Rec Yds', value: '661' },
    { label: 'Receptions', value: '54' },
    { label: 'Rec TDs', value: '5' },
  ],
  '3134690': [ // Montez Sweat — DE
    { label: 'Sacks', value: '10.0' },
    { label: 'TFLs', value: '14' },
    { label: 'Pressures', value: '38' },
  ],
  '2574056': [ // Kevin Byard III — S
    { label: 'INTs', value: '7' },
    { label: 'PD', value: '14' },
    { label: 'Tackles', value: '74' },
  ],
  '3929950': [ // Tremaine Edmunds — LB
    { label: 'Tackles', value: '112' },
    { label: 'Sacks', value: '2.0' },
    { label: 'INTs', value: '2' },
  ],
};

// ── Headshot ──────────────────────────────────────────────────────────────────

function HeadshotImage({ playerId, playerName }: { playerId?: string; playerName: string }) {
  const [hasError, setHasError] = useState(false);
  const src = playerId && !hasError
    ? `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${playerId}.png&w=200&h=145`
    : null;

  if (!src) {
    return (
      <div className="w-20 h-20 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
        <svg className="w-12 h-12 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={playerName}
        className="w-full h-full object-cover object-top"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}

// ── Stat grid ─────────────────────────────────────────────────────────────────

function StatGrid({ stats, accent = false }: { stats: StatLine[]; accent?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="bg-slate-800/40 rounded-lg px-3 py-2.5 space-y-0.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
          <p className={`text-lg font-bold leading-none ${accent ? 'text-orange-400' : 'text-white'}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Close button ──────────────────────────────────────────────────────────────

function CloseButton({ onClose, variant }: { onClose: () => void; variant: 'header' | 'footer' }) {
  if (variant === 'header') {
    return (
      <button
        onClick={onClose}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors text-slate-300 hover:text-white text-sm font-medium"
        aria-label="Close player details"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Close
      </button>
    );
  }
  return (
    <button
      onClick={onClose}
      className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/40 transition-colors text-slate-300 hover:text-white font-semibold text-sm"
      aria-label="Close player details"
    >
      Close
    </button>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface PlayerDetailPanelProps {
  player: BearsPlayer;
  isInjured?: boolean;
  onClose: () => void;
}

export default function PlayerDetailPanel({
  player,
  isInjured = false,
  onClose,
}: PlayerDetailPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const stats2025 = player.nflId ? STATS_2025[player.nflId] : undefined;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 z-50 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-800/50 shadow-2xl overflow-y-auto flex flex-col"
        role="dialog"
        aria-label={`${player.name} details`}
      >
        {/* Sticky header with close */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Player Details</span>
          <CloseButton onClose={onClose} variant="header" />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <div className="px-6 pt-5 pb-4 flex items-center gap-4">
            <HeadshotImage playerId={player.nflId} playerName={player.name} />
            <div className="min-w-0">
              <p className="text-lg font-bold text-white leading-tight">{player.name}</p>
              <p className="text-sm text-orange-400 font-semibold">#{player.number} · {player.position}</p>
              {player.statusLabel && (
                <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isInjured
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {player.statusLabel}
                </span>
              )}
            </div>
          </div>

          <div className="px-6 pb-6 space-y-5">
            {/* Injury banner */}
            {isInjured && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm text-red-400 font-semibold">⚠️ Currently on injury report</p>
              </div>
            )}

            {/* Player profile */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Profile</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/30 rounded-lg p-3 space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Jersey</p>
                  <p className="text-2xl font-bold text-orange-400">{player.number}</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Position</p>
                  <p className="text-2xl font-bold text-white">{player.position}</p>
                </div>
                {player.height && (
                  <div className="bg-slate-800/30 rounded-lg p-3 space-y-0.5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Height</p>
                    <p className="text-sm font-semibold text-slate-200">{player.height}</p>
                  </div>
                )}
                {player.weight && (
                  <div className="bg-slate-800/30 rounded-lg p-3 space-y-0.5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Weight</p>
                    <p className="text-sm font-semibold text-slate-200">{player.weight} lbs</p>
                  </div>
                )}
                {typeof player.experience === 'number' && (
                  <div className="bg-slate-800/30 rounded-lg p-3 space-y-0.5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Experience</p>
                    <p className="text-sm font-semibold text-slate-200">
                      {player.experience === 0 ? 'Rookie' : `${player.experience} yr${player.experience !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                )}
                {player.college && (
                  <div className="bg-slate-800/30 rounded-lg p-3 space-y-0.5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">College</p>
                    <p className="text-sm font-semibold text-slate-200 truncate">{player.college}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2026 Season stats */}
            <div className="space-y-2 border-t border-slate-800/50 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">2026 Season</h3>
                <span className="text-[10px] text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full">In progress</span>
              </div>
              <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-500">Stats update as the season progresses.</p>
              </div>
            </div>

            {/* 2025 Season stats */}
            <div className="space-y-2 border-t border-slate-800/50 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">2025 Season</h3>
                <span className="text-[10px] text-orange-400/70 bg-orange-500/10 px-2 py-0.5 rounded-full">Final</span>
              </div>
              {stats2025 ? (
                <StatGrid stats={stats2025} accent />
              ) : (
                <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-500">
                    Full stats on ESPN.
                  </p>
                </div>
              )}
            </div>

            {/* ESPN link */}
            {player.nflId && (
              <div className="border-t border-slate-800/50 pt-4">
                <a
                  href={`https://www.espn.com/nfl/player/_/id/${player.nflId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/40 rounded-lg transition-all text-sm text-blue-400"
                >
                  View full stats on ESPN
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Bottom close button — prominent on mobile */}
            <div className="pt-2">
              <CloseButton onClose={onClose} variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
