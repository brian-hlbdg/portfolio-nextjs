'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { labTokens } from './tokens';
import type { LabTrendPoint } from './types';

interface TooltipData {
  active?: boolean;
  payload?: Array<{ payload: LabTrendPoint }>;
}

// Custom tooltip
function ChartTooltip({ active, payload }: TooltipData) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  const resultColor =
    point.result === 'W' ? labTokens.colors.win :
    point.result === 'L' ? labTokens.colors.loss :
    labTokens.colors.tie;

  return (
    <div
      className="rounded-lg border p-3 font-mono text-xs shadow-xl"
      style={{
        background: labTokens.colors.surfaceElevated,
        borderColor: labTokens.colors.surfaceBorder,
        color: labTokens.colors.textPrimary,
        minWidth: 140,
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span style={{ color: labTokens.colors.textSecondary }}>{point.label}</span>
        <span
          className="font-bold px-1.5 py-0.5 rounded text-xs"
          style={{ background: resultColor + '20', color: resultColor }}
        >
          {point.result} · {point.opponent}
        </span>
      </div>
      <div
        className="text-xl font-bold"
        style={{ color: labTokens.colors.textPrimary }}
      >
        {point.value.toFixed(1)}
        <span className="text-xs font-normal ml-1" style={{ color: labTokens.colors.textMuted }}>RTG</span>
      </div>
    </div>
  );
}

export interface PerformanceTrendProps {
  data: LabTrendPoint[];
  metric?: string;
  height?: number;
  showWinLoss?: boolean;
  leagueAvg?: number;
  animated?: boolean;
  className?: string;
}

export function PerformanceTrend({
  data,
  metric = 'Passer Rating',
  height = 240,
  showWinLoss = true,
  leagueAvg = 88.0,
  animated = true,
  className = '',
}: PerformanceTrendProps) {
  const [mounted, setMounted] = useState(false);

  // Avoid Recharts SSR mismatch on static export
  useEffect(() => { setMounted(true); }, []);

  const wins = data.filter(d => d.result === 'W').length;
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length;

  if (!mounted) {
    return (
      <div
        className={`w-full rounded-xl border ${className}`}
        style={{
          height,
          background: labTokens.colors.surfaceElevated,
          borderColor: labTokens.colors.surfaceBorder,
        }}
      />
    );
  }

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* Summary row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
        <div>
          <span className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>AVG {metric.toUpperCase()}</span>
          <span className="font-mono font-bold text-lg ml-2" style={{ color: labTokens.colors.textPrimary }}>{avg.toFixed(1)}</span>
        </div>
        {showWinLoss && (
          <div>
            <span className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>W-L</span>
            <span className="font-mono font-bold ml-2" style={{ color: labTokens.colors.win }}>{wins}</span>
            <span className="font-mono" style={{ color: labTokens.colors.textMuted }}>-</span>
            <span className="font-mono font-bold" style={{ color: labTokens.colors.loss }}>{data.length - wins}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-px border-t border-dashed" style={{ borderColor: labTokens.colors.textMuted }} />
          <span className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>League avg {leagueAvg}</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={labTokens.colors.orange} stopOpacity={0.3} />
                <stop offset="100%" stopColor={labTokens.colors.orange} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 6"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: labTokens.colors.textMuted, fontSize: 11, fontFamily: 'var(--font-ibm-mono), ui-monospace, monospace' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />

            <YAxis
              domain={[40, 115]}
              tick={{ fill: labTokens.colors.textMuted, fontSize: 11, fontFamily: 'var(--font-ibm-mono), ui-monospace, monospace' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <ReferenceLine
              y={leagueAvg}
              stroke={labTokens.colors.textMuted}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />

            <Tooltip
              content={(props) => <ChartTooltip active={props.active} payload={props.payload as TooltipData['payload']} />}
              cursor={{ stroke: labTokens.colors.orange, strokeWidth: 1, strokeOpacity: 0.4 }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={labTokens.colors.orange}
              strokeWidth={2}
              fill="url(#trend-fill)"
              dot={(props) => {
                const { cx, cy, payload } = props;
                const p = payload as LabTrendPoint;
                const color =
                  p.result === 'W' ? labTokens.colors.win :
                  p.result === 'L' ? labTokens.colors.loss :
                  labTokens.colors.tie;
                return (
                  <circle
                    key={`dot-${p.week}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={color}
                    stroke={labTokens.colors.pageBg}
                    strokeWidth={1.5}
                  />
                );
              }}
              activeDot={{ r: 6, stroke: labTokens.colors.orange, fill: labTokens.colors.pageBg, strokeWidth: 2 }}
              isAnimationActive={animated}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Win/loss dot legend */}
      {showWinLoss && (
        <div className="flex gap-4 font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: labTokens.colors.win }} /> Win
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: labTokens.colors.loss }} /> Loss
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: labTokens.colors.tie }} /> Tie
          </span>
        </div>
      )}
    </div>
  );
}
