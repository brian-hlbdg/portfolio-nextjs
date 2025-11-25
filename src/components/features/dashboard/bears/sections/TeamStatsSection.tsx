/**
 * src/components/features/bears-dashboard/TeamStatsSection.tsx
 * ========================================================================
 * TEAM STATS SECTION - STRICT TYPESCRIPT (NO ANY TYPES)
 * 
 * Displays team statistics in a grid using reusable StatCard component
 * Fully typed with all ESPN data structures explicitly defined
 */

'use client';

import React, { useMemo } from 'react';
import { useTeamStats } from '@/hooks/useTeamStats';
import StatCard from '../cards/StatCard';

// ========================================================================
// TYPES
// ========================================================================

/**
 * Props for TeamStatsSection component
 */
interface TeamStatsSectionProps {
  /** ESPN team ID - currently not used (endpoint hardcoded) */
  teamId?: string;
  /** Display name for the team */
  teamName?: string;
  /** Show debug information in UI */
  showDebug?: boolean;
}

/**
 * Fallback sample data when API is not available
 */
interface FallbackStats {
  passingYards: number;
  rushingYards: number;
  pointsFor: number;
  pointsAgainst: number;
  turnovers: number;
  thirdDownConversions: number;
  thirdDownAttempts: number;
  thirdDownPercentage: number;
  passingTouchdowns: number;
  rushingTouchdowns: number;
  receivingTouchdowns: number;
  interceptions: number;
  fumblesLost: number;
}

/**
 * Loading skeleton configuration
 */
interface SkeletonConfig {
  count: number;
  height: string;
}

// ========================================================================
// CONSTANTS
// ========================================================================

const FALLBACK_STATS: FallbackStats = {
  passingYards: 2848,
  rushingYards: 1624,
  pointsFor: 258,
  pointsAgainst: 264,
  turnovers: 12,
  thirdDownConversions: 35,
  thirdDownAttempts: 95,
  thirdDownPercentage: 37,
  passingTouchdowns: 20,
  rushingTouchdowns: 15,
  receivingTouchdowns: 10,
  interceptions: 5,
  fumblesLost: 3,
};

const SKELETON_CONFIG: SkeletonConfig = {
  count: 6,
  height: 'h-24',
};

// ========================================================================
// COMPONENTS
// ========================================================================

/**
 * Loading skeleton component
 */
interface LoadingSkeletonProps {
  count: number;
  height: string;
}

function LoadingSkeleton(props: LoadingSkeletonProps): React.ReactElement {
  const { count, height } = props;
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i: number) => (
        <div
          key={i}
          className={`${height} animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700`}
        />
      ))}
    </div>
  );
}

/**
 * Error message component
 */
interface ErrorMessageProps {
  error: string;
  showDebug: boolean;
}

function ErrorMessage(props: ErrorMessageProps): React.ReactElement {
  const { error, showDebug } = props;
  
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/10">
      <p className="text-sm font-medium text-red-900 dark:text-red-300">
        Error loading statistics
      </p>
      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
        {error}
      </p>
      {showDebug && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-mono">
          Check browser console (F12) for more details
        </p>
      )}
    </div>
  );
}

/**
 * Stats grid component
 */
interface StatsGridProps {
  passingYards: number;
  rushingYards: number;
  pointsFor: number;
  pointsAgainst: number;
  turnovers: number;
  thirdDownConversions: number;
  thirdDownAttempts: number;
  thirdDownPercentage: number;
  passingTouchdowns: number;
  rushingTouchdowns: number;
  receivingTouchdowns: number;
  interceptions: number;
  fumblesLost: number;
}

function StatsGrid(props: StatsGridProps): React.ReactElement {
  const {
    passingYards,
    rushingYards,
    pointsFor,
    pointsAgainst,
    turnovers,
    thirdDownConversions,
    thirdDownAttempts,
    thirdDownPercentage,
    passingTouchdowns,
    rushingTouchdowns,
    receivingTouchdowns,
    interceptions,
    fumblesLost,
  } = props;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Offense Stats */}
      <StatCard
        label="Passing Yards"
        value={`${passingYards.toLocaleString()} yds`}
        subtext="Season total"
        badge="Offense"
        badgeColor="blue"
        variant="default"
      />

      <StatCard
        label="Rushing Yards"
        value={`${rushingYards.toLocaleString()} yds`}
        subtext="Season total"
        badge="Offense"
        badgeColor="blue"
        variant="default"
      />

      <StatCard
        label="Scoring Offense"
        value={`${pointsFor} pts`}
        subtext="Points scored"
        badge="Offense"
        badgeColor="blue"
        variant="default"
      />

      {/* Defense Stats */}
      <StatCard
        label="Scoring Defense"
        value={`${pointsAgainst} pts`}
        subtext="Points allowed"
        badge="Defense"
        badgeColor="orange"
        variant="default"
      />

      <StatCard
        label="Turnovers"
        value={`${turnovers}`}
        subtext="Lost (fumbles + INT)"
        badge="Defense"
        badgeColor="orange"
        variant="default"
      />

      {/* Special Teams / Efficiency */}
      <StatCard
        label="3rd Down Conversion"
        value={`${thirdDownPercentage}%`}
        subtext={`${thirdDownConversions}/${thirdDownAttempts}`}
        badge="Special Teams"
        badgeColor="gray"
        variant="default"
      />

      <StatCard
        label="Interceptions"
        value={`${interceptions}`}
        subtext="Thrown"
        badge="Special Teams"
        badgeColor="gray"
        variant="default"
      />

      <StatCard
        label="Fumbles Lost"
        value={`${fumblesLost}`}
        subtext="Lost"
        badge="Special Teams"
        badgeColor="gray"
        variant="default"
      />

      <StatCard
        label="Passing Touchdowns"
        value={`${passingTouchdowns}`}
        subtext="Thrown"
        badge="Offense"
        badgeColor="blue"
        variant="default"
      />

      <StatCard
        label="Rushing Touchdowns"
        value={`${rushingTouchdowns}`}
        subtext="Scored"
        badge="Offense"
        badgeColor="blue"
        variant="default"
      />

      <StatCard
        label="Receiving Touchdowns"
        value={`${receivingTouchdowns}`}
        subtext="Caught"
        badge="Offense"
        badgeColor="blue"
        variant="default"
      />

      <StatCard
        label="Interceptions"
        value={`${interceptions}`}
        subtext="Thrown"
        badge="Defense"
        badgeColor="orange"
        variant="default"
      />

      <StatCard
        label="Fumbles Lost"
        value={`${fumblesLost}`}
        subtext="Lost"
        badge="Defense"
        badgeColor="orange"
        variant="default"
      />

    </div>
  );
}

/**
 * Debug info component
 */
interface DebugInfoProps {
  showDebug: boolean;
  hasData: boolean;
}

function DebugInfo(props: DebugInfoProps): React.ReactElement | null {
  const { showDebug, hasData } = props;

  if (!showDebug || hasData) {
    return null;
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800/50 dark:bg-blue-900/10">
      <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
        Using fallback data. Check console (F12) for API response details.
      </p>
      <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-1 break-all">
        Endpoint: https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/teams/3/statistics
      </p>
    </div>
  );
}

// ========================================================================
// MAIN COMPONENT
// ========================================================================

/**
 * TeamStatsSection Component
 * 
 * Displays team statistics in a responsive grid layout
 * Integrates with useTeamStats hook to fetch ESPN data
 * Falls back to sample data when API is unavailable
 * 
 * @example
 * <TeamStatsSection />
 * 
 * @example
 * <TeamStatsSection teamId="3" teamName="Chicago Bears" showDebug={true} />
 */
export function TeamStatsSection(props: TeamStatsSectionProps): React.ReactElement {
  const {
    teamId = '3',
    teamName = 'Chicago Bears',
    showDebug = false,
  } = props;

  const { stats, loading, error } = useTeamStats();

  // Memoize display stats to prevent unnecessary recalculations
  const displayStats = useMemo((): FallbackStats => {
    if (stats) {
      return stats;
    }
    return FALLBACK_STATS;
  }, [stats]);

  // Render error state
  if (error) {
    return <ErrorMessage error={error} showDebug={showDebug} />;
  }

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Team Statistics
        </h3>
        <LoadingSkeleton count={SKELETON_CONFIG.count} height={SKELETON_CONFIG.height} />
      </div>
    );
  }

  // Render content
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Team Statistics
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          2025 NFL Season
          {!stats && (
            <span className="ml-2 text-yellow-600 dark:text-yellow-400">
              (Using sample data)
            </span>
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid
        passingYards={displayStats.passingYards}
        rushingYards={displayStats.rushingYards}
        pointsFor={displayStats.pointsFor}
        pointsAgainst={displayStats.pointsAgainst}
        turnovers={displayStats.turnovers}
        thirdDownConversions={displayStats.thirdDownConversions}
        thirdDownAttempts={displayStats.thirdDownAttempts}
        thirdDownPercentage={displayStats.thirdDownPercentage}
        passingTouchdowns={displayStats.passingTouchdowns}
        rushingTouchdowns={displayStats.rushingTouchdowns}
        receivingTouchdowns={displayStats.receivingTouchdowns}
        interceptions={displayStats.interceptions}
        fumblesLost={displayStats.fumblesLost}
      />

      {/* Debug Info */}
      <DebugInfo showDebug={showDebug} hasData={stats !== null} />
    </div>
  );
}

export default TeamStatsSection;

/**
 * ========================================================================
 * TYPE SAFETY NOTES
 * ========================================================================
 * 
 * This component is 100% strict TypeScript:
 * 
 * ✅ All props are explicitly typed (TeamStatsSectionProps)
 * ✅ All subcomponents have explicit prop types
 * ✅ No implicit any types
 * ✅ All functions have explicit return types (React.ReactElement)
 * ✅ All hook results are properly typed
 * ✅ All event handlers are properly typed
 * ✅ useMemo dependency array properly typed
 * ✅ Array mapping with explicit index type
 * 
 * ========================================================================
 * USAGE
 * ========================================================================
 * 
 * Basic usage (uses defaults):
 * <TeamStatsSection />
 * 
 * With debugging:
 * <TeamStatsSection showDebug={true} />
 * 
 * Custom team (if endpoint is made dynamic):
 * <TeamStatsSection teamId="23" teamName="Pittsburgh Steelers" />
 * 
 * In dashboard:
 * import { TeamStatsSection } from '@/components/features/bears-dashboard/TeamStatsSection';
 * 
 * export default function Dashboard() {
 *   return (
 *     <div className="space-y-6">
 *       <OverviewSection />
 *       <TeamStatsSection />
 *       <UpcomingGamesSection />
 *     </div>
 *   );
 * }
 */