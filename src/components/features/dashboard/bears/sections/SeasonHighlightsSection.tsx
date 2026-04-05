/**
 * src/components/features/dashboard/bears/sections/SeasonHighlightsSection.tsx
 * ========================================================================
 * Derives game-level season insights from the Bears schedule data:
 *  - Most points allowed in a single game
 *  - Worst loss (largest margin of defeat)
 *  - Full season game-by-game team matchup log
 *
 * Uses useTeamSchedule (site.api.espn.com) which is more reliably
 * accessible than the core stats API.
 *
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import React, { useMemo } from 'react';
import { useTeamSchedule, ScheduleGame } from '@/hooks/useTeamSchedule';

// ========================================================================
// DERIVED TYPES
// ========================================================================

interface GameResult {
  opponent: string;
  homeAway: 'home' | 'away';
  teamScore: number;
  opponentScore: number;
  margin: number;        // positive = win, negative = loss
  result: 'W' | 'L' | 'T';
  date: string;
}

// ========================================================================
// HELPERS
// ========================================================================

function deriveResults(games: ScheduleGame[]): GameResult[] {
  return games
    .filter((g) => g.status === 'final' && g.score)
    .map((g) => {
      const team = g.score!.team;
      const opp = g.score!.opponent;
      const margin = team - opp;
      const result: 'W' | 'L' | 'T' = margin > 0 ? 'W' : margin < 0 ? 'L' : 'T';
      return {
        opponent: g.opponent,
        homeAway: g.homeAway,
        teamScore: team,
        opponentScore: opp,
        margin,
        result,
        date: g.date,
      };
    });
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

// Shorten long team names for the table
function shortName(name: string): string {
  const parts = name.split(' ');
  return parts[parts.length - 1]; // e.g. "Green Bay Packers" → "Packers"
}

// ========================================================================
// STAT HIGHLIGHT CARD
// ========================================================================

interface HighlightCardProps {
  label: string;
  value: string;
  sub: string;
  accent?: 'red' | 'orange' | 'blue';
}

function HighlightCard({ label, value, sub, accent = 'orange' }: HighlightCardProps): React.ReactElement {
  const accentClass = {
    red: 'from-red-950/40 border-red-500/20 text-red-400',
    orange: 'from-orange-950/30 border-orange-500/20 text-orange-400',
    blue: 'from-blue-950/30 border-blue-500/20 text-blue-400',
  }[accent];

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${accentClass} to-slate-900 p-4`}>
      <p className={`text-[10px] font-semibold tracking-widest uppercase mb-2 ${accentClass.split(' ').pop()}`}>
        {label}
      </p>
      <p className="text-3xl font-black text-white leading-none">{value}</p>
      <p className="text-xs text-slate-400 mt-1.5">{sub}</p>
    </div>
  );
}

// ========================================================================
// MATCHUP LOG TABLE
// ========================================================================

interface MatchupLogProps {
  results: GameResult[];
}

function MatchupLog({ results }: MatchupLogProps): React.ReactElement {
  const wins = results.filter((r) => r.result === 'W').length;
  const losses = results.filter((r) => r.result === 'L').length;

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 items-center px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/50 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
        <span className="w-6">#</span>
        <span>Opponent</span>
        <span className="text-center w-6">H/A</span>
        <span className="text-right w-16">Score</span>
        <span className="text-center w-8">Res</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-800/60">
        {results.map((game, idx) => {
          const isWin = game.result === 'W';
          const isBigLoss = game.margin <= -20;

          return (
            <div
              key={idx}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 items-center px-4 py-2.5 text-sm transition-colors hover:bg-slate-800/30 ${
                isBigLoss ? 'bg-red-950/10' : ''
              }`}
            >
              {/* Week number */}
              <span className="text-[10px] text-slate-600 w-6 tabular-nums">{idx + 1}</span>

              {/* Opponent */}
              <span className="text-slate-300 truncate font-medium">
                {shortName(game.opponent)}
              </span>

              {/* Home / Away */}
              <span className="text-[10px] text-slate-500 text-center w-6">
                {game.homeAway === 'home' ? 'H' : 'A'}
              </span>

              {/* Score */}
              <span className="text-xs tabular-nums text-right w-16 text-slate-400">
                {game.teamScore}–{game.opponentScore}
              </span>

              {/* Result badge */}
              <span
                className={`text-[11px] font-bold text-center w-8 rounded px-1 py-0.5 ${
                  game.result === 'W'
                    ? 'bg-green-500/15 text-green-400'
                    : game.result === 'L'
                    ? 'bg-red-500/15 text-red-400'
                    : 'bg-slate-500/15 text-slate-400'
                }`}
              >
                {game.result}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-slate-800/30 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
        <span>{results.length} games played</span>
        <span>
          <span className="text-green-400 font-semibold">{wins}W</span>
          {' · '}
          <span className="text-red-400 font-semibold">{losses}L</span>
        </span>
      </div>
    </div>
  );
}

// ========================================================================
// MAIN SECTION
// ========================================================================

export default function SeasonHighlightsSection(): React.ReactElement {
  const { scheduleData, loading } = useTeamSchedule('bears');

  const results = useMemo(() => {
    if (!scheduleData?.games) return [];
    return deriveResults(scheduleData.games);
  }, [scheduleData]);

  // Most points allowed in a single game
  const mostPointsAgainst = useMemo(() => {
    if (!results.length) return null;
    return results.reduce((max, g) => (g.opponentScore > max.opponentScore ? g : max), results[0]);
  }, [results]);

  // Worst loss by margin
  const worstLoss = useMemo(() => {
    const losses = results.filter((r) => r.result === 'L');
    if (!losses.length) return null;
    return losses.reduce((worst, g) => (g.margin < worst.margin ? g : worst), losses[0]);
  }, [results]);

  // Best win by margin
  const bestWin = useMemo(() => {
    const wins = results.filter((r) => r.result === 'W');
    if (!wins.length) return null;
    return wins.reduce((best, g) => (g.margin > best.margin ? g : best), wins[0]);
  }, [results]);

  const skeleton = 'animate-pulse bg-slate-800 rounded-xl h-24';

  return (
    <section aria-label="Season Highlights">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">Season Highlights</h2>
        <p className="text-xs text-slate-500 mt-0.5">Game-by-game 2025 regular season</p>
      </div>

      {/* Stat highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {loading ? (
          <>
            <div className={skeleton} />
            <div className={skeleton} />
            <div className={skeleton} />
          </>
        ) : (
          <>
            <HighlightCard
              label="Most Points Allowed"
              value={mostPointsAgainst ? `${mostPointsAgainst.opponentScore}` : '—'}
              sub={
                mostPointsAgainst
                  ? `vs ${shortName(mostPointsAgainst.opponent)} · ${formatDate(mostPointsAgainst.date)}`
                  : 'No data'
              }
              accent="red"
            />
            <HighlightCard
              label="Worst Loss"
              value={worstLoss ? `${Math.abs(worstLoss.margin)}` : '—'}
              sub={
                worstLoss
                  ? `${worstLoss.teamScore}–${worstLoss.opponentScore} vs ${shortName(worstLoss.opponent)}`
                  : 'No data'
              }
              accent="orange"
            />
            <HighlightCard
              label="Biggest Win"
              value={bestWin ? `+${bestWin.margin}` : '—'}
              sub={
                bestWin
                  ? `${bestWin.teamScore}–${bestWin.opponentScore} vs ${shortName(bestWin.opponent)}`
                  : 'No data'
              }
              accent="blue"
            />
          </>
        )}
      </div>

      {/* Game-by-game matchup log */}
      {loading ? (
        <div className="h-96 rounded-2xl bg-slate-800/40 animate-pulse" />
      ) : results.length > 0 ? (
        <MatchupLog results={results} />
      ) : (
        <p className="text-sm text-slate-500 text-center py-8">
          Game data unavailable.
        </p>
      )}
    </section>
  );
}
