'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { labTokens } from './tokens';
import type { LabThirdDownEntry } from './types';

function rateToColor(rate: number): string {
  // 0 = red, 0.5 = neutral slate, 1 = green
  if (rate >= 0.65) return labTokens.colors.positive;     // green
  if (rate >= 0.45) return '#F59E0B';                     // amber
  if (rate >= 0.3)  return '#F97316';                     // orange
  return labTokens.colors.negative;                       // red
}

export interface ThirdDownMatrixProps {
  data: LabThirdDownEntry[];
  animated?: boolean;
  className?: string;
}

export function ThirdDownMatrix({
  data,
  animated = true,
  className = '',
}: ThirdDownMatrixProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animated && !prefersReduced;
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className={`w-full ${className}`}>
      {/* Column headers */}
      <div
        className="grid text-xs font-mono font-bold uppercase tracking-wider mb-2 px-2"
        style={{
          gridTemplateColumns: '52px 1fr 56px 72px 56px',
          color: labTokens.colors.textMuted,
          letterSpacing: '0.07em',
          gap: '8px',
        }}
      >
        <span>YTG</span>
        <span>Conv. rate</span>
        <span className="text-right">Conv</span>
        <span className="text-center">Attempts</span>
        <span className="text-right">Rate</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1" role="table" aria-label="3rd down conversion matrix by yards to go">
        {data.map((entry, i) => {
          const color = rateToColor(entry.rate);
          const isHov = hoveredRow === i;
          const pct = entry.rate * 100;

          return (
            <motion.div
              key={entry.distance}
              role="row"
              initial={shouldAnimate ? { opacity: 0, x: -12 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...labTokens.transitions.normal, delay: shouldAnimate ? i * labTokens.transitions.stagger : 0 }}
              className="grid rounded-lg px-2 py-2.5 cursor-default transition-colors"
              style={{
                gridTemplateColumns: '52px 1fr 56px 72px 56px',
                gap: '8px',
                background: isHov ? labTokens.colors.surfaceBright : labTokens.colors.surfaceElevated,
                border: `1px solid ${isHov ? color + '50' : labTokens.colors.surfaceBorder}`,
              }}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Distance label */}
              <div
                role="cell"
                className="flex items-center"
              >
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color: isHov ? labTokens.colors.textPrimary : labTokens.colors.textSecondary }}
                >
                  {entry.distance === 10 ? '10+' : `${entry.distance} yd`}
                </span>
              </div>

              {/* Bar */}
              <div role="cell" className="flex items-center">
                <div
                  className="relative w-full rounded-full overflow-hidden"
                  style={{ height: 8, background: 'rgba(255,255,255,0.06)' }}
                  aria-hidden="true"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={shouldAnimate ? { width: 0 } : { width: `${pct}%` }}
                    animate={{ width: `${pct}%` }}
                    transition={{ ...labTokens.transitions.slow, delay: shouldAnimate ? i * labTokens.transitions.stagger + 0.1 : 0 }}
                  />
                </div>
              </div>

              {/* Conversion count */}
              <div role="cell" className="flex items-center justify-end">
                <span
                  className="font-mono text-sm"
                  style={{ color: labTokens.colors.textSecondary }}
                >
                  {entry.conversions}
                </span>
              </div>

              {/* Attempts (mini bar dots) */}
              <div role="cell" className="flex items-center justify-center gap-0.5" aria-label={`${entry.attempts} attempts`}>
                {Array.from({ length: Math.min(entry.attempts, 24) }).map((_, j) => (
                  <div
                    key={j}
                    className="rounded-full"
                    style={{
                      width: 4,
                      height: 4,
                      background: j < entry.conversions ? color : 'rgba(255,255,255,0.12)',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>

              {/* Rate */}
              <div role="cell" className="flex items-center justify-end">
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color }}
                >
                  {pct.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap gap-x-4 gap-y-1 mt-3 px-2"
        role="legend"
        aria-label="Conversion rate legend"
      >
        {[
          { label: 'Elite (65%+)',      color: labTokens.colors.positive },
          { label: 'Average (45–64%)',  color: '#F59E0B' },
          { label: 'Below avg (30–44%)', color: '#F97316' },
          { label: 'Poor (<30%)',        color: labTokens.colors.negative },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5 font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
