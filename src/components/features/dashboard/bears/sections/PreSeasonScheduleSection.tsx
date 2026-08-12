'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { ScheduleGame } from '@/hooks/useTeamSchedule';
import { NFLTeamRecord } from '@/hooks/useBearsStats';
import { useGamePredictors } from '@/hooks/useGamePredictors';
import { getStadiumByName } from '@/data/Nflstadiums';
import { ALL_NFL_TEAMS } from '@/data/nflTeamLogos';

function getLogoByTeamName(game: ScheduleGame): string {
  if (game.opponentLogo) return game.opponentLogo;
  // Static fallback: search by abbreviation first, then by name/nickname
  const abbr = game.opponentAbbreviation?.toUpperCase();
  if (abbr) {
    const byAbbr = ALL_NFL_TEAMS.find(t => t.abbreviation === abbr);
    if (byAbbr) return byAbbr.logos.logo;
  }
  const nameLower = game.opponent.toLowerCase();
  const byName = ALL_NFL_TEAMS.find(t =>
    nameLower.includes(t.nickname.toLowerCase()) ||
    nameLower.includes(t.location.toLowerCase())
  );
  return byName?.logos.logo ?? '';
}

interface PreSeasonScheduleSectionProps {
  games: ScheduleGame[];
  nflTeamRecords: Map<string, NFLTeamRecord>;
  loading: boolean;
}

// ── Difficulty ──────────────────────────────────────────────────────────────

type DifficultyTier = 'Elite' | 'Strong' | 'Average' | 'Weak';

const DIFFICULTY_STYLES: Record<DifficultyTier, { bg: string; text: string; border: string }> = {
  Elite:   { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/40' },
  Strong:  { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/40' },
  Average: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  Weak:    { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/40' },
};

function getOpponentDifficulty(
  opponentName: string,
  records: Map<string, NFLTeamRecord>
): DifficultyTier | null {
  // The map key is the team's displayName from ESPN scoreboard
  let record: NFLTeamRecord | undefined;
  for (const [, r] of records) {
    if (r.name.toLowerCase().includes(opponentName.toLowerCase()) ||
        opponentName.toLowerCase().includes(r.name.toLowerCase())) {
      record = r;
      break;
    }
  }
  if (!record) return null;

  const total = record.wins + record.losses + record.ties;
  if (total === 0) return null;

  const winPct = record.wins / total;
  if (winPct > 0.60) return 'Elite';
  if (winPct > 0.50) return 'Strong';
  if (winPct >= 0.40) return 'Average';
  return 'Weak';
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatShortDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

function formatTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  } catch {
    return '';
  }
}

// ── Game Card ────────────────────────────────────────────────────────────────

interface GameCardProps {
  game: ScheduleGame;
  winProbability: number | null;
  difficulty: DifficultyTier | null;
}

function PreSeasonGameCard({ game, winProbability, difficulty }: GameCardProps) {
  const isHome = game.homeAway === 'home';
  const stadium = getStadiumByName(game.venue);
  const isCompleted = game.status === 'final';

  const diffStyle = difficulty ? DIFFICULTY_STYLES[difficulty] : null;

  return (
    <div className="relative bg-slate-900/60 border border-slate-700/40 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-600/60 transition-colors overflow-hidden">
      {/* PRESEASON watermark */}
      <span className="absolute top-2 right-3 text-[9px] font-black uppercase tracking-widest text-slate-700/60 select-none pointer-events-none">
        Preseason
      </span>

      {/* Home / Away badge */}
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          isHome
            ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
            : 'bg-slate-700/40 text-slate-400 border-slate-600/40'
        }`}>
          {isHome ? 'Home' : 'Away'}
        </span>
        {isCompleted && game.score && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            game.score.team > game.score.opponent
              ? 'bg-green-500/15 text-green-400 border-green-500/30'
              : 'bg-red-500/15 text-red-400 border-red-500/30'
          }`}>
            {game.score.team > game.score.opponent ? 'W' : 'L'}{' '}
            {game.score.team}–{game.score.opponent}
          </span>
        )}
      </div>

      {/* Opponent */}
      <div className="flex items-center gap-3">
        {(() => {
          const logoSrc = getLogoByTeamName(game);
          return logoSrc ? (
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src={logoSrc}
                alt={game.opponent}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700/50 flex-shrink-0" />
          );
        })()}
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-tight truncate">
            {isHome ? 'vs.' : '@'} {game.opponent}
          </p>
          {game.opponentRecord && (
            <p className="text-[11px] text-slate-500">{game.opponentRecord}</p>
          )}
        </div>
      </div>

      {/* Date / Time */}
      <div className="text-xs text-slate-400">
        {formatShortDate(game.date)} · {formatTime(game.date)}
        {game.broadcast && (
          <span className="text-slate-600"> · {game.broadcast}</span>
        )}
      </div>

      {/* Venue */}
      <div className="text-[11px] text-slate-500 leading-snug">
        📍 {game.venue}
        {stadium?.city && `, ${stadium.city}`}
      </div>

      {/* Difficulty + Win % */}
      <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-800/40">
        {diffStyle && difficulty && (
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
            {difficulty} opp.
          </span>
        )}
        {!isCompleted && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            winProbability !== null
              ? winProbability >= 50
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
              : 'bg-slate-700/30 text-slate-500 border-slate-600/30'
          }`}>
            {winProbability !== null ? `${winProbability}% win` : 'Exhibition'}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────

export default function PreSeasonScheduleSection({
  games,
  nflTeamRecords,
  loading,
}: PreSeasonScheduleSectionProps) {
  const gameIds = useMemo(() => games.map(g => g.id), [games]);
  const { predictions, loading: predictionsLoading } = useGamePredictors(gameIds);

  if (loading) {
    return (
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black text-white">Preseason Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">2026 Preseason games</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-800/30 rounded-xl h-52" />
          ))}
        </div>
      </section>
    );
  }

  if (games.length === 0) {
    return (
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black text-white">Preseason Schedule</h2>
        </div>
        <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-8 text-center">
          <p className="text-3xl mb-3">📅</p>
          <p className="text-slate-400 text-sm">Preseason schedule not yet available.</p>
          <p className="text-slate-600 text-xs mt-1">
            ESPN typically publishes the preseason schedule in late spring.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-white">Preseason Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {games.length} game{games.length !== 1 ? 's' : ''} · 2026 Preseason
          </p>
        </div>
        {predictionsLoading && (
          <span className="text-[10px] text-slate-600 font-mono animate-pulse">Loading predictions…</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {games.map(game => {
          const pred = predictions.get(game.id);
          const winPct = pred ? Math.round(pred.bearsWinProbability) : null;
          const difficulty = getOpponentDifficulty(game.opponent, nflTeamRecords);

          return (
            <PreSeasonGameCard
              key={game.id}
              game={game}
              winProbability={winPct}
              difficulty={difficulty}
            />
          );
        })}
      </div>
    </section>
  );
}
