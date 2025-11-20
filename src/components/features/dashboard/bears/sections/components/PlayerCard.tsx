/**
 * src/components/features/dashboard/bears/sections/components/PlayerCard.tsx
 * ========================================================================
 * INTERESTING CODE CONCEPT: Minimalist Card with Hover Affordance
 * 
 * This component demonstrates:
 * - Constraint-based design: show only essentials
 * - Hover state as interaction affordance (indicates clickability)
 * - Accessibility: proper semantic structure, keyboard support handled by parent
 * - Injured state visual distinction without clutter
 * ========================================================================
 */

import React from 'react';
import { BearsPlayer } from '@/components/features/types/bears.types';

interface PlayerCardProps {
  player: BearsPlayer;
  isInjured?: boolean;
}

export default function PlayerCard({ player, isInjured = false }: PlayerCardProps) {
  return (
    <div
      className={`
        relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
        ${
          isInjured
            ? 'bg-gray-50 dark:bg-slate-800/20 border-red-500/30 hover:border-red-500/60 hover:bg-gray-100 dark:hover:bg-slate-800/40'
            : 'bg-gray-50 dark:bg-slate-800/30 border-slate-700/40 hover:border-orange-500/50 hover:bg-gray-100 dark:hover:bg-slate-800/50'
        }
      `}
    >
      {/* Injured Badge (if applicable) */}
      {isInjured && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-red-600 dark:bg-red-500/20 border border-red-500/50 rounded text-xs font-semibold text-red-300 uppercase tracking-wide">
          Out
        </div>
      )}

      {/* Jersey Number */}
      <div className="mb-2">
        <div
          className={`
            inline-flex items-center justify-center w-8 h-8 rounded-sm font-bold text-sm
            ${
              isInjured
                ? 'bg-red-600/20 dark:bg-red-500/20 text-red-500 dark:text-red-300 border border-red-500/30'
                : 'bg-orange-600/50 dark:bg-orange-500/20 text-blue-900 dark:text-orange-300 border border-orange-500/30'
            }
          `}
        >
          {player.number}
        </div>
      </div>

      {/* Player Name */}
      <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-tight mb-1">{player.name}</h3>

      {/* Position & Additional Info */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          {player.position}
        </span>
      </div>

      {/* Subtle Indicator: Click for More (visual affordance only) */}
      <div className="absolute bottom-2 right-2 text-gray-500 dark:text-slate-500/40 group-hover:text-slate-400/60 transition-colors">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}