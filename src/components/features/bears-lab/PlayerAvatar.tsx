'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LabPlayer } from './types';
import { labTokens } from './tokens';

const POSITION_GRADIENTS: Record<LabPlayer['position'], [string, string]> = {
  QB:  ['#1E3A5F', '#0B2240'],
  RB:  ['#1A3D2E', '#0A2419'],
  WR:  ['#3D1A5F', '#240A3D'],
  TE:  ['#3D2A1A', '#261508'],
  OL:  ['#2A1A3D', '#160A26'],
  DL:  ['#3D1A1A', '#260A0A'],
  LB:  ['#3D2A1A', '#261508'],
  DB:  ['#1A3A3D', '#0A2326'],
  K:   ['#3D3A1A', '#262208'],
  P:   ['#3D3A1A', '#262208'],
};

const SIZE_MAP = {
  sm:  { container: 40,  number: 18, fontSize: '0.875rem' },
  md:  { container: 64,  number: 28, fontSize: '1.25rem' },
  lg:  { container: 96,  number: 42, fontSize: '1.75rem' },
  xl:  { container: 128, number: 56, fontSize: '2.25rem' },
};

export interface PlayerAvatarProps {
  player: LabPlayer;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'jersey' | 'initials';
  animated?: boolean;
  className?: string;
}

export function PlayerAvatar({
  player,
  size = 'md',
  variant = 'jersey',
  animated = true,
  className = '',
}: PlayerAvatarProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animated && !prefersReduced;
  const dim = SIZE_MAP[size];
  const [grad1, grad2] = POSITION_GRADIENTS[player.position];
  const gradId = `avatar-grad-${player.id}-${size}`;

  const content = variant === 'jersey'
    ? String(player.number)
    : `${player.firstName[0]}${player.lastName[0]}`;

  const Wrapper = shouldAnimate ? motion.div : 'div';
  const wrapperProps = shouldAnimate ? {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    transition: labTokens.transitions.normal,
  } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: dim.container, height: dim.container }}
      role="img"
      aria-label={`${player.name}, #${player.number} ${player.position}`}
    >
      <svg
        width={dim.container}
        height={dim.container}
        viewBox={`0 0 ${dim.container} ${dim.container}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={gradId} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={grad1} />
            <stop offset="100%" stopColor={grad2} />
          </radialGradient>
          <clipPath id={`clip-${gradId}`}>
            <circle
              cx={dim.container / 2}
              cy={dim.container / 2}
              r={dim.container / 2 - 1.5}
            />
          </clipPath>
        </defs>

        {/* Background circle */}
        <circle
          cx={dim.container / 2}
          cy={dim.container / 2}
          r={dim.container / 2 - 1.5}
          fill={`url(#${gradId})`}
        />

        {/* Border ring */}
        <circle
          cx={dim.container / 2}
          cy={dim.container / 2}
          r={dim.container / 2 - 1.5}
          stroke={labTokens.colors.orange}
          strokeWidth={1.5}
          fill="none"
          opacity={0.6}
        />

        {/* Inner accent ring */}
        <circle
          cx={dim.container / 2}
          cy={dim.container / 2}
          r={dim.container / 2 - 4}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          fill="none"
        />

        {/* Number / initials */}
        <text
          x={dim.container / 2}
          y={dim.container / 2 + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill={labTokens.colors.textPrimary}
          fontFamily="var(--font-ibm-mono), ui-monospace, monospace"
          fontWeight="700"
          fontSize={dim.number}
          letterSpacing="-0.03em"
        >
          {content}
        </text>
      </svg>

      {/* Position badge (md and up) */}
      {size !== 'sm' && (
        <span
          className="absolute -bottom-0.5 -right-0.5 font-mono font-bold leading-none rounded-full border flex items-center justify-center"
          style={{
            width: dim.container * 0.35,
            height: dim.container * 0.35,
            fontSize: dim.container * 0.14,
            background: labTokens.colors.orange,
            borderColor: labTokens.colors.pageBg,
            color: labTokens.colors.textPrimary,
            borderWidth: 2,
          }}
        >
          {player.position}
        </span>
      )}
    </Wrapper>
  );
}
