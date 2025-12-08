/**
 * src/components/features/dashboard/bears/sections/GameSummarySection.tsx
 * ========================================================================
 * GAME SUMMARY SECTION - Redesigned for better data presentation
 * 
 * Layout:
 * - Final score with yards stats on each team's side
 * - QB stats comparison
 * - Detailed turnover, 3rd down, and TOP cards
 * - Key plays timeline
 * 
 * STRICT TYPESCRIPT
 * ========================================================================
 */

'use client';

import React from 'react';
import Image from 'next/image';
import {
  useGameData,
  GameData,
  QuarterbackStats,
  GameStatistics,
  KeyPlay,
} from '@/hooks/useGameData';
import { NFL_TEAMS } from '@/data/nflTeamLogos';



// ========================================================================
// TYPES
// ========================================================================

interface GameSummarySectionProps {
  teamId?: string;
}

// ========================================================================
// MAIN COMPONENT
// ========================================================================

export function GameSummarySection({ teamId = 'bears' }: GameSummarySectionProps): React.ReactElement {
  const { gameData, loading, error } = useGameData(teamId);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Last Game Summary</h2>
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-slate-600 rounded-full border-t-orange-500" />
          </div>
          <p className="text-gray-600 dark:text-slate-400 mt-4">Loading game summary...</p>
        </div>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Last Game Summary</h2>
        <div className="bg-white dark:bg-slate-800/40 border border-red-200 dark:border-red-700/50 rounded-lg p-6 text-center">
          <p className="text-red-400">{error || 'No game data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Last Game Summary</h2>

      {/* Score Card with Yards */}
      <ScoreWithYardsCard gameData={gameData} />

      {/* Game Narrative */}
      {gameData.highlights && (
        <GameNarrative narrative={gameData.highlights} />
      )}

      {/* QB Stats */}
      {gameData.quarterbacks && (
        <QuarterbackComparison quarterbacks={gameData.quarterbacks} />
      )}

      {/* Detailed Game Stats - Turnovers, 3rd Down, TOP */}
      {gameData.statistics && (
        <DetailedGameStats 
          statistics={gameData.statistics} 
          opponentName={gameData.opponent} 
        />
      )}

      {/* Key Plays */}
      {gameData.keyPlays && gameData.keyPlays.length > 0 && (
        <KeyPlaysSection keyPlays={gameData.keyPlays} />
      )}
    </div>
  );
}

// ========================================================================
// SCORE CARD WITH YARDS
// ========================================================================

interface ScoreWithYardsCardProps {
  gameData: GameData;
}

function ScoreWithYardsCard({ gameData }: ScoreWithYardsCardProps): React.ReactElement {
  const resultColors = {
    W: 'bg-green-500/20 text-green-400 border-green-500/50',
    L: 'bg-red-500/20 text-red-400 border-red-500/50',
    T: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  };

  const stats = gameData.statistics;

  // Bears logo from local data
  const bearsLogo = NFL_TEAMS.CHI.logos.scoreboard;

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4">
      {/* Date */}
      <div className="text-center mb-3">
        <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
          {gameData.date}
        </p>
      </div>

      {/* Scores + Logos + Yards */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {/* Bears side */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className="text-xs text-gray-600 dark:text-slate-400 font-medium">
              Chicago Bears
            </p>
          </div>

          {/* Score + Logo (logo RIGHT of score) */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <Image
              src={bearsLogo}
              alt="Chicago Bears"
              className="h-8 w-8 object-contain"
              width={32}
              height={32}
            />
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {gameData.finalScore.team}
            </p>
          </div>


          {stats && (
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <YardsStat label="TOTAL" value={stats.totalYards.team} />
              <YardsStat label="PASS" value={stats.passingYards.team} />
              <YardsStat label="RUSH" value={stats.rushingYards.team} />
            </div>
          )}
        </div>

        {/* Result badge */}
        <div className="flex items-center justify-center">
          <div
            className={`text-2xl font-bold px-4 py-2 rounded-lg border-2 ${
              resultColors[gameData.result]
            }`}
          >
            {gameData.result}
          </div>
        </div>

        {/* Opponent side */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className="text-xs text-gray-600 dark:text-slate-400 font-medium">
              {gameData.opponent}
            </p>
          </div>
          {/* Score + Logo (logo RIGHT of score) */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {gameData.finalScore.opponent}
            </p>
            <Image
              src={gameData.opponentLogo}
              alt={gameData.opponent}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>


          {stats && (
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <YardsStat label="TOTAL" value={stats.totalYards.opponent} />
              <YardsStat label="PASS" value={stats.passingYards.opponent} />
              <YardsStat label="RUSH" value={stats.rushingYards.opponent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function YardsStat({ label, value }: { label: string; value: number }): React.ReactElement {
  return (
    <div className="bg-white/70 dark:bg-slate-700/40 rounded px-1.5 py-1 text-[10px] leading-tight">
      <p className="text-[9px] uppercase tracking-wide text-gray-500 dark:text-slate-400">
        {label}
      </p>
      <p className="font-semibold text-gray-900 dark:text-white text-xs">
        {value}
      </p>
    </div>
  );
}


// ========================================================================
// GAME NARRATIVE
// ========================================================================

function GameNarrative({ narrative }: { narrative: string }): React.ReactElement {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Game Recap</h3>
      <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
        {narrative}
      </p>
    </div>
  );
}

// ========================================================================
// QB STATS
// ========================================================================

interface QuarterbackComparisonProps {
  quarterbacks: { team: QuarterbackStats; opponent: QuarterbackStats };
}

function QuarterbackComparison({ quarterbacks }: QuarterbackComparisonProps): React.ReactElement {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Quarterback Stats</h3>

      <div className="space-y-3">
        {/* Bears QB */}
        <div>
          <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
            {quarterbacks.team.name}
          </p>
          <div className="grid grid-cols-5 gap-2 text-xs">
            <StatBox label="C/ATT" value={`${quarterbacks.team.completions}/${quarterbacks.team.attempts}`} />
            <StatBox label="YDS" value={quarterbacks.team.yards.toString()} />
            <StatBox label="TD" value={quarterbacks.team.touchdowns.toString()} />
            <StatBox label="INT" value={quarterbacks.team.interceptions.toString()} />
            <StatBox 
              label="RTG" 
              value={quarterbacks.team.rating.toFixed(1)}
              highlight={quarterbacks.team.rating > quarterbacks.opponent.rating}
            />
          </div>
        </div>

        {/* Opponent QB */}
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-2">
            {quarterbacks.opponent.name}
          </p>
          <div className="grid grid-cols-5 gap-2 text-xs">
            <StatBox label="C/ATT" value={`${quarterbacks.opponent.completions}/${quarterbacks.opponent.attempts}`} />
            <StatBox label="YDS" value={quarterbacks.opponent.yards.toString()} />
            <StatBox label="TD" value={quarterbacks.opponent.touchdowns.toString()} />
            <StatBox label="INT" value={quarterbacks.opponent.interceptions.toString()} />
            <StatBox 
              label="RTG" 
              value={quarterbacks.opponent.rating.toFixed(1)}
              highlight={quarterbacks.opponent.rating > quarterbacks.team.rating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }): React.ReactElement {
  return (
    <div className="text-center bg-white dark:bg-slate-700/30 rounded p-2">
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={`font-bold ${highlight ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
    </div>
  );
}

// ========================================================================
// DETAILED GAME STATS (Turnovers, 3rd Down, TOP)
// ========================================================================

interface DetailedGameStatsProps {
  statistics: GameStatistics;
  opponentName: string;
}

function DetailedGameStats({ statistics, opponentName }: DetailedGameStatsProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Turnovers Card */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4">
        <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Turnovers</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-slate-400">Chicago Bears</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {statistics.turnovers.team}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-slate-400">{opponentName}</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {statistics.turnovers.opponent}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-3 italic">
          Lower is better - fewer giveaways
        </p>
      </div>

      {/* 3rd Down Conversions Card */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4">
        <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">3rd Down Conversions</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-slate-400">Chicago Bears</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {statistics.thirdDowns.team}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-slate-400">{opponentName}</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {statistics.thirdDowns.opponent}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-3 italic">
          Conversion percentage - keeping drives alive
        </p>
      </div>

      {/* Time of Possession Card */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4">
        <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Time of Possession</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-slate-400">Chicago Bears</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {statistics.timeOfPossession.team}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-slate-400">{opponentName}</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {statistics.timeOfPossession.opponent}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-3 italic">
          Control the clock - keep defense rested
        </p>
      </div>
    </div>
  );
}

// ========================================================================
// KEY PLAYS
// ========================================================================

interface KeyPlaysSectionProps {
  keyPlays: KeyPlay[];
}

function KeyPlaysSection({ keyPlays }: KeyPlaysSectionProps): React.ReactElement {
  const getPlayIcon = (playType: KeyPlay['playType']): string => {
    const icons = {
      touchdown: '🏈',
      turnover: '⚠️',
      'field-goal': '🎯',
      'big-gain': '⚡',
    } as const;
    return icons[playType] || '📍';
  };

  // Build a simple structure per quarter (Q1–Q4)
  const quarters = [1, 2, 3, 4].map((q) => ({
    quarter: q,
    plays: keyPlays
      .filter((play) => play.quarter === q)
      .slice(0, 5),
  }));

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Key Plays</h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {quarters.map(({ quarter, plays }) => (
          <div
            key={quarter}
            className="flex flex-col rounded-lg border border-gray-200/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/30 p-3 min-h-[140px]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  Q{quarter}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {plays.length} play{plays.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {plays.length === 0 ? (
              <p className="text-[11px] text-gray-400 dark:text-slate-500 italic">
                No key plays recorded.
              </p>
            ) : (
              <div className="space-y-1.5">
                {plays.map((play, index) => (
                  <div
                    key={`${quarter}-${index}`}
                    className="flex gap-2 items-start rounded-md bg-slate-100/70 dark:bg-slate-800/60 px-2 py-1.5 text-[11px]"
                  >
                    <span className="mt-[1px] text-sm shrink-0">
                      {getPlayIcon(play.playType)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[10px] font-medium text-gray-500 dark:text-slate-400">
                          {play.time}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                            play.team === 'team'
                              ? 'bg-green-500/15 text-green-700 dark:text-green-300'
                              : 'bg-red-500/15 text-red-700 dark:text-red-300'
                          }`}
                        >
                          {play.team === 'team' ? 'CHI' : 'OPP'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-700 dark:text-slate-300 leading-snug">
                        {play.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
