/**
 * src/types/teamStats.types.ts
 * ========================================================================
 * TYPE DEFINITIONS FOR ENHANCED TEAM STATS V2
 * 
 * Updates:
 * - 6 categories: Passing, Rushing, Scoring, Defense, Turnovers, Efficiency
 * - Category color mapping
 * - Rank formatting helpers
 * ========================================================================
 */

// ========================================================================
// STAT CATEGORY TYPES
// ========================================================================

/**
 * Badge categories for filtering
 */
export type StatCategory = 
  | 'Passing'
  | 'Rushing'
  | 'Scoring'
  | 'Defense'
  | 'Turnovers'
  | 'Efficiency';

/**
 * Category color mapping
 */
export const CATEGORY_COLORS: Record<StatCategory, string> = {
  Passing: 'blue',
  Rushing: 'green',
  Scoring: 'amber',
  Defense: 'orange',
  Turnovers: 'red',
  Efficiency: 'purple',
};

// ========================================================================
// STAT VALUE TYPES
// ========================================================================

/**
 * A single statistic value with metadata
 */
export interface StatValue {
  value: number;
  displayValue?: string;
  perGame?: number;
  rank?: number;
  rankDisplay?: string;
}

/**
 * A supporting metric shown under the main stat
 */
export interface SupportingMetric {
  label: string;
  value: string;
  tooltip?: string;
}

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Get category count from a configs array
 */
export function getCategoryCount(category: StatCategory): number {
  // This is a placeholder - actual count comes from STAT_CARD_CONFIGS
  const counts: Record<StatCategory, number> = {
    Passing: 2,
    Rushing: 2,
    Scoring: 2,
    Defense: 2,
    Turnovers: 2,
    Efficiency: 2,
  };
  return counts[category];
}

/**
 * Format rank for display
 * Adds ordinal suffix (1st, 2nd, 3rd, etc.)
 */
export function formatRank(rank: number | undefined): string {
  if (rank === undefined || rank === 0) return '-';
  
  const lastDigit = rank % 10;
  const lastTwoDigits = rank % 100;
  
  let suffix = 'th';
  if (lastTwoDigits < 11 || lastTwoDigits > 13) {
    if (lastDigit === 1) suffix = 'st';
    else if (lastDigit === 2) suffix = 'nd';
    else if (lastDigit === 3) suffix = 'rd';
  }
  
  return `${rank}${suffix}`;
}

/**
 * Get rank quality indicator
 * Returns 'good' (1-10), 'average' (11-21), 'poor' (22-32)
 */
export function getRankQuality(rank: number | undefined): 'good' | 'average' | 'poor' | 'unknown' {
  if (rank === undefined || rank === 0) return 'unknown';
  if (rank <= 10) return 'good';
  if (rank <= 21) return 'average';
  return 'poor';
}

/**
 * Get color class for rank quality
 */
export function getRankColorClass(rank: number | undefined): string {
  const quality = getRankQuality(rank);
  switch (quality) {
    case 'good': return 'text-green-500';
    case 'average': return 'text-yellow-500';
    case 'poor': return 'text-red-500';
    default: return 'text-slate-400';
  }
}

/**
 * Get all categories
 */
export function getAllCategories(): StatCategory[] {
  return ['Passing', 'Rushing', 'Scoring', 'Defense', 'Turnovers', 'Efficiency'];
}