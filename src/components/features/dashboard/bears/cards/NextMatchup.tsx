'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

/**
 * ============================================================
 * NEXT MATCHUP COMPONENT - Stat Comparison Panel
 * ============================================================
 * 
 * This component displays:
 * - Upcoming opponent with logos (home/away indicators)
 * - Side-by-side stat comparison
 * - Green highlight for winning stats, red for losing stats
 * - Responsive grid layout
 * - Full light/dark mode support
 * 
 * Key Features:
 * - Reusable architecture for future expansion
 * - Type-safe stat definitions
 * - Progressive enhancement (basic now, room for animations/interactivity)
 * - DRY principle: Stat comparison logic is centralized
 */

/**
 * Individual stat definition for comparison
 */
interface ComparisonStat {
  label: string;
  bearsValue: number | string;
  opponentValue: number | string;
  format?: (value: number | string) => string; // Optional formatter
}

/**
 * Team info for matchup display
 */
interface MatchupTeam {
  name: string;
  abbreviation: string;
  logo: string;
  stats: {
    pointsFor: number;
    pointsAgainst: number;
    passingYards: number;
    rushingYards: number;
    turnovers: number;
    thirdDownConversion: number; // percentage
  };
}

/**
 * Props for the NextMatchup component
 */
interface NextMatchupProps {
  bears: MatchupTeam;
  opponent: MatchupTeam;
  isBearsHome: boolean;
  gameDate: string; // ISO format or readable string
  loading?: boolean;
}

/**
 * HELPER: Determine if stat is "winning" (higher is better for most stats)
 * Special case: pointsAgainst and turnovers (lower is better)
 */
function isStatWinning(
  bearsValue: number,
  opponentValue: number,
  statKey: keyof MatchupTeam['stats']
): 'bears' | 'opponent' | 'tie' {
  // Lower is better for these stats
  const lowerIsBetter: (keyof MatchupTeam['stats'])[] = ['pointsAgainst', 'turnovers'];

  if (bearsValue === opponentValue) return 'tie';

  if (lowerIsBetter.includes(statKey)) {
    return bearsValue < opponentValue ? 'bears' : 'opponent';
  }

  // Higher is better for most stats
  return bearsValue > opponentValue ? 'bears' : 'opponent';
}

/**
 * COMPONENT: Stat comparison row
 * Reusable for displaying a single stat comparison
 */
interface StatRowProps {
  label: string;
  bearsValue: string;
  opponentValue: string;
  winner: 'bears' | 'opponent' | 'tie';
}

function StatRow({ label, bearsValue, opponentValue, winner }: StatRowProps) {
  const getRowClasses = (side: 'bears' | 'opponent') => {
    const baseClasses = 'px-4 py-3 rounded-lg font-semibold text-sm transition-colors';
    const darkMode = 'dark:';

    if (winner === 'tie') {
      return `${baseClasses} bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300`;
    }

    if (winner === side) {
      return `${baseClasses} bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400`;
    }

    return `${baseClasses} bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400`;
  };

  return (
    <div className="grid grid-cols-3 gap-4 items-center py-3">
      {/* Stat Label */}
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </p>
      </div>

      {/* Bears Value */}
      <div className={getRowClasses('bears')}>
        {bearsValue}
      </div>

      {/* Opponent Value */}
      <div className={getRowClasses('opponent')}>
        {opponentValue}
      </div>
    </div>
  );
}

/**
 * MAIN COMPONENT: NextMatchup
 */
export default function NextMatchup({
  bears,
  opponent,
  isBearsHome,
  gameDate,
  loading = false,
}: NextMatchupProps) {
  /**
   * INTERESTING CODE: useMemo for stat comparison logic
   * 
   * This memoizes the stat comparisons to avoid recalculating on every render.
   * The dependencies array includes all data that affects comparisons.
   * This is important for performance when stats update frequently.
   */
  const statComparisons = useMemo((): ComparisonStat[] => {
    return [
      {
        label: 'Scoring Offense',
        bearsValue: bears.stats.pointsFor,
        opponentValue: opponent.stats.pointsFor,
      },
      {
        label: 'Scoring Defense',
        bearsValue: bears.stats.pointsAgainst,
        opponentValue: opponent.stats.pointsAgainst,
      },
      {
        label: 'Passing Yards',
        bearsValue: bears.stats.passingYards,
        opponentValue: opponent.stats.passingYards,
      },
      {
        label: 'Rushing Yards',
        bearsValue: bears.stats.rushingYards,
        opponentValue: opponent.stats.rushingYards,
      },
      {
        label: 'Turnovers',
        bearsValue: bears.stats.turnovers,
        opponentValue: opponent.stats.turnovers,
      },
      {
        label: '3rd Down Conv.',
        bearsValue: `${bears.stats.thirdDownConversion}%`,
        opponentValue: `${opponent.stats.thirdDownConversion}%`,
      },
    ];
  }, [bears, opponent]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-8 text-center">
        <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Loading matchup data...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
      {/* HEADER: Game Info */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700/50">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
          Next Matchup
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {gameDate}
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-6">
        {/* TEAM MATCHUP ROW */}
        <div className="grid grid-cols-3 gap-6 items-center mb-8 pb-8 border-b border-slate-200 dark:border-slate-700/50">
          {/* BEARS TEAM */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-16 h-16">
              <Image
                src={bears.logo}
                alt={bears.name}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
              {isBearsHome && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 dark:bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  HOME
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {bears.abbreviation}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {bears.name}
              </p>
            </div>
          </div>

          {/* VS INDICATOR */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-400 dark:text-slate-500">VS</p>
            </div>
          </div>

          {/* OPPONENT TEAM */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-16 h-16">
              <Image
                src={opponent.logo}
                alt={opponent.name}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
              {!isBearsHome && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 dark:bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  AWAY
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {opponent.abbreviation}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {opponent.name}
              </p>
            </div>
          </div>
        </div>

        {/* STAT COMPARISON */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4 block">
            Season Statistics Comparison
          </p>

          {statComparisons.map((stat, index) => {
            const winner = isStatWinning(
              Number(stat.bearsValue),
              Number(stat.opponentValue),
              (Object.keys(bears.stats).find(
                (key) => bears.stats[key as keyof MatchupTeam['stats']] === stat.bearsValue
              ) || '') as keyof MatchupTeam['stats']
            );

            return (
              <StatRow
                key={index}
                label={stat.label}
                bearsValue={String(stat.bearsValue)}
                opponentValue={String(stat.opponentValue)}
                winner={winner}
              />
            );
          })}
        </div>
      </div>

      {/* FOOTER: Legend */}
      <div className="bg-slate-50 dark:bg-slate-900/30 px-6 py-3 border-t border-slate-200 dark:border-slate-700/50 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500 dark:bg-green-600" />
          <span className="text-slate-700 dark:text-slate-400">Leading Stat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500 dark:bg-red-600" />
          <span className="text-slate-700 dark:text-slate-400">Trailing Stat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600" />
          <span className="text-slate-700 dark:text-slate-400">Tied</span>
        </div>
      </div>
    </div>
  );
}

