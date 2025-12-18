/**
 * src/components/features/dashboard/bears/cards/OverviewStatCard.tsx
 * ========================================================================
 * Enhanced stat card for the Bears Dashboard Overview section
 * 
 * Supports multiple layout sections:
 * - Header: Title with optional badge
 * - Primary: Large headline stats (1-2 items)
 * - Secondary: Supporting stats in a compact grid
 * - Footer: Contextual info (CONSISTENT HEIGHT across all cards)
 * 
 * Design Principles:
 * - Minimalist feel with clear hierarchy
 * - Easy to scan at a glance
 * - Bears brand colors (orange accents)
 * - Responsive across breakpoints
 * - CONSISTENT FOOTER HEIGHT on all cards
 * 
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

import React from 'react';

// ========================================================================
// TYPES
// ========================================================================

/**
 * A single stat item (label + value)
 */
export interface StatItem {
  label: string;
  value: string | number;
  /** Optional highlight color */
  highlight?: 'orange' | 'green' | 'red' | 'blue' | 'gray';
  /** Optional small text below value */
  subtext?: string;
}

/**
 * Footer item with icon support
 */
export interface FooterItem {
  label: string;
  value: string;
  /** Icon type for visual indicator */
  icon?: 'win' | 'loss' | 'tie' | 'up' | 'down' | 'neutral' | 'playoff' | 'eliminated';
}

/**
 * Props for OverviewStatCard
 */
export interface OverviewStatCardProps {
  /** Card title */
  title: string;
  /** Optional badge (e.g., "Offense", "Defense") */
  badge?: {
    text: string;
    color?: 'orange' | 'blue' | 'green' | 'red' | 'gray';
  };
  /** Primary stats (large, prominent) - max 2 recommended */
  primaryStats: StatItem[];
  /** Secondary stats (smaller, supporting) - displayed in grid */
  secondaryStats?: StatItem[];
  /** Footer items (contextual info) - ALWAYS 2 items for consistent height */
  footerItems?: FooterItem[];
  /** Card variant */
  variant?: 'default' | 'highlight' | 'muted';
  /** Loading state */
  loading?: boolean;
}

// ========================================================================
// HELPER COMPONENTS
// ========================================================================

/**
 * Badge component for card header
 */
function CardBadge({ 
  text, 
  color = 'gray' 
}: { 
  text: string; 
  color?: 'orange' | 'blue' | 'green' | 'red' | 'gray';
}): React.ReactElement {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/50',
    blue: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/50',
    green: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50',
    red: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/50',
    gray: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/50',
  };

  return (
    <span 
      className={`
        text-xs font-semibold px-2 py-0.5 rounded border
        ${colorClasses[color]}
      `}
    >
      {text}
    </span>
  );
}

/**
 * Footer icon component
 */
function FooterIcon({ 
  type 
}: { 
  type: FooterItem['icon'];
}): React.ReactElement | null {
  if (!type) return null;

  const iconMap: Record<string, { symbol: string; colorClass: string }> = {
    win: { symbol: 'W', colorClass: 'bg-green-500/20 text-green-500' },
    loss: { symbol: 'L', colorClass: 'bg-red-500/20 text-red-500' },
    tie: { symbol: 'T', colorClass: 'bg-gray-500/20 text-gray-500' },
    up: { symbol: '↑', colorClass: 'text-green-500' },
    down: { symbol: '↓', colorClass: 'text-red-500' },
    neutral: { symbol: '→', colorClass: 'text-gray-500' },
    playoff: { symbol: '✓', colorClass: 'bg-green-500/20 text-green-500' },
    eliminated: { symbol: '✗', colorClass: 'bg-red-500/20 text-red-500' },
  };

  const icon = iconMap[type];
  if (!icon) return null;

  return (
    <span 
      className={`
        inline-flex items-center justify-center 
        w-5 h-5 rounded text-xs font-bold
        ${icon.colorClass}
      `}
    >
      {icon.symbol}
    </span>
  );
}

/**
 * Loading skeleton for the card
 */
function CardSkeleton(): React.ReactElement {
  return (
    <div className="bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4 animate-pulse h-full flex flex-col">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24" />
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-16" />
      </div>
      
      {/* Primary stats skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-32" />
      </div>
      
      {/* Secondary stats skeleton */}
      <div className="grid grid-cols-2 gap-2 mb-3 flex-grow">
        <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
      
      {/* Footer skeleton - fixed height */}
      <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded mt-auto" />
    </div>
  );
}

// ========================================================================
// MAIN COMPONENT
// ========================================================================

/**
 * OverviewStatCard Component
 * 
 * Multi-section card for displaying Bears dashboard statistics
 * with clear visual hierarchy and Bears brand styling.
 * 
 * @example
 * <OverviewStatCard
 *   title="Season Snapshot"
 *   badge={{ text: "NFC North", color: "orange" }}
 *   primaryStats={[
 *     { label: "Record", value: "9-8", highlight: "orange" }
 *   ]}
 *   secondaryStats={[
 *     { label: "Win %", value: ".529" },
 *     { label: "Division", value: "2nd" }
 *   ]}
 *   footerItems={[
 *     { label: "Last Game", value: "W 24-17", icon: "win" },
 *     { label: "Streak", value: "W2", icon: "up" }
 *   ]}
 * />
 */
export default function OverviewStatCard({
  title,
  badge,
  primaryStats,
  secondaryStats,
  footerItems,
  variant = 'default',
  loading = false,
}: OverviewStatCardProps): React.ReactElement {
  // Loading state
  if (loading) {
    return <CardSkeleton />;
  }

  // Variant styles
  const variantClasses: Record<string, string> = {
    default: `
      bg-white dark:bg-slate-800/40 
      border border-gray-200 dark:border-slate-700/50 
      hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/20
    `,
    highlight: `
      bg-orange-50 dark:bg-gradient-to-br dark:from-orange-300/20 dark:to-orange-700/50 
      border border-orange-200 dark:border-orange-400/50 
      hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/20shadow-sm shadow-orange-500/10
    `,
    muted: `
      bg-gray-50 dark:bg-slate-900/40 
      border border-gray-200 dark:border-slate-800/50
    `,
  };

  // Highlight color classes for stat values
  const highlightClasses: Record<string, string> = {
    orange: 'text-orange-600 dark:text-orange-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    blue: 'text-blue-600 dark:text-blue-400',
    gray: 'text-gray-700 dark:text-gray-300',
  };

  return (
    <div 
      className={`
        rounded-lg p-4 transition-all duration-300 h-full flex flex-col
        ${variantClasses[variant]}
      `}
    >
      {/* ====== HEADER ====== */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-500 uppercase tracking-wide">
          {title}
        </h3>
        {badge && <CardBadge text={badge.text} color={badge.color} />}
      </div>

      {/* ====== PRIMARY STATS ====== */}
      <div className="mb-3">
        {primaryStats.map((stat, index) => (
          <div key={`primary-${index}`} className={index > 0 ? 'mt-2' : ''}>
            <div className="flex items-baseline gap-2">
              <span 
                className={`
                  text-3xl font-bold
                  ${stat.highlight ? highlightClasses[stat.highlight] : 'text-gray-900 dark:text-white'}
                `}
              >
                {stat.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-500 uppercase">
                {stat.label}
              </span>
            </div>
            {stat.subtext && (
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">
                {stat.subtext}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ====== SECONDARY STATS ====== */}
      {secondaryStats && secondaryStats.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3 flex-grow">
          {secondaryStats.map((stat, index) => (
            <div 
              key={`secondary-${index}`}
              className="bg-gray-50 dark:bg-slate-700/30 border border-gray-200/70 dark:border-slate-800/10 rounded px-2 py-1.5"
            >
              <p className="text-xs text-gray-500 dark:text-slate-500 uppercase">
                {stat.label}
              </p>
              <p 
                className={`
                  text-sm font-semibold
                  ${stat.highlight ? highlightClasses[stat.highlight] : 'text-gray-800 dark:text-white'}
                `}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ====== FOOTER - CONSISTENT HEIGHT ====== */}
      <div className="border-t border-gray-200 dark:border-slate-700/50 pt-2 mt-auto min-h-[40px] flex items-center">
        {footerItems && footerItems.length > 0 ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1 w-full">
            {footerItems.map((item, index) => (
              <div 
                key={`footer-${index}`}
                className="flex items-center gap-1.5 text-xs"
              >
                <FooterIcon type={item.icon} />
                <span className="text-gray-500 dark:text-slate-500">
                  {item.label}:
                </span>
                <span className="font-medium text-gray-700 dark:text-slate-100">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // Empty placeholder to maintain consistent height
          <div className="h-4" />
        )}
      </div>
    </div>
  );
}

// ========================================================================
// EXPORTS
// ========================================================================

export { CardBadge, FooterIcon, CardSkeleton };