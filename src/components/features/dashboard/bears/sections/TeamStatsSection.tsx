/**
 * src/components/features/dashboard/bears/sections/TeamStatsSection.tsx
 * ========================================================================
 * ENHANCED TEAM STATS SECTION V2 - With Team Leaders
 * 
 * Updates:
 * - Integrated team leaders from useTeamLeaders hook
 * - Fixed pointsAgainst calculation (totalPoints - scoringMargin)
 * - Fixed red zone stat mapping
 * - Per-game shown when available (> 0)
 * - 6 category filters with proper colors
 * 
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useTeamStats, TeamStats, StatValue } from '@/hooks/useTeamStats';
import { useTeamLeaders, getLeaderForStat } from '@/hooks/useTeamLeaders';
import { StatSpotlightCard, StatSpotlightCardSkeleton } from '../cards/StatSpotlightCard';
import {
  StatCategory,
  CATEGORY_COLORS,
  getCategoryCount,
} from '@/components/features/types/teamStats.types';

// ========================================================================
// TYPES
// ========================================================================

interface TeamStatsSectionProps {
  /** Show debug panel */
  showDebug?: boolean;
}

/**
 * Stat card configuration with leader mapping
 */
interface StatCardConfig {
  id: string;
  category: StatCategory;
  title: string;
  description: string;
  primaryStatKey: string;
  primaryFormat?: (value: number) => string;
  supportingMetrics: Array<{
    key: string;
    label: string;
    format?: (value: number) => string;
  }>;
  showRank?: boolean;
  leaderCategory?: string; // Maps to useTeamLeaders categories
}

// ========================================================================
// STAT CARD CONFIGURATIONS
// ========================================================================

const STAT_CARD_CONFIGS: StatCardConfig[] = [
  // ========== PASSING ==========
  {
    id: 'passing-yards',
    category: 'Passing',
    title: 'Passing Yards',
    description: 'Season Total',
    primaryStatKey: 'passing.yards',
    supportingMetrics: [
      { key: 'passing.touchdowns', label: 'TDs' },
      { key: 'passing.completionPercentage', label: 'Comp%', format: (v) => `${v.toFixed(1)}%` },
      { key: 'passing.longest', label: 'Long' },
    ],
    showRank: true,
    leaderCategory: 'passing',
  },
  {
    id: 'passing-tds',
    category: 'Passing',
    title: 'Passing TDs',
    description: 'Touchdowns Thrown',
    primaryStatKey: 'passing.touchdowns',
    supportingMetrics: [
      { key: 'passing.interceptions', label: 'INTs' },
      { key: 'passing.qbRating', label: 'Rating', format: (v) => v.toFixed(1) },
    ],
    showRank: true,
    leaderCategory: 'passing',
  },

  // ========== RUSHING ==========
  {
    id: 'rushing-yards',
    category: 'Rushing',
    title: 'Rushing Yards',
    description: 'Season Total',
    primaryStatKey: 'rushing.yards',
    supportingMetrics: [
      { key: 'rushing.touchdowns', label: 'TDs' },
      { key: 'rushing.yardsPerAttempt', label: 'YPC', format: (v) => v.toFixed(1) },
      { key: 'rushing.longest', label: 'Long' },
    ],
    showRank: true,
    leaderCategory: 'rushing',
  },
  {
    id: 'rushing-tds',
    category: 'Rushing',
    title: 'Rushing TDs',
    description: 'Touchdowns Scored',
    primaryStatKey: 'rushing.touchdowns',
    supportingMetrics: [
      { key: 'rushing.attempts', label: 'Carries' },
      { key: 'rushing.fumbles', label: 'Fumbles' },
    ],
    showRank: true,
    leaderCategory: 'rushing',
  },

  // ========== SCORING ==========
  {
    id: 'scoring-offense',
    category: 'Scoring',
    title: 'Points Scored',
    description: 'Total Offense',
    primaryStatKey: 'scoring.totalPoints',
    supportingMetrics: [
      { key: 'scoring.touchdowns', label: 'TDs' },
      { key: 'scoring.fieldGoalsMade', label: 'FGs' },
      { key: 'scoring.redZonePercentage', label: 'RZ%', format: (v) => `${v.toFixed(0)}%` },
    ],
    showRank: true,
    leaderCategory: 'touchdowns',
  },
  {
    id: 'red-zone',
    category: 'Scoring',
    title: 'Red Zone',
    description: 'Scoring Efficiency',
    primaryStatKey: 'scoring.redZonePercentage',
    primaryFormat: (v) => `${v.toFixed(0)}%`,
    supportingMetrics: [
      { key: 'scoring.redZoneTouchdowns', label: 'TDs' },
      { key: 'scoring.redZoneAttempts', label: 'Trips' },
    ],
    showRank: true,
  },

  // ========== DEFENSE ==========
  {
    id: 'points-allowed',
    category: 'Defense',
    title: 'Points Allowed',
    description: 'Scoring Defense',
    primaryStatKey: 'defense.pointsAllowed',
    supportingMetrics: [
      { key: 'defense.sacks', label: 'Sacks' },
      { key: 'defense.interceptions', label: 'INTs' },
      { key: 'defense.forcedFumbles', label: 'FF' },
    ],
    showRank: true,
    leaderCategory: 'tackles',
  },
  {
    id: 'defensive-sacks',
    category: 'Defense',
    title: 'Sacks',
    description: 'Quarterback Takedowns',
    primaryStatKey: 'defense.sacks',
    supportingMetrics: [
      { key: 'defense.tacklesForLoss', label: 'TFL' },
      { key: 'defense.passesDefended', label: 'PD' },
    ],
    showRank: true,
    leaderCategory: 'sacks',
  },

  // ========== TURNOVERS ==========
  {
    id: 'turnover-differential',
    category: 'Turnovers',
    title: 'Turnover Diff',
    description: 'Takeaways - Giveaways',
    primaryStatKey: 'turnovers.differential',
    primaryFormat: (v) => (v > 0 ? `+${v}` : `${v}`),
    supportingMetrics: [
      { key: 'turnovers.takeaways', label: 'Takes' },
      { key: 'turnovers.giveaways', label: 'Gives' },
    ],
    showRank: true,
    leaderCategory: 'interceptions',
  },
  {
    id: 'interceptions-thrown',
    category: 'Turnovers',
    title: 'INTs Thrown',
    description: 'Interceptions Lost',
    primaryStatKey: 'turnovers.interceptionsThrown',
    supportingMetrics: [
      { key: 'turnovers.fumblesLost', label: 'Fumbles' },
      { key: 'turnovers.giveaways', label: 'Total' },
    ],
    showRank: true,
  },

  // ========== EFFICIENCY ==========
  {
    id: 'third-down',
    category: 'Efficiency',
    title: '3rd Down',
    description: 'Conversion Rate',
    primaryStatKey: 'efficiency.thirdDownPercentage',
    primaryFormat: (v) => `${v.toFixed(0)}%`,
    supportingMetrics: [
      { key: 'efficiency.thirdDownConversions', label: 'Conv' },
      { key: 'efficiency.thirdDownAttempts', label: 'Att' },
    ],
    showRank: true,
  },
  {
    id: 'yards-per-play',
    category: 'Efficiency',
    title: 'Yards/Play',
    description: 'Offensive Efficiency',
    primaryStatKey: 'efficiency.yardsPerPlay',
    primaryFormat: (v) => v.toFixed(1),
    supportingMetrics: [
      { key: 'efficiency.firstDowns', label: '1st Downs' },
      { key: 'efficiency.penaltyYards', label: 'Pen Yds' },
    ],
    showRank: true,
  },
];

// ========================================================================
// CATEGORY FILTER COMPONENT
// ========================================================================

interface CategoryFilterProps {
  categories: StatCategory[];
  selectedCategories: Set<StatCategory>;
  onToggle: (category: StatCategory) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  filteredCount: number;
  totalCount: number;
}

function CategoryFilter({
  categories,
  selectedCategories,
  onToggle,
  onSelectAll,
  onClearAll,
  filteredCount,
  totalCount,
}: CategoryFilterProps): React.ReactElement {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
    green: 'bg-green-600 hover:bg-green-700 border-green-500',
    amber: 'bg-amber-600 hover:bg-amber-700 border-amber-500',
    orange: 'bg-orange-600 hover:bg-orange-700 border-orange-500',
    red: 'bg-red-600 hover:bg-red-700 border-red-500',
    purple: 'bg-purple-600 hover:bg-purple-700 border-purple-500',
  };

  const inactiveClass = 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-300';

  // Count configs per category
  const getCatCount = (cat: StatCategory): number => {
    return STAT_CARD_CONFIGS.filter(c => c.category === cat).length;
  };

  return (
    <div className="space-y-3">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.has(category);
          const color = CATEGORY_COLORS[category];
          const count = getCatCount(category);
          const activeClass = colorMap[color] || colorMap.blue;

          return (
            <button
              key={category}
              onClick={() => onToggle(category)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5
                rounded-lg border text-sm font-medium
                transition-all duration-150
                ${isSelected ? activeClass + ' text-white' : inactiveClass}
              `}
            >
              {isSelected && (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {category}
              <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Quick Actions & Count */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-3">
          <button
            onClick={onSelectAll}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>
        <span className="text-slate-500">
          Showing {filteredCount} of {totalCount} stats
        </span>
      </div>
    </div>
  );
}

// ========================================================================
// HELPER: Extract nested stat value
// ========================================================================

function getNestedValue(obj: TeamStats, path: string): StatValue | undefined {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  if (
    current !== null &&
    typeof current === 'object' &&
    'value' in current
  ) {
    return current as StatValue;
  }

  return undefined;
}

// ========================================================================
// HELPER: Build card data from config
// ========================================================================

interface CardData {
  id: string;
  category: StatCategory;
  title: string;
  description: string;
  primaryValue: string;
  supportingMetrics: Array<{ label: string; value: string }>;
  rank?: number;
  perGame?: number;
}

function buildCardData(config: StatCardConfig, stats: TeamStats): CardData {
  const primaryStat = getNestedValue(stats, config.primaryStatKey);
  const primaryValue = primaryStat?.value ?? 0;
  const formattedPrimary = config.primaryFormat
    ? config.primaryFormat(primaryValue)
    : primaryValue.toLocaleString();

  const supportingMetrics = config.supportingMetrics.map((metric) => {
    const stat = getNestedValue(stats, metric.key);
    const value = stat?.value ?? 0;
    const formatted = metric.format ? metric.format(value) : value.toLocaleString();
    return {
      label: metric.label,
      value: formatted,
    };
  });

  return {
    id: config.id,
    category: config.category,
    title: config.title,
    description: config.description,
    primaryValue: formattedPrimary,
    supportingMetrics,
    rank: primaryStat?.rank,
    perGame: primaryStat?.perGame,
  };
}

// ========================================================================
// MAIN COMPONENT
// ========================================================================

export function TeamStatsSection({
  showDebug = false,
}: TeamStatsSectionProps): React.ReactElement {
  // Fetch team stats
  const { stats, loading: statsLoading, error: statsError, rawCategories } = useTeamStats();
  
  // Fetch team leaders
  const { leaders, loading: leadersLoading, source: leadersSource } = useTeamLeaders();

  const loading = statsLoading || leadersLoading;

  // ========================================================================
  // STATE: Category filters
  // ========================================================================

  const allCategories: StatCategory[] = [
    'Passing',
    'Rushing',
    'Scoring',
    'Defense',
    'Turnovers',
    'Efficiency',
  ];

  const [selectedCategories, setSelectedCategories] = useState<Set<StatCategory>>(
    new Set(allCategories)
  );

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const toggleCategory = (category: StatCategory): void => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setSelectedCategories(newSet);
  };

  const selectAll = (): void => {
    setSelectedCategories(new Set(allCategories));
  };

  const clearAll = (): void => {
    setSelectedCategories(new Set());
  };

  // ========================================================================
  // COMPUTED: Filtered configs
  // ========================================================================

  const filteredConfigs = useMemo(() => {
    return STAT_CARD_CONFIGS.filter((config) =>
      selectedCategories.has(config.category)
    );
  }, [selectedCategories]);

  // ========================================================================
  // RENDER: Loading State
  // ========================================================================

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Team Statistics</h3>
          <p className="text-sm text-slate-400">Loading 2025 NFL Season data...</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-9 w-24 bg-slate-700 rounded-lg animate-pulse"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <StatSpotlightCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ========================================================================
  // RENDER: Error State
  // ========================================================================

  if (statsError) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Team Statistics</h3>
          <p className="text-sm text-red-400">Error loading stats: {statsError}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300">
            Unable to fetch team statistics. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // ========================================================================
  // RENDER: Main Content
  // ========================================================================

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">Team Statistics</h3>
        <p className="text-sm text-slate-400">
          2025 NFL Season
          {stats?.source === 'fallback' && (
            <span className="ml-2 text-yellow-400">(Sample Data)</span>
          )}
          {leadersSource === 'fallback' && (
            <span className="ml-2 text-blue-400">(Leader data cached)</span>
          )}
        </p>
      </div>

      {/* Category Filters */}
      <CategoryFilter
        categories={allCategories}
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
        onSelectAll={selectAll}
        onClearAll={clearAll}
        filteredCount={filteredConfigs.length}
        totalCount={STAT_CARD_CONFIGS.length}
      />

      {/* Stats Grid */}
      {filteredConfigs.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No categories selected. Click a category above to show stats.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConfigs.map((config) => {
            // Build card data
            const cardData = stats
              ? buildCardData(config, stats)
              : {
                  id: config.id,
                  category: config.category,
                  title: config.title,
                  description: config.description,
                  primaryValue: '—',
                  supportingMetrics: config.supportingMetrics.map((m) => ({
                    label: m.label,
                    value: '—',
                  })),
                };

            // Get leaders for this card
            const cardLeaders = getLeaderForStat(config.id, leaders);

            return (
              <StatSpotlightCard
                key={cardData.id}
                category={cardData.category}
                title={cardData.title}
                description={cardData.description}
                primaryValue={cardData.primaryValue}
                supportingMetrics={cardData.supportingMetrics}
                rank={cardData.rank}
                perGame={cardData.perGame}
                showRank={config.showRank}
                leaders={cardLeaders}
              />
            );
          })}
        </div>
      )}

      {/* Debug Panel */}
      {showDebug && rawCategories.size > 0 && (
        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">
            🔧 Debug: ESPN API Categories ({rawCategories.size})
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {Array.from(rawCategories.entries()).map(([name, catStats]) => (
              <div key={name} className="text-slate-400">
                <span className="text-purple-400">{name}:</span>{' '}
                {catStats.length} stats
                <span className="text-slate-600 ml-2">
                  [{catStats.slice(0, 3).map((s) => s.name).join(', ')}...]
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-3">
            Check browser console (F12) for full stat details
          </p>
        </div>
      )}
    </div>
  );
}

export default TeamStatsSection;