/**
 * src/components/features/bears-dashboard/cards/StatCard.tsx
 * 
 * REUSABLE COMPONENT PATTERN
 * 
 * Why this is DRY:
 * - Single source of truth for stat card styling
 * - Props-driven: works for any stat type
 * - Reduces code duplication across dashboard
 * 
 * UX Priority:
 * - Clear visual hierarchy (label → value)
 * - Consistent spacing and typography
 * - Optional badge for context
 * - Bears brand colors via Tailwind
 */

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeColor?: 'orange' | 'blue' | 'gray' | 'red' | 'green' | 'yellow';
  variant?: 'default' | 'highlight';
}

/**
 * StatCard Component
 * 
 * Displays a single statistic with label and value
 * Used across dashboard for consistent presentation
 * 
 * Example:
 * <StatCard label="Wins" value={9} badge="4th AFC North" />
 */
export default function StatCard({
  label,
  value,
  subtext,
  badge,
  badgeColor = 'blue',
  variant = 'default',
}: StatCardProps) {
  const badgeColorMap = {
    orange: 'bg-orange-500/20 text-orange-400 border border-orange-500/50',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
    gray: 'bg-gray-500/20 text-gray-400 border border-gray-500/50',
    red: 'bg-red-500/20 text-red-400 border border-red-500/50',
    green: 'bg-green-500/20 text-green-400 border border-green-500/50',
    yellow: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
  };

  return (
    <div
      className={`
        rounded-lg p-5 transition-all duration-300
        ${
          variant === 'highlight'
            ? 'bg-orange-700/10 dark:bg-gradient-to-br dark:from-orange-600/20 dark:to-orange-700/10 border border-orange-300 dark:border-orange-500/50 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30'
            : 'bg-gray-100 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-800/60'
        }
      `}
    >
      {/* Badge (optional) */}
      {badge && (
        <div className="mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColorMap[badgeColor]}`}>
            {badge}
          </span>
        </div>
      )}

      {/* Label */}
      <p className="text-gray-600 dark:text-slate-400 text-sm font-medium tracking-wide mb-1">
        {label}
      </p>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>

      {/* Subtext */}
      {subtext && <p className="text-xs text-gray-600 dark:text-slate-500">{subtext}</p>}
    </div>
  );
}