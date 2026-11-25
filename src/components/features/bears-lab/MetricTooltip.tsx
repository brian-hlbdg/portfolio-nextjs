'use client';

import React, { useState, useRef, useId, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { labTokens } from './tokens';

function percentileColor(pct: number): string {
  if (pct >= 80) return labTokens.colors.positive;
  if (pct >= 50) return '#F59E0B';
  if (pct >= 25) return '#F97316';
  return labTokens.colors.negative;
}

export interface MetricTooltipProps {
  label: string;
  value: string | number;
  unit?: string;
  context?: string;
  leagueAvg?: number;
  percentile?: number;
  children?: React.ReactNode;
  className?: string;
}

export function MetricTooltip({
  label,
  value,
  unit,
  context,
  leagueAvg,
  percentile,
  children,
  className = '',
}: MetricTooltipProps) {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const displayValue = `${value}${unit ? unit : ''}`;
  const pctColor = percentile !== undefined ? percentileColor(percentile) : labTokens.colors.orange;

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center gap-1 cursor-help group"
        aria-describedby={tooltipId}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        {children ?? (
          <span
            className="font-mono font-bold border-b border-dashed transition-colors"
            style={{
              color: labTokens.colors.textPrimary,
              borderColor: open ? labTokens.colors.orange : labTokens.colors.textMuted,
            }}
          >
            {displayValue}
          </span>
        )}
        {/* Info indicator */}
        <span
          className="inline-flex items-center justify-center rounded-full font-mono font-bold leading-none flex-shrink-0"
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            fontSize: 9,
            background: open ? labTokens.colors.orange : 'rgba(255,255,255,0.1)',
            color: open ? labTokens.colors.textInverse : labTokens.colors.textMuted,
            transition: 'background 150ms',
          }}
        >
          i
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: prefersReduced ? 0 : 6, scale: prefersReduced ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : 4, scale: prefersReduced ? 1 : 0.97 }}
            transition={labTokens.transitions.fast}
            className="absolute z-50 bottom-full left-1/2 mb-2 pointer-events-none"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div
              className="rounded-xl border shadow-2xl"
              style={{
                background: labTokens.colors.surfaceElevated,
                borderColor: labTokens.colors.surfaceBorder,
                width: 220,
                padding: '12px 14px',
              }}
            >
              {/* Label */}
              <p
                className="font-mono font-bold text-xs uppercase tracking-wider mb-2"
                style={{ color: labTokens.colors.orange, letterSpacing: '0.08em' }}
              >
                {label}
              </p>

              {/* Value */}
              <p
                className="font-mono font-bold leading-none"
                style={{ color: labTokens.colors.textPrimary, fontSize: '1.6rem' }}
              >
                {displayValue}
              </p>

              {/* League average comparison */}
              {leagueAvg !== undefined && (
                <div
                  className="flex items-center justify-between mt-3 pt-3 border-t"
                  style={{ borderColor: labTokens.colors.surfaceBorder }}
                >
                  <span className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>
                    League avg
                  </span>
                  <span className="font-mono font-bold text-xs" style={{ color: labTokens.colors.textSecondary }}>
                    {leagueAvg}{unit}
                  </span>
                </div>
              )}

              {/* Percentile bar */}
              {percentile !== undefined && (
                <div className="mt-2.5">
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>Percentile</span>
                    <span className="font-mono font-bold text-xs" style={{ color: pctColor }}>{percentile}th</span>
                  </div>
                  <div
                    className="w-full rounded-full overflow-hidden"
                    style={{ height: 5, background: 'rgba(255,255,255,0.08)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percentile}%`, background: pctColor, transition: 'width 300ms' }}
                    />
                  </div>
                </div>
              )}

              {/* Context */}
              {context && (
                <p
                  className="font-sans text-xs mt-3 leading-relaxed"
                  style={{ color: labTokens.colors.textSecondary }}
                >
                  {context}
                </p>
              )}
            </div>

            {/* Arrow */}
            <div
              className="absolute left-1/2 top-full"
              style={{
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `7px solid ${labTokens.colors.surfaceBorder}`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
