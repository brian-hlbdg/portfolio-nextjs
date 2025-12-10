/**
 * src/components/features/updates/UpdateCard.tsx
 * ========================================================================
 * COMPONENT: Compact Update Card
 * 
 * Visual hierarchy (top to bottom):
 * 1. Title - Primary importance
 * 2. Date - Secondary context  
 * 3. Type badge - Tertiary, supporting info
 * 
 * INTERESTING CODE:
 * - Uses Lucide icons with dynamic selection based on content type
 * - Type badge appears below content for cleaner hierarchy
 * - "NEW" badge inline with type badge
 * ========================================================================
 */

'use client';

import Link from 'next/link';
import { FileText, Briefcase, BarChart3, Sparkles } from 'lucide-react';
import { UpdateCardProps, UpdateType } from '@/components/features/types/updates';

/**
 * Icon mapping for different update types
 */
const iconMap: Record<UpdateType, React.ReactNode> = {
  blog: <FileText className="w-6 h-6" />,
  'case-study': <Briefcase className="w-6 h-6" />,
  dashboard: <BarChart3 className="w-6 h-6" />,
  feature: <Sparkles className="w-6 h-6" />,
};

/**
 * Human-readable labels for update types
 */
const typeLabels: Record<UpdateType, string> = {
  blog: 'Blog Post',
  'case-study': 'Case Study',
  dashboard: 'Dashboard',
  feature: 'Feature',
};

/**
 * Badge color styles for each type
 * Using subtle, muted colors that don't compete with the title
 */
const typeBadgeStyles: Record<UpdateType, string> = {
  blog: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
  'case-study': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
  dashboard: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
  feature: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
};

/**
 * Format date to readable string
 * Example: "January 15, 2025"
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * UpdateCard Component
 * 
 * Displays a single update in a compact card format.
 * Used in the RecentUpdates section on the homepage.
 * 
 * Visual hierarchy:
 * 1. Title (most prominent)
 * 2. Date (secondary)
 * 3. Type badge (tertiary, bottom)
 * 
 * @example
 * <UpdateCard 
 *   update={{
 *     id: 'blog-1',
 *     type: 'blog',
 *     title: 'UX Principles for Complex Systems',
 *     date: '2025-01-15',
 *     slug: '/blog/ux-principles'
 *   }}
 * />
 */
export function UpdateCard({ update, variant = 'compact' }: UpdateCardProps) {
  const icon = iconMap[update.type];
  const typeLabel = typeLabels[update.type];
  const badgeStyle = typeBadgeStyles[update.type];

  return (
    <Link
      href={update.slug}
      className="
        group flex items-center gap-4 p-4
        bg-gray-50 dark:bg-slate-800/40 
        border border-gray-200 dark:border-slate-700 
        rounded-xl
        hover:border-gray-300 dark:hover:border-slate-500
        hover:bg-gray-100 dark:hover:bg-slate-800/60
        transition-all duration-300
      "
    >
      {/* Icon Container */}
      <div className="
        flex-shrink-0 
        w-14 h-14 
        flex items-center justify-center 
        bg-gray-200 dark:bg-slate-700 
        rounded-lg
        text-blue-500 dark:text-blue-400
        group-hover:scale-105
        transition-transform duration-300
      ">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* 1. Title - Primary */}
        <h3 className="
          text-base font-semibold 
          text-gray-900 dark:text-white 
          group-hover:text-orange-500
          transition-colors duration-300
          line-clamp-2
          mb-1
        ">
          {update.title}
        </h3>

        {/* 2. Date - Secondary */}
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
          {formatDate(update.date)}
        </p>

        {/* 3. Type Badge + NEW Badge - Tertiary */}
        <div className="flex items-center gap-2">
          <span className={`
            px-2 py-0.5 
            text-xs font-medium 
            border rounded
            ${badgeStyle}
          `}>
            {typeLabel}
          </span>
          {update.isNew && (
            <span className="
              px-2 py-0.5 
              text-xs font-bold 
              bg-green-100 dark:bg-green-500/20 
              text-green-700 dark:text-green-400 
              border border-green-300 dark:border-green-500/50
              rounded
            ">
              NEW
            </span>
          )}
        </div>

        {/* Description (only in full variant) */}
        {variant === 'full' && update.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 line-clamp-2">
            {update.description}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <div className="
        flex-shrink-0 
        text-gray-400 dark:text-slate-500
        group-hover:text-orange-500
        group-hover:translate-x-1
        transition-all duration-300
      ">
        →
      </div>
    </Link>
  );
}