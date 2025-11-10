/**
 * src/components/features/bears-dashboard/sections/ScheduleSection.tsx - GRID CARDS
 * ========================================================================
 * 5 cards across, 2 rows
 * Shows: Date, Time, Opponent, Record, Venue, Broadcast, Win % (placeholder)
 * ========================================================================
 */

'use client';

import React, { useMemo } from 'react';
import { useTeamSchedule, ScheduleGame } from '@/hooks/useTeamSchedule';
import { useSportsStats } from '@/hooks/useSportsStats';
import Image from 'next/image';

interface ScheduleSectionProps {
  upcomingGames?: ScheduleGame[];
  loading?: boolean;
}

export default function ScheduleSection({
  upcomingGames: propGames,
  loading: propLoading = false,
}: ScheduleSectionProps) {
  const { scheduleData, loading: hookLoading, error } = useTeamSchedule(
    'bears',
    'NFL'
  );

  const { teams } = useSportsStats();

  const loading = propLoading || hookLoading;
  const games = propGames || scheduleData?.games || [];
  const upcomingGames = games.filter((g: ScheduleGame) =>
    g.status === 'scheduled' || g.status === 'live'
  );

  // Build opponent stats map
  const opponentStatsMap = useMemo(() => {
    const map: Record<string, { record: string; wins: number; losses: number }> = {};
    teams.forEach(team => {
      map[team.name.toLowerCase()] = {
        record: team.record,
        wins: team.wins,
        losses: team.losses,
      };
    });
    return map;
  }, [teams]);

  // Get opponent record
  const getOpponentRecord = (opponentName: string): { record: string; wins: number; losses: number } | null => {
    const key = opponentName.toLowerCase();
    return opponentStatsMap[key] || null;
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Upcoming Games</h2>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 animate-pulse aspect-square"
            />
          ))}
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Upcoming Games</h2>
        <div className="bg-slate-800/40 border border-red-700/50 rounded-lg p-6 text-center">
          <p className="text-red-400">Error loading schedule: {error}</p>
        </div>
      </div>
    );
  }

  // NO GAMES STATE
  if (!upcomingGames || upcomingGames.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Upcoming Games</h2>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-8 text-center">
          <p className="text-slate-400">No upcoming games scheduled</p>
        </div>
      </div>
    );
  }

  // RENDER GAMES - GRID LAYOUT (5 across)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Upcoming Games ({upcomingGames.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {upcomingGames.map((game: ScheduleGame) => (
          <GameCard 
            key={game.id} 
            game={game} 
            opponentRecord={getOpponentRecord(game.opponent)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Game card - grid layout with opponent record
 */
interface GameCardProps {
  game: ScheduleGame;
  opponentRecord: { record: string; wins: number; losses: number } | null;
}

function GameCard({ game, opponentRecord }: GameCardProps) {
  const isHome = game.homeAway === 'home';
  const winProbability = 52; // Placeholder - can be calculated later

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-slate-700/50 rounded-lg p-4 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/20 flex flex-col h-full">
      {/* Top: Date & Home/Away Badge */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-slate-400">{game.date}</p>
          <p className="text-sm font-bold text-white">{game.time}</p>
        </div>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
            isHome
              ? 'bg-green-500/30 border border-green-500/50 text-green-300'
              : 'bg-blue-500/30 border border-blue-500/50 text-blue-300'
          }`}
        >
          {isHome ? 'HOME' : 'AWAY'}
        </span>
      </div>

      {/* Opponent Section */}
      <div className="mb-3 pb-3 border-b border-slate-600/30">
        {/* Opponent Logo */}
        {game.opponentLogo && (
          <Image
            src={game.opponentLogo}
            alt={game.opponent}
            width={40}
            height={40}
            className="w-10 h-10 rounded mb-2"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
            }}
          />
        )}

        {/* Opponent Name */}
        <p className="text-sm font-semibold text-white mb-1 line-clamp-2">
          {game.opponent}
        </p>

        {/* Opponent Record */}
        {opponentRecord ? (
          <div className="text-xs space-y-0.5">
            <p className="text-slate-400">
              Record: <span className="text-orange-400 font-semibold">{opponentRecord.record}</span>
            </p>
            <p className="text-slate-400">
              <span className="text-green-400">{opponentRecord.wins}W</span>
              {' '}
              <span className="text-red-400">{opponentRecord.losses}L</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">Record: TBD</p>
        )}
      </div>

      {/* Venue */}
      <div className="mb-3 pb-3 border-b border-slate-600/30">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Venue</p>
        <p className="text-xs font-semibold text-white line-clamp-1">{game.venue}</p>
        {game.location && (
          <p className="text-xs text-slate-500">{game.location}</p>
        )}
      </div>

      {/* Broadcast & Win Probability */}
      <div className="space-y-2 mt-auto">
        {/* Broadcast */}
        {game.broadcast && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">Broadcasting:</p>
            <p className="text-xs font-semibold text-orange-400">{game.broadcast}</p>
          </div>
        )}

        {/* Win Probability (Placeholder) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-600/30">
          <p className="text-xs text-slate-400">Bears Chance:</p>
          <div className="flex items-center gap-1">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                style={{ width: `${winProbability}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-orange-400 w-8 text-right">
              {winProbability}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}