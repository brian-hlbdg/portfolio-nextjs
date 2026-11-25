'use client';

import React, { useState, useId } from 'react';
import { labTokens } from './tokens';
import type { LabPassTarget, PassOutcome } from './types';

// Field coordinate space mirrors FootballField.tsx
const W = 1200;
const H = 533;
const EZ = 100;
const PW = W - 2 * EZ;

const OUTCOME_COLOR: Record<PassOutcome, string> = {
  complete:    labTokens.colors.complete,
  incomplete:  labTokens.colors.incomplete,
  touchdown:   labTokens.colors.touchdown,
  interception: labTokens.colors.interception,
};

const OUTCOME_LABEL: Record<PassOutcome, string> = {
  complete:    'Complete',
  incomplete:  'Incomplete',
  touchdown:   'Touchdown',
  interception: 'Interception',
};

function fieldX(pct: number) {
  // pct 0–100 → x within playing field
  return EZ + (pct / 100) * PW;
}
function fieldY(pct: number) {
  // pct 0 (opponent end zone) → 100 (offense LOS)
  return (pct / 100) * H;
}

const FIELD_GREEN = '#173825';
const FIELD_GREEN_ALT = '#1A4030';
const LINE_COLOR = 'rgba(255,255,255,0.72)';
const LINE_FAINT = 'rgba(255,255,255,0.14)';

const OUTCOMES: PassOutcome[] = ['complete', 'incomplete', 'touchdown', 'interception'];

export interface PassingTerritoryProps {
  targets: LabPassTarget[];
  width?: number | string;
  showLegend?: boolean;
  highlightOutcome?: PassOutcome | null;
  animated?: boolean;
  className?: string;
}

export function PassingTerritory({
  targets,
  width = '100%',
  showLegend = true,
  highlightOutcome = null,
  className = '',
}: PassingTerritoryProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [filter, setFilter] = useState<PassOutcome | null>(highlightOutcome);
  const gradId = useId();

  const counts = OUTCOMES.reduce<Record<PassOutcome, number>>((acc, o) => {
    acc[o] = targets.filter(t => t.outcome === o).length;
    return acc;
  }, { complete: 0, incomplete: 0, touchdown: 0, interception: 0 });

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {/* Legend / filter bar */}
      {showLegend && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter pass outcomes">
          {OUTCOMES.map((outcome) => {
            const active = filter === null || filter === outcome;
            const count = counts[outcome];
            return (
              <button
                key={outcome}
                onClick={() => setFilter(f => f === outcome ? null : outcome)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2"
                style={{
                  background: active ? `${OUTCOME_COLOR[outcome]}22` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? OUTCOME_COLOR[outcome] : 'rgba(255,255,255,0.1)'}`,
                  color: active ? OUTCOME_COLOR[outcome] : labTokens.colors.textMuted,
                  outlineColor: OUTCOME_COLOR[outcome],
                }}
                aria-pressed={filter === outcome}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: OUTCOME_COLOR[outcome], opacity: active ? 1 : 0.4 }}
                />
                {OUTCOME_LABEL[outcome]}
                <span
                  className="ml-0.5 opacity-60"
                  style={{ color: active ? OUTCOME_COLOR[outcome] : labTokens.colors.textMuted }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Field + targets */}
      <div className="relative w-full" style={{ maxWidth: typeof width === 'number' ? width : undefined }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={width}
          height="auto"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          role="img"
          aria-label={`Passing territory chart showing ${targets.length} pass targets`}
        >
          <defs>
            <pattern
              id={`${gradId}-stripe`}
              patternUnits="userSpaceOnUse"
              x={EZ}
              width={200}
              height={H}
            >
              <rect x={0} y={0} width={100} height={H} fill={FIELD_GREEN} />
              <rect x={100} y={0} width={100} height={H} fill={FIELD_GREEN_ALT} />
            </pattern>
            {/* Vignette overlay */}
            <radialGradient id={`${gradId}-vignette`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </radialGradient>
          </defs>

          {/* Base */}
          <rect x={0} y={0} width={W} height={H} fill={FIELD_GREEN} />
          <rect x={EZ} y={0} width={PW} height={H} fill={`url(#${gradId}-stripe)`} />

          {/* End zones (muted for focus on playing field) */}
          <rect x={0} y={0} width={EZ} height={H} fill="#0A1628" opacity={0.9} />
          <rect x={W - EZ} y={0} width={EZ} height={H} fill="#141428" opacity={0.9} />

          {/* Field lines */}
          <rect x={1} y={1} width={W - 2} height={H - 2} fill="none" stroke={LINE_COLOR} strokeWidth={3} />
          <line x1={EZ} y1={0} x2={EZ} y2={H} stroke={LINE_COLOR} strokeWidth={3} />
          <line x1={W - EZ} y1={0} x2={W - EZ} y2={H} stroke={LINE_COLOR} strokeWidth={3} />
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <line
              key={n}
              x1={EZ + n * 100}
              y1={0}
              x2={EZ + n * 100}
              y2={H}
              stroke={LINE_FAINT}
              strokeWidth={1.5}
            />
          ))}
          {/* LOS indicator line */}
          <line
            x1={EZ}
            y1={0}
            x2={EZ}
            y2={H}
            stroke={labTokens.colors.orange}
            strokeWidth={2}
            strokeDasharray="8 4"
            opacity={0.5}
          />
          <text
            x={EZ + 12}
            y={22}
            fill={labTokens.colors.orange}
            fontSize={18}
            fontFamily="var(--font-ibm-mono), ui-monospace, monospace"
            fontWeight="700"
            opacity={0.7}
          >
            LOS →
          </text>

          {/* Vignette */}
          <rect x={0} y={0} width={W} height={H} fill={`url(#${gradId}-vignette)`} />

          {/* Pass targets */}
          {targets.map((target, i) => {
            const isFiltered = filter !== null && target.outcome !== filter;
            const isHov = hovered === i;
            const color = OUTCOME_COLOR[target.outcome];
            const cx = fieldX(target.x);
            const cy = fieldY(target.y);

            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
                role="img"
                aria-label={`${OUTCOME_LABEL[target.outcome]}${target.yards ? `, ${target.yards} yards` : ''}`}
              >
                {/* Glow ring on hover */}
                {isHov && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={22}
                    fill={color}
                    opacity={0.15}
                  />
                )}
                {/* Outer ring for TDs/INTs */}
                {(target.outcome === 'touchdown' || target.outcome === 'interception') && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={target.outcome === 'touchdown' ? 16 : 14}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5}
                    opacity={isFiltered ? 0.1 : 0.5}
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHov ? 10 : (target.outcome === 'touchdown' ? 8 : 6)}
                  fill={color}
                  opacity={isFiltered ? 0.1 : (isHov ? 1 : 0.8)}
                  style={{ transition: 'r 150ms, opacity 150ms' }}
                />
              </g>
            );
          })}

          {/* Tooltip for hovered target */}
          {hovered !== null && (() => {
            const t = targets[hovered];
            const cx = fieldX(t.x);
            const cy = fieldY(t.y);
            const color = OUTCOME_COLOR[t.outcome];
            const tooltipX = cx > W * 0.75 ? cx - 160 : cx + 18;
            const tooltipY = cy > H * 0.8 ? cy - 60 : cy + 10;

            return (
              <g>
                <rect
                  x={tooltipX}
                  y={tooltipY}
                  width={148}
                  height={t.yards ? 52 : 36}
                  rx={6}
                  fill={labTokens.colors.surfaceElevated}
                  stroke={color}
                  strokeWidth={1}
                  strokeOpacity={0.6}
                />
                <text x={tooltipX + 10} y={tooltipY + 18} fill={color} fontSize={14} fontFamily="var(--font-ibm-mono), ui-monospace, monospace" fontWeight="700">
                  {OUTCOME_LABEL[t.outcome].toUpperCase()}
                </text>
                {t.yards && (
                  <text x={tooltipX + 10} y={tooltipY + 36} fill={labTokens.colors.textSecondary} fontSize={13} fontFamily="var(--font-ibm-mono), ui-monospace, monospace">
                    {t.yards} yds{t.route ? ` · ${t.route}` : ''}
                  </text>
                )}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
