/**
 * src/components/features/dashboard/bears/sections/components/PlayerDetailPanel.tsx
 * ========================================================================
 * INTERESTING CODE CONCEPT: Side Panel Pattern
 * 
 * This component demonstrates:
 * - Non-invasive detail view (doesn't block entire screen)
 * - Backdrop dismiss pattern (click outside to close)
 * - Clean animation: fade + slide from right
 * - Keyboard support: ESC key to close
 * - Accessibility: focus management, proper ARIA attributes
 * ========================================================================
 */

'use client';

import React, { useEffect, useState } from 'react';
import { BearsPlayer } from '@/components/features/types/bears.types';

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
  // Handle ESC key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Backdrop - Click to close */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel - Slides in from right */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 z-50 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-slate-900 dark:to-slate-950 border-l border-slate-800/50 shadow-2xl overflow-y-auto"
        role="dialog"
        aria-label={`${player.name} details`}
      >
        {/* Close Button */}
        <div className="sticky top-0 z-50 bg-gradient-to-b from-slate-900 to-slate-900/80 backdrop-blur-sm border-b border-slate-800/30 p-4 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Player Details</span>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Close player details"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Headshot + Name Hero */}
        <div className="bg-gradient-to-b from-slate-900/60 to-transparent px-6 pt-5 pb-4 flex items-center gap-4">
          <HeadshotImage playerId={player.nflId} playerName={player.name} />
          <div className="min-w-0">
            <p className="text-lg font-bold text-white leading-tight truncate">{player.name}</p>
            <p className="text-sm text-orange-400 font-semibold">
              #{player.number} · {player.position}
            </p>
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

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Injury Banner */}
          {isInjured && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-400 font-semibold">
                ⚠️ Currently on injury report
              </p>
            </div>
          )}

          {/* Core Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-slate-400">
              Player Profile
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/30 rounded-lg p-3 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Jersey</p>
                <p className="text-2xl font-bold text-orange-400">{player.number}</p>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Position</p>
                <p className="text-2xl font-bold text-white">{player.position}</p>
              </div>
              {player.height && (
                <div className="bg-slate-800/30 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Height</p>
                  <p className="text-sm font-semibold text-slate-200">{player.height}</p>
                </div>
              )}
              {player.weight && (
                <div className="bg-slate-800/30 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Weight</p>
                  <p className="text-sm font-semibold text-slate-200">{player.weight} lbs</p>
                </div>
              )}
              {typeof player.experience === 'number' && (
                <div className="bg-slate-800/30 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Experience</p>
                  <p className="text-sm font-semibold text-slate-200">
                    {player.experience === 0 ? 'Rookie' : `${player.experience} yr${player.experience !== 1 ? 's' : ''}`}
                  </p>
                </div>
              )}
              {player.college && (
                <div className="bg-slate-800/30 rounded-lg p-3 space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">College</p>
                  <p className="text-sm font-semibold text-slate-200 truncate">{player.college}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats placeholder */}
          <div className="space-y-2 border-t border-slate-800/50 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-slate-400">
              Statistics
            </h3>
            <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-400">
                Position-specific stats coming soon.
              </p>
            </div>
          </div>

          {/* ESPN Link */}
          {player.nflId && (
            <div className="border-t border-slate-800/50 pt-4">
              <a
                href={`https://www.espn.com/nfl/player/_/id/${player.nflId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/40 rounded-lg transition-all text-sm text-blue-400"
              >
                View on ESPN
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}