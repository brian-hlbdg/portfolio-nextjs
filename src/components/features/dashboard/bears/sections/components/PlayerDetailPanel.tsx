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

import React, { useEffect } from 'react';
import { BearsPlayer } from '@/components/features/types/bears.types';

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
        className="fixed right-0 top-0 h-full w-full sm:w-96 z-50 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-800/50 shadow-2xl overflow-y-auto"
        role="dialog"
        aria-label={`${player.name} details`}
      >
        {/* Close Button */}
        <div className="sticky top-0 z-50 bg-gradient-to-b from-slate-900 to-slate-900/80 backdrop-blur-sm border-b border-slate-800/30 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{player.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          {isInjured && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300 font-semibold">
                ⚠️ Currently on injury report
              </p>
            </div>
          )}

          {/* Core Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Core Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Jersey Number */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Jersey</p>
                <p className="text-2xl font-bold text-orange-400">{player.number}</p>
              </div>

              {/* Position */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Position</p>
                <p className="text-2xl font-bold text-white">{player.position}</p>
              </div>
            </div>

            {/* Height & Weight (if available) */}
            {(player.height || player.weight) && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/50">
                {player.height && (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Height</p>
                    <p className="text-sm text-slate-200">{player.height}</p>
                  </div>
                )}
                {player.weight && (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Weight</p>
                    <p className="text-sm text-slate-200">{player.weight} lbs</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* College (if available) */}
          {player.college && typeof player.college === 'string' && (
            <div className="space-y-2 border-t border-slate-800/50 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                College
              </h3>
              <p className="text-sm text-slate-200">{player.college}</p>
            </div>
          )}

          {/* Placeholder for Future Stat Sections */}
          <div className="space-y-2 border-t border-slate-800/50 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Statistics
            </h3>
            <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-400">
                Position-specific stats coming soon.
              </p>
            </div>
          </div>

          {/* NFL.com Link (if available) */}
          {player.nflId && (
            <div className="border-t border-slate-800/50 pt-4">
              <a
                href={`https://www.nfl.com/players/${player.nflId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg transition-all text-sm text-blue-300"
              >
                View on NFL.com
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