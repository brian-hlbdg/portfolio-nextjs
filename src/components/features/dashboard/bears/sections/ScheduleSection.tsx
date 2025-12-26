/**
 * src/components/features/dashboard/bears/sections/ScheduleSection.tsx
 * ========================================================================
 * UPDATED: Now includes a rocker switch to toggle between Upcoming and Past games
 * 
 * Features:
 * - Rocker switch toggle between "Upcoming" and "Past Games"
 * - 5 cards across, 2 rows grid layout
 * - Shows: Date, Time, Opponent, Record, Venue, Broadcast, Win %
 * - Past games show W/L badge alongside HOME/AWAY badge
 * - Win probability shown for both upcoming (prediction) and past (actual result)
 * 
 * UX: Single section that contextually shows relevant game data
 * ========================================================================
 */

'use client';

import React, { useState } from 'react';
import { useTeamSchedule, ScheduleGame } from '@/hooks/useTeamSchedule';
import { NFLTeamRecord } from '@/hooks/useBearsStats';
import { getStadiumByName, getVenueConditions } from '@/data/Nflstadiums';
import { useGamePredictors, GamePrediction, getPredictionGradient } from '@/hooks/useGamePredictors';
import Image from 'next/image';
import RockerSwitch from '@/components/ui/RockerSwitch';

// Icons for the rocker switch
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
    />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
);

interface ScheduleSectionProps {
  upcomingGames?: ScheduleGame[];
  pastGames?: ScheduleGame[];
  loading?: boolean;
  nflTeamRecords?: Map<string, NFLTeamRecord>;
}

export default function ScheduleSection({
  upcomingGames: propUpcomingGames,
  pastGames: propPastGames,
  loading: propLoading = false,
  nflTeamRecords,
}: ScheduleSectionProps) {
  // Toggle state: 'left' = Upcoming, 'right' = Past
  const [viewMode, setViewMode] = useState<'left' | 'right'>('left');
  
  const { scheduleData, loading: hookLoading, error } = useTeamSchedule('bears');

  const loading = propLoading || hookLoading;
  const allGames = scheduleData?.games || [];
  
  // Filter games by status
  const upcomingGames = propUpcomingGames || allGames.filter(
    (g: ScheduleGame) => g.status === 'scheduled' || g.status === 'live'
  );
  
  const pastGames = propPastGames || allGames.filter(
    (g: ScheduleGame) => g.status === 'final'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first

  // Determine which games to show based on toggle
  const isShowingUpcoming = viewMode === 'left';
  const displayGames = isShowingUpcoming ? upcomingGames : pastGames;

  // Get game IDs for predictions (only for upcoming games)
  const upcomingGameIds = upcomingGames.map((g) => g.id);
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Games</h2>
          <RockerSwitch
            selected={viewMode}
            onToggle={setViewMode}
            leftLabel="Upcoming"
            rightLabel="Played"
            leftIcon={<CalendarIcon />}
            rightIcon={<HistoryIcon />}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Games</h2>
          <RockerSwitch
            selected={viewMode}
            onToggle={setViewMode}
            leftLabel="Upcoming"
            rightLabel="Played"
            leftIcon={<CalendarIcon />}
            rightIcon={<HistoryIcon />}
          />
        </div>
        <div className="bg-white dark:bg-slate-800/40 border border-red-200 dark:border-red-700/50 rounded-lg p-6 text-center">
          <p className="text-red-400">Error loading schedule: {error}</p>
        </div>
      </div>
    );
  }

  // NO GAMES STATE
  if (!displayGames || displayGames.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Games</h2>
          <RockerSwitch
            selected={viewMode}
            onToggle={setViewMode}
            leftLabel="Upcoming"
            rightLabel="Played"
            leftIcon={<CalendarIcon />}
            rightIcon={<HistoryIcon />}
          />
        </div>
        <div className="bg-gray-200 dark:bg-slate-800/40 border border-gray-300 dark:border-slate-700/50 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-slate-300">
            {isShowingUpcoming 
              ? 'No upcoming games scheduled' 
              : 'No past games to display'}
          </p>
        </div>
      </div>
    );
  }

  // RENDER GAMES - GRID LAYOUT (5 across)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isShowingUpcoming ? 'Upcoming' : 'Past'} Games ({displayGames.length})
        </h2>
        <RockerSwitch
          selected={viewMode}
          onToggle={setViewMode}
          leftLabel="Upcoming"
          rightLabel="Played"
          leftIcon={<CalendarIcon />}
          rightIcon={<HistoryIcon />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {displayGames.map((game: ScheduleGame) => (
          <GameCard
            key={game.id}
            game={game}
            opponentRecord={getOpponentRecord(game.opponent)}
            prediction={predictions.get(game.id) || null}
            isPastGame={!isShowingUpcoming}
          />
        ))}
      </div>
    </div>
  );
}


/**
 * GameCard Component
 * ========================================================================
 * Displays a single game with full details.
 * 
 * For UPCOMING games:
 * - Shows HOME/AWAY badge
 * - Shows predicted win percentage
 * 
 * For PAST games:
 * - Shows HOME/AWAY badge + W/L badge side by side
 * - W badge: green background/border
 * - L badge: red background/border
 * - Shows final score and actual result
 * ========================================================================
 */
interface GameCardProps {
  game: ScheduleGame;
  opponentRecord: NFLTeamRecord | null;
  prediction: GamePrediction | null;
  isPastGame: boolean;
}

function GameCard({ game, opponentRecord, prediction, isPastGame }: GameCardProps) {
  const isHome = game.homeAway === 'home';
  
  /**
   * Safely extract a numeric score from ESPN API response
   * ESPN sometimes returns score as a number, sometimes as {value, displayValue}
   */
  const getScoreValue = (score: number | { value?: number | string; displayValue?: string } | undefined): number | undefined => {
    if (score === undefined || score === null) return undefined;
    if (typeof score === 'number') return score;
    if (typeof score === 'object' && 'value' in score) {
      return typeof score.value === 'number' ? score.value : Number(score.value) || undefined;
    }
    return undefined;
  };

  // Safely extract scores - handle both number and {value, displayValue} formats
  const teamScore = game.score ? getScoreValue(game.score.team as number | { value?: number }) : undefined;
  const oppScore = game.score ? getScoreValue(game.score.opponent as number | { value?: number }) : undefined;
  
  // For past games, determine if Bears won
  const bearsWon = isPastGame && teamScore !== undefined && oppScore !== undefined
    ? teamScore > oppScore
    : null;

  // Get stadium info for venue conditions
  const stadium = getStadiumByName(game.venue);
  const venueConditions = stadium ? getVenueConditions(stadium) : null;



  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/20 flex flex-col h-full">
      {/* Top: Date & Badges */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-gray-800 dark:text-slate-300">{game.date}</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {game.time}
          </p>
        </div>

        {/* Badges Container - HOME/AWAY only */}
        <div className="flex items-center gap-1.5">
          {/* HOME/AWAY Badge */}
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
      <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-600/30 flex-grow">
        <p className="text-xs text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-1">
          Venue
        </p>
        <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
          {game.venue}
        </p>
        {venueConditions && (
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
            {venueConditions}
          </p>
        )}
      </div>

      {/* Win Probability - ESPN FPI */}
      {/* 
        For UPCOMING games: Shows FPI prediction with gradient bar and spread
        For PAST games: Shows actual result (W/L) with corresponding colors
        
        Interesting code note:
        The getPredictionGradient function returns different Tailwind gradient classes
        based on the probability value, creating a visual spectrum from red to green.
      */}
      <div className="space-y-2 mt-auto">
        {/* Broadcast / Location fallback */}
        {game.broadcast ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Broadcasting:
            </p>
            <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
              {game.broadcast}
            </p>
          </div>
        ) : game.location ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Location:
            </p>
            <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
              {game.location}
            </p>
          </div>
        ) : null}

        {/* Bears Chance / Result */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-600/30">
          <p className="text-xs text-gray-600 dark:text-slate-400">
            {isPastGame ? 'Result:' : 'Bears Chance:'}
          </p>
          
          {isPastGame ? (
            /* Past Game Result Display */
            <span
              className={`text-xs font-bold ${
                bearsWon ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {bearsWon ? 'WIN' : 'LOSS'}
            </span>
          ) : prediction ? (
            /* Upcoming Game Prediction Display */
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

        {/* Predicted Spread - Only for upcoming games with prediction */}
        {!isPastGame && prediction && (
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
                : "Pick'em"}
            </span>
          </div>
        )}

        {/* Past Game Score Summary - Only for past games */}
        {isPastGame && teamScore !== undefined && oppScore !== undefined && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              Final:
            </p>
            <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">
              {teamScore} - {oppScore}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}