'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PlayerAvatar } from './PlayerAvatar';
import { labTokens } from './tokens';
import type { LabPlayer, LabPassingStats, LabRushingStats, LabReceivingStats } from './types';

type AnyStats = LabPassingStats | LabRushingStats | LabReceivingStats;

function isPassingStats(s: AnyStats): s is LabPassingStats {
  return 'completions' in s;
}
function isRushingStats(s: AnyStats): s is LabRushingStats {
  return 'yardsPerCarry' in s;
}
function isReceivingStats(s: AnyStats): s is LabReceivingStats {
  return 'receptions' in s;
}

function formatHeight(inches: number): string {
  return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

function buildStatRows(stats: AnyStats): { label: string; value: string }[] {
  if (isPassingStats(stats)) {
    return [
      { label: 'COMP/ATT', value: `${stats.completions}/${stats.attempts}` },
      { label: 'YARDS', value: stats.yards.toLocaleString() },
      { label: 'TD', value: String(stats.touchdowns) },
      { label: 'INT', value: String(stats.interceptions) },
      { label: 'RTG', value: stats.rating.toFixed(1) },
      { label: 'YPA', value: stats.yardsPerAttempt.toFixed(1) },
    ];
  }
  if (isRushingStats(stats)) {
    return [
      { label: 'ATT', value: String(stats.attempts) },
      { label: 'YARDS', value: stats.yards.toLocaleString() },
      { label: 'TD', value: String(stats.touchdowns) },
      { label: 'YPC', value: stats.yardsPerCarry.toFixed(1) },
      { label: 'LONG', value: String(stats.longRun) },
    ];
  }
  if (isReceivingStats(stats)) {
    return [
      { label: 'REC/TGT', value: `${stats.receptions}/${stats.targets}` },
      { label: 'YARDS', value: stats.yards.toLocaleString() },
      { label: 'TD', value: String(stats.touchdowns) },
      { label: 'YPR', value: stats.yardsPerCatch.toFixed(1) },
      { label: 'CATCH%', value: `${stats.catchPct.toFixed(1)}%` },
    ];
  }
  return [];
}

export interface PlayerSpotlightProps {
  player: LabPlayer;
  stats: AnyStats;
  variant?: 'featured' | 'compact';
  animated?: boolean;
  className?: string;
}

export function PlayerSpotlight({
  player,
  stats,
  variant = 'featured',
  animated = true,
  className = '',
}: PlayerSpotlightProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animated && !prefersReduced;
  const statRows = buildStatRows(stats);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: labTokens.transitions.stagger } },
  };
  const item = {
    hidden: { opacity: 0, y: shouldAnimate ? 12 : 0 },
    visible: { opacity: 1, y: 0, transition: labTokens.transitions.normal },
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={shouldAnimate ? container : undefined}
        className={`flex items-center gap-4 rounded-xl p-4 border ${className}`}
        style={{
          background: labTokens.colors.surfaceElevated,
          borderColor: labTokens.colors.surfaceBorder,
        }}
      >
        <PlayerAvatar player={player} size="md" animated={shouldAnimate} />
        <div className="flex-1 min-w-0">
          <motion.p
            variants={shouldAnimate ? item : undefined}
            className="font-bold leading-tight truncate"
            style={{ color: labTokens.colors.textPrimary, fontSize: '1rem' }}
          >
            {player.name}
          </motion.p>
          <motion.p
            variants={shouldAnimate ? item : undefined}
            className="font-mono text-xs mt-0.5"
            style={{ color: labTokens.colors.textSecondary }}
          >
            #{player.number} · {player.position}
          </motion.p>
        </div>
        <div className="flex gap-3">
          {statRows.slice(0, 3).map((s) => (
            <motion.div
              key={s.label}
              variants={shouldAnimate ? item : undefined}
              className="text-center min-w-[36px]"
            >
              <p
                className="font-mono font-bold leading-none"
                style={{ color: labTokens.colors.textPrimary, fontSize: '0.9rem' }}
              >
                {s.value}
              </p>
              <p
                className="font-mono leading-none mt-1"
                style={{ color: labTokens.colors.textMuted, fontSize: '0.6rem' }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // featured variant
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={shouldAnimate ? container : undefined}
      className={`relative overflow-hidden rounded-2xl border ${className}`}
      style={{
        background: labTokens.colors.surface,
        borderColor: labTokens.colors.surfaceBorderAccent,
      }}
    >
      {/* Decorative large jersey number */}
      <div
        className="absolute right-0 top-0 font-bold font-mono select-none pointer-events-none"
        style={{
          fontSize: 'clamp(100px, 20vw, 200px)',
          lineHeight: 1,
          color: 'rgba(200,56,3,0.07)',
          transform: 'translate(10%, -15%)',
          letterSpacing: '-0.05em',
        }}
        aria-hidden="true"
      >
        {player.number}
      </div>

      {/* Orange top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${labTokens.colors.orange} 0%, transparent 70%)` }}
      />

      <div className="p-6 relative">
        {/* Player identity row */}
        <motion.div
          variants={shouldAnimate ? item : undefined}
          className="flex items-start gap-5 mb-6"
        >
          <PlayerAvatar player={player} size="xl" animated={shouldAnimate} />
          <div>
            <p
              className="font-bold leading-tight"
              style={{ color: labTokens.colors.textPrimary, fontSize: 'clamp(1.3rem, 3vw, 1.75rem)' }}
            >
              {player.name}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span
                className="font-mono font-bold text-sm"
                style={{ color: labTokens.colors.orange }}
              >
                #{player.number}
              </span>
              <span
                className="font-mono text-sm"
                style={{ color: labTokens.colors.textSecondary }}
              >
                {player.position}
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: labTokens.colors.textMuted }}
              >
                {formatHeight(player.heightInches)} · {player.weightLbs} lbs
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 mt-1">
              <span
                className="font-mono text-xs"
                style={{ color: labTokens.colors.textMuted }}
              >
                {player.college}
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: labTokens.colors.textMuted }}
              >
                Yr {player.experience}
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: labTokens.colors.textMuted }}
              >
                Age {player.age}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={shouldAnimate ? item : undefined}
          className="h-px mb-5"
          style={{ background: labTokens.colors.surfaceBorder }}
        />

        {/* Stats grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(statRows.length, 3)}, 1fr)` }}>
          {statRows.map((s, i) => (
            <motion.div
              key={s.label}
              variants={shouldAnimate ? item : undefined}
              custom={i}
              className="rounded-lg p-3 border"
              style={{
                background: labTokens.colors.surfaceElevated,
                borderColor: labTokens.colors.surfaceBorder,
              }}
            >
              <p
                className="font-mono font-bold leading-none"
                style={{ color: labTokens.colors.textPrimary, fontSize: '1.35rem' }}
              >
                {s.value}
              </p>
              <p
                className="font-mono leading-none mt-1.5"
                style={{ color: labTokens.colors.textMuted, fontSize: '0.6rem', letterSpacing: '0.08em' }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
