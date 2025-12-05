/**
 * src/components/features/bears-dashboard/sections/ScheduleSection.tsx
 * ========================================================================
 * 5 cards across, 2 rows
 * Shows: Date, Time, Opponent, Record, Venue, Broadcast, Win % (placeholder)
 * ========================================================================
 */

'use client';

import React from 'react';
import { useTeamSchedule, ScheduleGame } from '@/hooks/useTeamSchedule';
import { NFLTeamRecord } from '@/hooks/useBearsStats';
import { getStadiumByName, getVenueConditions } from '@/data/Nflstadiums';
import { useGamePredictors, GamePrediction, getPredictionGradient } from '@/hooks/useGamePredictors';
import Image from 'next/image';

interface ScheduleSectionProps {
  upcomingGames?: ScheduleGame[];
  loading?: boolean;
  nflTeamRecords?: Map<string, NFLTeamRecord>;
}

export default function ScheduleSection({
  upcomingGames: propGames,
  loading: propLoading = false,
  nflTeamRecords,
}: ScheduleSectionProps) {
  const { scheduleData, loading: hookLoading, error } = useTeamSchedule('bears');

  const loading = propLoading || hookLoading;
  const games = propGames || scheduleData?.games || [];
  const upcomingGames = games.filter(
    (g: ScheduleGame) => g.status === 'scheduled' || g.status === 'live'
  );

  // Get game IDs for upcoming games
  const upcomingGameIds = upcomingGames.map((g) => g.id);

  // Fetch ESPN FPI predictions
  const { predictions, loading: predictionsLoading } = useGamePredictors(upcomingGameIds);

  // Get opponent record from the passed-in NFL team records
  const getOpponentRecord = (opponentName: string): NFLTeamRecord | null => {
    if (!nflTeamRecords) return null;
    return nflTeamRecords.get(opponentName.toLowerCase()) || null;
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upcoming Games
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-slate-800/40 border border-gray-300 dark:border-slate-700/50 rounded-lg p-4 animate-pulse aspect-square"
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upcoming Games
        </h2>
        <div className="bg-white dark:bg-slate-800/40 border border-red-200 dark:border-red-700/50 rounded-lg p-6 text-center">
          <p className="text-red-400">Error loading schedule: {error}</p>
        </div>
      </div>
    );
  }

  // NO GAMES STATE
  if (!upcomingGames || upcomingGames.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Upcoming Games
        </h2>
        <div className="bg-gray-200 dark:bg-slate-800/40 border border-gray-300 dark:border-slate-700/50 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-slate-300">
            No upcoming games scheduled
          </p>
        </div>
      </div>
    );
  }

  // RENDER GAMES - GRID LAYOUT (5 across)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Upcoming Games ({upcomingGames.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {upcomingGames.map((game: ScheduleGame) => (
          <GameCard
            key={game.id}
            game={game}
            opponentRecord={getOpponentRecord(game.opponent)}
            prediction={predictions.get(game.id) || null}
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
  opponentRecord: NFLTeamRecord | null;
  prediction: GamePrediction | null;
}

function GameCard({ game, opponentRecord, prediction }: GameCardProps) {
  const isHome = game.homeAway === 'home';
  const winProbability = 52; // Placeholder - can be calculated later

  // Get stadium info
  const stadium = getStadiumByName(game.venue);
  const venueConditions = stadium ? getVenueConditions(stadium) : null;

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/20 flex flex-col h-full">
      {/* Top: Date & Home/Away Badge */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-gray-800 dark:text-slate-300">{game.date}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {game.time}
          </p>
        </div>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
            isHome
              ? 'bg-green-500/30 border border-green-500/50 text-green-900 dark:text-green-300'
              : 'bg-blue-500/30 border border-blue-500/50 text-blue-900 dark:text-blue-300'
          }`}
        >
          {isHome ? 'HOME' : 'AWAY'}
        </span>
      </div>

      {/* Opponent Section */}
      <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-600/30">
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
        <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
          {game.opponent}
        </p>

        {/* Opponent Record */}
        <p className="text-xs text-gray-400 dark:text-slate-400">
          Record:{' '}
          <span className="text-orange-400 font-semibold">
            {opponentRecord?.record || 'TBD'}
          </span>
        </p>
      </div>

      {/* Venue */}
      <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-600/30">
        <p className="text-xs text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1">
          Venue
        </p>
        <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
          {game.venue}
        </p>
        {venueConditions ? (
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
            {venueConditions}
          </p>
        ) : game.location ? (
          <p className="text-xs text-gray-600 dark:text-slate-500">
            {game.location}
          </p>
        ) : null}
      </div>

      {/* Broadcast */}
      <div className="space-y-2 mt-auto">
        {/* Broadcast */}
        {game.broadcast && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Broadcasting:
            </p>
            <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
              {game.broadcast}
            </p>
          </div>
        )}

        {/* Win Probability - ESPN FPI */}
        <div className="pt-2 border-t border-gray-200 dark:border-slate-600/30 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Bears Chance:
            </p>
            {prediction ? (
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getPredictionGradient(prediction.bearsWinProbability)}`}
                    style={{ width: `${prediction.bearsWinProbability}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-bold w-10 text-right ${
                    prediction.bearsWinProbability >= 50
                      ? 'text-green-500'
                      : 'text-orange-500'
                  }`}
                >
                  {prediction.bearsWinProbability}%
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 dark:text-slate-500 italic">
                --
              </span>
            )}
          </div>
          
          {/* Predicted Spread */}
          {prediction && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600 dark:text-slate-400">
                Spread:
              </p>
              <span
                className={`text-xs font-semibold ${
                  prediction.predictedSpread > 0
                    ? 'text-green-500'
                    : prediction.predictedSpread < 0
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {prediction.predictedSpread > 0 
                  ? `Bears by ${prediction.predictedSpread}` 
                  : prediction.predictedSpread < 0 
                  ? `Lose by ${Math.abs(prediction.predictedSpread)}`
                  : "Pick'em"
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}