'use client';

import React, { useMemo } from 'react';
import { useTeamSchedule, ScheduleGame } from '@/hooks/useTeamSchedule';
import { BEARS_2025_SEASON, BEARS_2024_SEASON, GreatestHit } from '@/data/bears2025Season';
import { ALL_NFL_TEAMS } from '@/data/nflTeamLogos';

// ── Types ────────────────────────────────────────────────────────────────────

interface GameResult {
  opponent: string;
  homeAway: 'home' | 'away';
  teamScore: number;
  opponentScore: number;
  margin: number;
  result: 'W' | 'L' | 'T';
  date: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function deriveResults(games: ScheduleGame[]): GameResult[] {
  return games
    .filter((g) => g.status === 'final' && g.score)
    .map((g) => {
      const team = g.score!.team;
      const opp = g.score!.opponent;
      const margin = team - opp;
      const result: 'W' | 'L' | 'T' = margin > 0 ? 'W' : margin < 0 ? 'L' : 'T';
      return { opponent: g.opponent, homeAway: g.homeAway, teamScore: team, opponentScore: opp, margin, result, date: g.date };
    });
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function shortName(name: string): string {
  const parts = name.split(' ');
  return parts[parts.length - 1];
}

function getLogoForTeam(name: string): string {
  const lower = name.toLowerCase();
  const match = ALL_NFL_TEAMS.find(t =>
    lower.includes(t.nickname.toLowerCase()) || lower.includes(t.location.toLowerCase())
  );
  return match?.logos.logo ?? '';
}

// ── Sub-components ───────────────────────────────────────────────────────────

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

function MatchupLog({ results }: { results: GameResult[] }): React.ReactElement {
  const wins = results.filter((r) => r.result === 'W').length;
  const losses = results.filter((r) => r.result === 'L').length;

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 items-center px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/50 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
        <span className="w-6">#</span>
        <span>Opponent</span>
        <span className="text-center w-6">H/A</span>
        <span className="text-right w-16">Score</span>
        <span className="text-center w-8">Res</span>
      </div>

      <div className="divide-y divide-slate-800/60">
        {results.map((game, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 items-center px-4 py-2.5 text-sm transition-colors hover:bg-slate-800/30 ${
              game.margin <= -20 ? 'bg-red-950/10' : ''
            }`}
          >
            <span className="text-[10px] text-slate-600 w-6 tabular-nums">{idx + 1}</span>
            <span className="text-slate-300 truncate font-medium">{shortName(game.opponent)}</span>
            <span className="text-[10px] text-slate-500 text-center w-6">
              {game.homeAway === 'home' ? 'H' : 'A'}
            </span>
            <span className="text-xs tabular-nums text-right w-16 text-slate-400">
              {game.teamScore}–{game.opponentScore}
            </span>
            <span className={`text-[11px] font-bold text-center w-8 rounded px-1 py-0.5 ${
              game.result === 'W' ? 'bg-green-500/15 text-green-400'
              : game.result === 'L' ? 'bg-red-500/15 text-red-400'
              : 'bg-slate-500/15 text-slate-400'
            }`}>
              {game.result}
            </span>
          </div>
        ))}
      </div>

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

function GreatestHitsSection({ hits, yearLabel }: { hits: GreatestHit[]; yearLabel: string }): React.ReactElement {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-base font-bold text-white">Greatest Moments</h3>
        <p className="text-xs text-slate-500">{yearLabel} season highlights</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {hits.map((hit, i) => {
          const logo = getLogoForTeam(hit.opponent);
          return (
            <div key={i} className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-950/20 to-slate-900 p-4 flex flex-col gap-2">
              <span className="inline-block text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5 w-fit">
                {hit.label}
              </span>
              <div className="flex items-center gap-2">
                {logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt={hit.opponent} className="w-7 h-7 object-contain flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">
                    vs. {hit.opponent}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Wk {hit.week} · {hit.score}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{hit.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────

export default function SeasonHighlightsSection(): React.ReactElement {
  const { scheduleData, loading } = useTeamSchedule('bears');

  const results = useMemo(() => {
    if (!scheduleData?.games) return [];
    // Only include completed REGULAR SEASON games — preseason finals don't count
    return deriveResults(scheduleData.games.filter(g => !g.gameType || g.gameType === 'regular'));
  }, [scheduleData]);

  // During offseason the schedule API returns no regular season completed games — use static 2025 data
  const isOffseason = !loading && results.length === 0;

  const mostPointsAgainst = useMemo(() => {
    if (!results.length) return null;
    return results.reduce((max, g) => (g.opponentScore > max.opponentScore ? g : max), results[0]);
  }, [results]);

  const worstLoss = useMemo(() => {
    const losses = results.filter((r) => r.result === 'L');
    if (!losses.length) return null;
    return losses.reduce((worst, g) => (g.margin < worst.margin ? g : worst), losses[0]);
  }, [results]);

  const bestWin = useMemo(() => {
    const wins = results.filter((r) => r.result === 'W');
    if (!wins.length) return null;
    return wins.reduce((best, g) => (g.margin > best.margin ? g : best), wins[0]);
  }, [results]);

  const skeleton = 'animate-pulse bg-slate-800 rounded-xl h-24';

  if (isOffseason) {
    // Static offseason view — show 2025 greatest hits and 2024 greatest hits
    return (
      <section aria-label="Season Highlights" className="space-y-8">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-white">Season Highlights</h2>
          <p className="text-xs text-slate-500 mt-0.5">Best moments from the Caleb Williams era</p>
        </div>
        <GreatestHitsSection hits={BEARS_2025_SEASON.greatestHits} yearLabel="2025" />
        <GreatestHitsSection hits={BEARS_2024_SEASON.greatestHits} yearLabel="2024" />
      </section>
    );
  }

  return (
    <section aria-label="Season Highlights">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">Season Highlights</h2>
        <p className="text-xs text-slate-500 mt-0.5">Game-by-game 2025 regular season</p>
      </div>

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
              sub={mostPointsAgainst ? `vs ${shortName(mostPointsAgainst.opponent)} · ${formatDate(mostPointsAgainst.date)}` : 'No data'}
              accent="red"
            />
            <HighlightCard
              label="Worst Loss"
              value={worstLoss ? `${Math.abs(worstLoss.margin)}` : '—'}
              sub={worstLoss ? `${worstLoss.teamScore}–${worstLoss.opponentScore} vs ${shortName(worstLoss.opponent)}` : 'No data'}
              accent="orange"
            />
            <HighlightCard
              label="Biggest Win"
              value={bestWin ? `+${bestWin.margin}` : '—'}
              sub={bestWin ? `${bestWin.teamScore}–${bestWin.opponentScore} vs ${shortName(bestWin.opponent)}` : 'No data'}
              accent="blue"
            />
          </>
        )}
      </div>

      {loading ? (
        <div className="h-96 rounded-2xl bg-slate-800/40 animate-pulse" />
      ) : results.length > 0 ? (
        <>
          <MatchupLog results={results} />
          <div className="mt-8">
            <GreatestHitsSection hits={BEARS_2025_SEASON.greatestHits} yearLabel="2025" />
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-500 text-center py-8">Game data unavailable.</p>
      )}
    </section>
  );
}
