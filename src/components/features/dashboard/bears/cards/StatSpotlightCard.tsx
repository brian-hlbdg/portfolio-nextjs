/**
 * src/components/features/dashboard/bears/cards/StatSpotlightCard.tsx
 * ========================================================================
 * STAT SPOTLIGHT CARD V4 - Vertical Leader Layout
 * 
 * Layout:
 * - Left: Primary stat + supporting metrics
 * - Right: Team leader stacked vertically
 *   - Photo (rounded square)
 *   - Name
 *   - #Number • Position
 *   - Stat value
 * - Footer: NFL rank only
 * 
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  StatCategory,
  CATEGORY_COLORS,
  formatRank,
  getRankColorClass,
  getRankQuality,
} from '@/components/features/types/teamStats.types';
import { TeamLeader } from '@/hooks/useTeamLeaders';

// ========================================================================
// TYPES
// ========================================================================

interface SupportingMetric {
  label: string;
  value: string | number;
  tooltip?: string;
}

interface StatSpotlightCardProps {
  category: StatCategory;
  title: string;
  description: string;
  primaryValue: string | number;
  supportingMetrics: SupportingMetric[];
  rank?: number;
  showRank?: boolean;
  perGame?: number;
  leaders?: TeamLeader[];
  onClick?: () => void;
  className?: string;
}

// ========================================================================
// HELPER COMPONENTS
// ========================================================================

/**
 * Category badge - compact for header
 */
function CategoryBadge({ category }: { category: StatCategory }): React.ReactElement {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const color = CATEGORY_COLORS[category];
  const classes = colorMap[color] || colorMap.blue;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${classes}`}
    >
      {category}
    </span>
  );
}

/**
 * Supporting metric pill
 */
function MetricPill({ metric }: { metric: SupportingMetric }): React.ReactElement {
  return (
    <div
      className="flex flex-col items-center justify-center px-3 py-2 bg-slate-800/50 rounded-lg min-w-[55px]"
      title={metric.tooltip}
    >
      <span className="text-base font-bold text-white tabular-nums">
        {metric.value}
      </span>
      <span className="text-[9px] text-slate-400 uppercase tracking-wide">
        {metric.label}
      </span>
    </div>
  );
}

/**
 * Rank indicator for footer
 */
function RankIndicator({ rank }: { rank: number }): React.ReactElement {
  const quality = getRankQuality(rank);
  const colorClass = getRankColorClass(rank);
  
  const bgColorMap: Record<string, string> = {
    good: 'bg-green-500/10',
    average: 'bg-yellow-500/10',
    poor: 'bg-red-500/10',
    unknown: 'bg-slate-500/10',
  };

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${bgColorMap[quality]}`}>
      <span className="text-xs text-slate-400">NFL Rank:</span>
      <span className={`text-sm font-semibold ${colorClass}`}>
        {formatRank(rank)}
      </span>
    </div>
  );
}

/**
 * Player headshot with rounded square shape
 */
function PlayerHeadshot({ 
  src, 
  name,
  size = 52,
}: { 
  src: string; 
  name: string;
  size?: number;
}): React.ReactElement {
  const [hasError, setHasError] = useState(false);
  
  if (hasError || !src) {
    // Fallback silhouette
    return (
      <div 
        className="bg-slate-700 rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg 
          className="text-slate-500"
          style={{ width: size * 0.6, height: size * 0.6 }}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg overflow-hidden bg-slate-700"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="object-cover object-top"
        onError={() => setHasError(true)}
        unoptimized
      />
    </div>
  );
}

/**
 * Single leader - vertical stack layout
 * Photo → Name → #Number • Position → Stat
 */
function SingleLeaderPanel({ leader }: { leader: TeamLeader }): React.ReactElement {
  return (
    <div className="flex flex-col items-center text-center bg-slate-800/40 rounded-lg p-3 min-w-[110px]">
      <PlayerHeadshot src={leader.headshotUrl} name={leader.name} size={52} />
      <p className="text-sm font-semibold text-white mt-2 leading-tight">
        {leader.name}
      </p>
      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
        #{leader.jersey} • {leader.position}
      </p>
      <p className="text-sm font-bold text-amber-400 mt-1">
        {leader.statDisplay}
      </p>
    </div>
  );
}

/**
 * Team Leader Section (right side) - Single leader only
 */
function TeamLeaderSection({ leaders }: { leaders: TeamLeader[] }): React.ReactElement | null {
  if (!leaders || leaders.length === 0) {
    return null;
  }

  // Only show the top leader
  const topLeader = leaders[0];

  return (
    <div className="flex flex-col">
      <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5 text-center">
        Leader
      </p>
      <SingleLeaderPanel leader={topLeader} />
    </div>
  );
}

// ========================================================================
// MAIN COMPONENT
// ========================================================================

export function StatSpotlightCard({
  category,
  title,
  description,
  primaryValue,
  supportingMetrics,
  rank,
  showRank = true,
  perGame,
  leaders,
  onClick,
  className = '',
}: StatSpotlightCardProps): React.ReactElement {
  const isClickable = Boolean(onClick);
  const hasLeaders = leaders && leaders.length > 0;
  
  return (
    <div
      className={`
        relative overflow-hidden
        bg-slate-900/60 backdrop-blur-sm
        border border-slate-700/50
        rounded-xl
        p-5
        transition-all duration-200
        ${isClickable ? 'cursor-pointer hover:border-slate-600 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-slate-900/50' : ''}
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* Header: Title + Badge */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-medium text-slate-200">
          {title}
        </h3>
        <CategoryBadge category={category} />
      </div>

      {/* Main Content Area: Stats (left) + Leader (right) */}
      <div className={`flex gap-4 ${hasLeaders ? 'justify-between' : ''}`}>
        {/* Left Side: Primary Stat + Supporting Metrics */}
        <div className="flex-1 min-w-0">
          {/* Primary Stat */}
          <div className="mb-3">
            <div className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {primaryValue}
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              {description}
              {perGame !== undefined && perGame > 0 && (
                <span className="ml-1.5 text-slate-500">
                  ({perGame.toFixed(1)}/g)
                </span>
              )}
            </p>
          </div>

          {/* Supporting Metrics Row */}
          {supportingMetrics.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {supportingMetrics.map((metric, index) => (
                <MetricPill key={index} metric={metric} />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Team Leader (vertically stacked) */}
        {hasLeaders && (
          <TeamLeaderSection leaders={leaders} />
        )}
      </div>

      {/* Footer: NFL Rank Only */}
      {showRank && rank !== undefined && rank > 0 && (
        <div className="pt-3 border-t border-slate-700/50 mt-4">
          <RankIndicator rank={rank} />
        </div>
      )}
    </div>
  );
}

export default StatSpotlightCard;

// ========================================================================
// LOADING SKELETON
// ========================================================================

export function StatSpotlightCardSkeleton(): React.ReactElement {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="h-4 w-24 bg-slate-700 rounded" />
        <div className="h-5 w-16 bg-slate-700 rounded" />
      </div>
      
      {/* Content */}
      <div className="flex gap-4 justify-between">
        {/* Left */}
        <div className="flex-1">
          <div className="h-8 w-28 bg-slate-700 rounded mb-2" />
          <div className="h-3 w-32 bg-slate-700 rounded mb-3" />
          <div className="flex gap-1.5">
            <div className="h-12 w-14 bg-slate-700 rounded-lg" />
            <div className="h-12 w-14 bg-slate-700 rounded-lg" />
            <div className="h-12 w-14 bg-slate-700 rounded-lg" />
          </div>
        </div>
        
        {/* Right - Leader */}
        <div className="flex flex-col items-center">
          <div className="h-2 w-10 bg-slate-700 rounded mb-1.5" />
          <div className="bg-slate-800/40 rounded-lg p-3 flex flex-col items-center">
            <div className="w-13 h-13 bg-slate-700 rounded-lg" style={{ width: 52, height: 52 }} />
            <div className="h-3 w-16 bg-slate-700 rounded mt-2" />
            <div className="h-2 w-12 bg-slate-700 rounded mt-1" />
            <div className="h-3 w-14 bg-slate-700 rounded mt-1" />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-3 border-t border-slate-700/50 mt-4">
        <div className="h-6 w-24 bg-slate-700 rounded" />
      </div>
    </div>
  );
}