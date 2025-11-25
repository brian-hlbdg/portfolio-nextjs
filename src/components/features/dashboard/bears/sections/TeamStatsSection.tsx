/**
 * src/components/features/bears-dashboard/TeamStatsSection.tsx
 * ========================================================================
 * TEAM STATS SECTION - WITH BADGE FILTER - STRICT TYPESCRIPT (NO ANY TYPES)
 * 
 * Displays team statistics in a grid using reusable StatCard component
 * Includes badge-based filtering to show/hide stats by category
 * Fully typed with all ESPN data structures explicitly defined
 */

'use client';

import React, { useState, useMemo } from 'react';
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

/**
 * Badge filter type - define available badge categories
 */
type BadgeFilter = 'Offense' | 'Defense' | 'Special Teams';

/**
 * Badge option with display information
 */
interface BadgeOption {
  label: BadgeFilter;
  color: 'blue' | 'orange' | 'gray';
  count: number;
}

/**
 * Stat definition with badge metadata
 */
interface StatDefinition {
  key: keyof FallbackStats;
  label: string;
  unit: string;
  description: string;
  badge: {
    label: BadgeFilter;
    color: 'blue' | 'orange' | 'gray';
  };
  format?: (value: number) => string;
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

/**
 * Define all available stats with their badge category
 * This is the source of truth for stat organization and filtering
 */
const STATS_DEFINITIONS: StatDefinition[] = [
  // OFFENSE STATS
  {
    key: 'passingYards',
    label: 'Passing Yards',
    unit: 'yds',
    description: 'Season total',
    badge: { label: 'Offense', color: 'blue' },
  },
  {
    key: 'rushingYards',
    label: 'Rushing Yards',
    unit: 'yds',
    description: 'Season total',
    badge: { label: 'Offense', color: 'blue' },
  },
  {
    key: 'pointsFor',
    label: 'Scoring Offense',
    unit: 'pts',
    description: 'Points scored',
    badge: { label: 'Offense', color: 'blue' },
  },
  {
    key: 'passingTouchdowns',
    label: 'Passing Touchdowns',
    unit: 'TD',
    description: 'Thrown',
    badge: { label: 'Offense', color: 'blue' },
  },
  {
    key: 'rushingTouchdowns',
    label: 'Rushing Touchdowns',
    unit: 'TD',
    description: 'Scored',
    badge: { label: 'Offense', color: 'blue' },
  },
  {
    key: 'receivingTouchdowns',
    label: 'Receiving Touchdowns',
    unit: 'TD',
    description: 'Caught',
    badge: { label: 'Offense', color: 'blue' },
  },

  // DEFENSE STATS
  {
    key: 'pointsAgainst',
    label: 'Scoring Defense',
    unit: 'pts',
    description: 'Points allowed',
    badge: { label: 'Defense', color: 'orange' },
  },
  {
    key: 'interceptions',
    label: 'Interceptions',
    unit: 'INT',
    description: 'Thrown',
    badge: { label: 'Defense', color: 'orange' },
  },
  {
    key: 'fumblesLost',
    label: 'Fumbles Lost',
    unit: '',
    description: 'Lost',
    badge: { label: 'Defense', color: 'orange' },
  },

  // SPECIAL TEAMS / EFFICIENCY
  {
    key: 'turnovers',
    label: 'Turnovers',
    unit: '',
    description: 'Lost (fumbles + INT)',
    badge: { label: 'Special Teams', color: 'gray' },
  },
  {
    key: 'thirdDownPercentage',
    label: '3rd Down Conversion',
    unit: '%',
    description: 'Conversion efficiency',
    badge: { label: 'Special Teams', color: 'gray' },
  },
];

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
      {Array.from({ length: count }).map((_: unknown, i: number) => (
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
 * Filter button group component
 */
interface FilterButtonGroupProps {
  badgeOptions: BadgeOption[];
  selectedBadges: Set<BadgeFilter>;
  onToggleBadge: (badge: BadgeFilter) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  filteredCount: number;
  totalCount: number;
}

function FilterButtonGroup(props: FilterButtonGroupProps): React.ReactElement {
  const {
    badgeOptions,
    selectedBadges,
    onToggleBadge,
    onSelectAll,
    onClearAll,
    filteredCount,
    totalCount,
  } = props;

  return (
    <div className="space-y-3">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {badgeOptions.map((option: BadgeOption) => {
          const isSelected: boolean = selectedBadges.has(option.label);

          const badgeColorClasses: Record<
            'blue' | 'orange' | 'gray',
            string
          > = {
            blue: isSelected
              ? 'bg-blue-500/30 border-blue-500 text-blue-400'
              : 'bg-slate-500/10 border-slate-500/30 text-slate-400 hover:border-slate-500/50',
            orange: isSelected
              ? 'bg-orange-500/30 border-orange-500 text-orange-400'
              : 'bg-slate-500/10 border-slate-500/30 text-slate-400 hover:border-slate-500/50',
            gray: isSelected
              ? 'bg-slate-500/30 border-slate-500 text-slate-300'
              : 'bg-slate-500/10 border-slate-500/30 text-slate-400 hover:border-slate-500/50',
          };

          return (
            <button
              key={option.label}
              onClick={() => onToggleBadge(option.label)}
              className={`
                px-4 py-2 rounded-lg border transition-all duration-200
                ${badgeColorClasses[option.color]}
              `}
            >
              <span className="font-medium">
                {isSelected ? '✓' : ''} {option.label}
              </span>
              <span className="ml-2 opacity-75">({option.count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 text-sm flex-wrap items-center">
        <button
          onClick={onSelectAll}
          className="px-3 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={onClearAll}
          className="px-3 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          Clear All
        </button>
        {filteredCount > 0 && (
          <span className="ml-auto text-slate-500">
            Showing {filteredCount} of {totalCount} stats
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Stats grid component
 */
interface StatsGridProps {
  stats: FallbackStats;
  filteredDefinitions: StatDefinition[];
}

function StatsGrid(props: StatsGridProps): React.ReactElement {
  const { stats, filteredDefinitions } = props;

  if (filteredDefinitions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">
          No stats selected. Choose a category to view stats.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredDefinitions.map((statDef: StatDefinition) => {
        const value: number = stats[statDef.key];

        return (
          <div key={statDef.key} className="animate-fadeIn">
            <StatCard
              label={statDef.label}
              value={`${value}${statDef.unit ? ' ' : ''}`}
              subtext={statDef.description}
              badge={statDef.badge.label}
              badgeColor={statDef.badge.color}
              variant="default"
            />
          </div>
        );
      })}
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
        Endpoint:
        https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/teams/3/statistics
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
 * Includes badge-based filtering to show/hide stats by category
 * Integrates with useTeamStats hook to fetch ESPN data
 * Falls back to sample data when API is unavailable
 *
 * @example
 * <TeamStatsSection />
 *
 * @example
 * <TeamStatsSection teamId="3" teamName="Chicago Bears" showDebug={true} />
 */
export function TeamStatsSection(
  props: TeamStatsSectionProps
): React.ReactElement {
  const {
    teamId = '3',
    teamName = 'Chicago Bears',
    showDebug = false,
  } = props;

  const { stats, loading, error } = useTeamStats();

  // ========================================================================
  // STATE
  // ========================================================================

  const [selectedBadges, setSelectedBadges] = useState<Set<BadgeFilter>>(
    new Set(['Offense', 'Defense', 'Special Teams'])
  );

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  /**
   * Count stats per badge for the filter UI
   */
  const badgeOptions = useMemo((): BadgeOption[] => {
    const counts: Record<BadgeFilter, number> = {
      Offense: 0,
      Defense: 0,
      'Special Teams': 0,
    };

    for (const stat of STATS_DEFINITIONS) {
      counts[stat.badge.label]++;
    }

    return [
      { label: 'Offense', color: 'blue', count: counts.Offense },
      { label: 'Defense', color: 'orange', count: counts.Defense },
      {
        label: 'Special Teams',
        color: 'gray',
        count: counts['Special Teams'],
      },
    ];
  }, []);

  /**
   * Filter stats based on selected badges
   */
  const filteredDefinitions = useMemo((): StatDefinition[] => {
    return STATS_DEFINITIONS.filter((stat: StatDefinition) =>
      selectedBadges.has(stat.badge.label)
    );
  }, [selectedBadges]);

  /**
   * Memoize display stats to prevent unnecessary recalculations
   */
  const displayStats = useMemo((): FallbackStats => {
    if (stats) {
      return stats;
    }
    return FALLBACK_STATS;
  }, [stats]);

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const toggleBadge = (badge: BadgeFilter): void => {
    const newSelected = new Set(selectedBadges);

    if (newSelected.has(badge)) {
      newSelected.delete(badge);
    } else {
      newSelected.add(badge);
    }

    setSelectedBadges(newSelected);
  };

  const selectAll = (): void => {
    setSelectedBadges(
      new Set(['Offense', 'Defense', 'Special Teams'])
    );
  };

  const clearAll = (): void => {
    setSelectedBadges(new Set());
  };

  // ========================================================================
  // RENDER - ERROR STATE
  // ========================================================================

  if (error) {
    return <ErrorMessage error={error} showDebug={showDebug} />;
  }

  // ========================================================================
  // RENDER - LOADING STATE
  // ========================================================================

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Team Statistics
        </h3>
        <div className="flex gap-2 flex-wrap">
          {[...Array(3)].map((_: unknown, i: number) => (
            <div
              key={i}
              className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
        <LoadingSkeleton count={SKELETON_CONFIG.count} height={SKELETON_CONFIG.height} />
      </div>
    );
  }

  // ========================================================================
  // RENDER - CONTENT
  // ========================================================================

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

      {/* Filter Button Group */}
      <FilterButtonGroup
        badgeOptions={badgeOptions}
        selectedBadges={selectedBadges}
        onToggleBadge={toggleBadge}
        onSelectAll={selectAll}
        onClearAll={clearAll}
        filteredCount={filteredDefinitions.length}
        totalCount={STATS_DEFINITIONS.length}
      />

      {/* Stats Grid */}
      <StatsGrid stats={displayStats} filteredDefinitions={filteredDefinitions} />

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
 * ✅ useMemo dependency arrays properly typed
 * ✅ Array mapping with explicit index type
 * ✅ Badge filter state properly typed with Set<BadgeFilter>
 * ✅ Computed values properly memoized
 *
 * ========================================================================
 * NEW FEATURES
 * ========================================================================
 *
 * Badge Filtering:
 * • Filter stats by category (Offense, Defense, Special Teams)
 * • All categories selected by default
 * • Click buttons to toggle categories
 * • Select All / Clear All shortcuts
 * • Shows count of visible stats
 * • Smooth fade animations when toggling
 *
 * Extensibility:
 * • Easy to add new stats - just add to STATS_DEFINITIONS
 * • Easy to add new badges - update BadgeFilter type and add stats
 * • DRY principle - STATS_DEFINITIONS is single source of truth
 * • Component automatically updates when stats are added/removed
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
 *
 * ========================================================================
 * HOW TO ADD MORE STATS
 * ========================================================================
 *
 * 1. Add to STATS_DEFINITIONS array:
 *    {
 *      key: 'passingTouchdowns',
 *      label: 'Passing Touchdowns',
 *      unit: 'TD',
 *      description: 'QB scoring',
 *      badge: { label: 'Offense', color: 'blue' },
 *    },
 *
 * 2. Make sure FallbackStats interface includes the field
 *
 * 3. Make sure useTeamStats hook includes the field
 *
 * 4. Done! Component automatically updates:
 *    - "Offense" button count increases
 *    - Stat appears when Offense is selected
 *    - Counter updates correctly
 *
 * ========================================================================
 * HOW TO ADD NEW BADGES
 * ========================================================================
 *
 * 1. Update BadgeFilter type:
 *    type BadgeFilter = 'Offense' | 'Defense' | 'Special Teams' | 'QB Stats';
 *
 * 2. Add stats to STATS_DEFINITIONS with new badge:
 *    {
 *      key: 'newStat',
 *      label: 'New Stat',
 *      unit: 'unit',
 *      description: 'description',
 *      badge: { label: 'QB Stats', color: 'purple' },
 *    }
 *
 * 3. Update badgeColorClasses in FilterButtonGroup if adding new color
 *
 * 4. Done! New badge button appears automatically with count
 *
 * ========================================================================
 * CSS ANIMATION REQUIRED
 * ========================================================================
 *
 * Add this to src/app/globals.css or tailwind.config.js:
 *
 * @layer utilities {
 *   @keyframes fadeIn {
 *     from {
 *       opacity: 0;
 *       transform: translateY(4px);
 *     }
 *     to {
 *       opacity: 1;
 *       transform: translateY(0);
 *     }
 *   }
 *
 *   .animate-fadeIn {
 *     animation: fadeIn 0.2s ease-in-out;
 *   }
 * }
 */