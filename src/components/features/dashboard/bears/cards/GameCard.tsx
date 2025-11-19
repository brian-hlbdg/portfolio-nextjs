/**
 * src/components/features/bears-dashboard/cards/GameCard.tsx
 * 
 * Displays a single game with opponent, score, date
 * Reusable for both upcoming and recent games
 * 
 * UX: Clear status indicator, responsive layout
 */

import React from 'react';
import { BearsGame } from '@/components/features/types/bears.types';

interface GameCardProps {
  game: BearsGame;
  variant?: 'upcoming' | 'recent';
}

/**
 * GameCard Component
 * 
 * Shows game details with opponent, date/time, and result
 * Adapts display based on game status
 */
export default function GameCard({ game }: GameCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago'
    });
  };

  const bearsScore = game.isBearsHome ? game.homeScore : game.awayScore;
  const opponentScore = game.isBearsHome ? game.awayScore : game.homeScore;
  const bearsWon = bearsScore !== undefined && opponentScore !== undefined && bearsScore > opponentScore;

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/60 transition-all duration-300">
      {/* Game Week & Date */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
            Week {game.week}
          </p>
          <p className="text-sm text-slate-400">{formatDate(game.date)}</p>
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            game.status === 'final'
              ? bearsWon
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
              : game.status === 'live'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 animate-pulse'
              : 'bg-slate-500/20 text-slate-400 border border-slate-500/50'
          }`}
        >
          {game.status === 'final'
            ? bearsWon
              ? 'W'
              : 'L'
            : game.status === 'live'
            ? 'LIVE'
            : 'UPCOMING'}
        </span>
      </div>

      {/* Opponent & Location */}
      <div className="mb-3">
        <p className="text-slate-400 text-xs mb-1">
          {game.isBearsHome ? 'vs' : '@'} {game.opponent.name}
        </p>
      </div>

      {/* Score Display (if final or live) */}
      {(game.status === 'final' || game.status === 'live') && (
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-xs text-slate-500 mb-1">Bears</p>
            <p className={`text-2xl font-bold ${bearsWon ? 'text-green-400' : 'text-slate-300'}`}>
              {bearsScore}
            </p>
          </div>

          <div className="px-3 text-slate-500 font-semibold">-</div>

          <div className="text-center flex-1">
            <p className="text-xs text-slate-500 mb-1">{game.opponent.name}</p>
            <p className={`text-2xl font-bold ${!bearsWon ? 'text-red-400' : 'text-slate-300'}`}>
              {opponentScore}
            </p>
          </div>
        </div>
      )}

      {/* Game Time (if upcoming) */}
      {game.status === 'scheduled' && (
        <p className="text-sm font-semibold text-white">
          {formatTime(game.date)}
        </p>
      )}
    </div>
  );
}