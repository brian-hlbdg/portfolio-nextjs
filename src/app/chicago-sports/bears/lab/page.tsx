'use client';

import React from 'react';
import { LabShell } from '@/components/features/bears-lab/LabShell';
import { ComponentPreview } from '@/components/features/bears-lab/ComponentPreview';
import { PlayerSpotlight } from '@/components/features/bears-lab/PlayerSpotlight';
import { PlayerAvatar } from '@/components/features/bears-lab/PlayerAvatar';
import { FootballField } from '@/components/features/bears-lab/FootballField';
import { PassingTerritory } from '@/components/features/bears-lab/PassingTerritory';
import { ThirdDownMatrix } from '@/components/features/bears-lab/ThirdDownMatrix';
import { PerformanceTrend } from '@/components/features/bears-lab/PerformanceTrend';
import { MetricTooltip } from '@/components/features/bears-lab/MetricTooltip';
import { labTokens } from '@/components/features/bears-lab/tokens';
import {
  fixtureQB,
  fixtureRB,
  fixtureWR,
  fixturePassingStats,
  fixtureRushingStats,
  fixtureThirdDownMatrix,
  fixturePassTargets,
  fixturePerformanceTrend,
} from '@/components/features/bears-lab/fixtureData';
import type { DeviceWidth } from '@/components/features/bears-lab/tokens';
import type { LabPlayer, PassOutcome, ComponentState } from '@/components/features/bears-lab/types';

// --- Loading / empty / error states ---

function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div
      className="rounded-2xl border p-5 animate-pulse"
      style={{ background: labTokens.colors.surfaceElevated, borderColor: labTokens.colors.surfaceBorder }}
    >
      <div className="h-5 w-2/3 rounded mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 rounded mb-2" style={{ background: 'rgba(255,255,255,0.04)', width: `${60 + i * 10}%` }} />
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border py-12 gap-3"
      style={{
        background: labTokens.colors.surfaceElevated,
        borderColor: labTokens.colors.surfaceBorder,
        borderStyle: 'dashed',
      }}
    >
      <svg width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx={20} cy={20} r={19} stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
        <path d="M14 20h12M20 14v12" stroke="rgba(255,255,255,0.15)" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <p className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>
        No {label} data available
      </p>
    </div>
  );
}

function ErrorState({ message = 'Failed to load' }: { message?: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border px-5 py-4"
      style={{
        background: 'rgba(239,68,68,0.06)',
        borderColor: 'rgba(239,68,68,0.25)',
      }}
      role="alert"
    >
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx={10} cy={10} r={9} stroke="#EF4444" strokeWidth={1.5} />
        <path d="M10 6v4M10 13.5v.5" stroke="#EF4444" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
      <span className="font-mono text-xs" style={{ color: '#FCA5A5' }}>{message}</span>
    </div>
  );
}

export default function BearsLabPage() {
  return (
    <LabShell>

      {/* ================================================================
          1. PlayerSpotlight
      ================================================================ */}
      <ComponentPreview
        id="player-spotlight"
        title="PlayerSpotlight"
        description="Featured player card with cinematic layout and stats grid"
        variants={[
          { id: 'featured', label: 'featured' },
          { id: 'compact',  label: 'compact' },
        ]}
        defaultVariant="featured"
        supportedStates={['default', 'loading', 'empty']}
      >
        {(_device: DeviceWidth, variant: string, state: ComponentState) => {
          if (state === 'loading') return <SkeletonCard rows={4} />;
          if (state === 'empty')   return <EmptyState label="player" />;

          const player = variant === 'compact' ? fixtureRB : fixtureQB;
          const stats  = variant === 'compact' ? fixtureRushingStats : fixturePassingStats;

          return (
            <PlayerSpotlight
              player={player}
              stats={stats}
              variant={variant as 'featured' | 'compact'}
            />
          );
        }}
      </ComponentPreview>

      {/* ================================================================
          2. PlayerAvatar
      ================================================================ */}
      <ComponentPreview
        id="player-avatar"
        title="PlayerAvatar"
        description="Position-branded player avatar with jersey number and size variants"
        variants={[
          { id: 'jersey',   label: 'jersey' },
          { id: 'initials', label: 'initials' },
        ]}
        defaultVariant="jersey"
        supportedStates={['default', 'loading']}
      >
        {(_device: DeviceWidth, variant: string, state: ComponentState) => {
          if (state === 'loading') {
            return (
              <div className="flex items-end gap-5">
                {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                  <div
                    key={size}
                    className="rounded-full animate-pulse"
                    style={{
                      width: { sm:40, md:64, lg:96, xl:128 }[size],
                      height: { sm:40, md:64, lg:96, xl:128 }[size],
                      background: labTokens.colors.surfaceElevated,
                    }}
                  />
                ))}
              </div>
            );
          }

          const players: LabPlayer[] = [fixtureQB, fixtureRB, fixtureWR];

          return (
            <div className="space-y-6">
              {/* All sizes for one player */}
              <div>
                <p className="font-mono text-xs mb-3" style={{ color: labTokens.colors.textMuted }}>Size variants · {fixtureQB.name}</p>
                <div className="flex flex-wrap items-end gap-5">
                  {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                    <div key={size} className="flex flex-col items-center gap-1.5">
                      <PlayerAvatar
                        player={fixtureQB}
                        size={size}
                        variant={variant as 'jersey' | 'initials'}
                      />
                      <span className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>{size}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* One size for different positions */}
              <div>
                <p className="font-mono text-xs mb-3" style={{ color: labTokens.colors.textMuted }}>Position colors · lg</p>
                <div className="flex flex-wrap items-center gap-4">
                  {players.map(p => (
                    <div key={p.id} className="flex flex-col items-center gap-1.5">
                      <PlayerAvatar player={p} size="lg" variant={variant as 'jersey' | 'initials'} />
                      <span className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>{p.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      </ComponentPreview>

      {/* ================================================================
          3. FootballField
      ================================================================ */}
      <ComponentPreview
        id="football-field"
        title="FootballField"
        description="Responsive SVG football field with NFL dimensions, hash marks, and zone highlights"
        variants={[
          { id: 'clean',      label: 'clean' },
          { id: 'highlighted', label: 'highlighted' },
        ]}
        defaultVariant="clean"
        supportedStates={['default']}
      >
        {(_device: DeviceWidth, variant: string) => {
          const highlights = variant === 'highlighted'
            ? [
                { x1: 0,  y1: 20, x2: 33, y2: 80, label: 'Short L' },
                { x1: 33, y1: 20, x2: 67, y2: 80, label: 'Middle' },
                { x1: 67, y1: 20, x2: 100, y2: 80, label: 'Short R' },
              ]
            : [];

          return (
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: labTokens.colors.surfaceBorder }}>
              <FootballField
                homeTeam="BEARS"
                awayTeam="AWAY"
                highlights={highlights}
                interactive={variant === 'highlighted'}
              />
            </div>
          );
        }}
      </ComponentPreview>

      {/* ================================================================
          4. PassingTerritory
      ================================================================ */}
      <ComponentPreview
        id="passing-territory"
        title="PassingTerritory"
        description="Pass target scatter chart overlaid on the field, filterable by outcome"
        variants={[
          { id: 'all',      label: 'all outcomes' },
          { id: 'td-only',  label: 'TDs only' },
        ]}
        defaultVariant="all"
        supportedStates={['default', 'loading', 'empty']}
      >
        {(_device: DeviceWidth, variant: string, state: ComponentState) => {
          if (state === 'loading') {
            return (
              <div
                className="w-full rounded-xl animate-pulse"
                style={{ aspectRatio: '1200/533', background: labTokens.colors.surfaceElevated }}
              />
            );
          }
          if (state === 'empty') return <EmptyState label="pass target" />;

          const targets = variant === 'td-only'
            ? fixturePassTargets.filter(t => t.outcome === 'touchdown')
            : fixturePassTargets;
          const highlight: PassOutcome | null = variant === 'td-only' ? 'touchdown' : null;

          return (
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: labTokens.colors.surfaceBorder }}>
              <PassingTerritory
                targets={targets}
                highlightOutcome={highlight}
                showLegend={variant !== 'td-only'}
              />
            </div>
          );
        }}
      </ComponentPreview>

      {/* ================================================================
          5. ThirdDownMatrix
      ================================================================ */}
      <ComponentPreview
        id="third-down-matrix"
        title="ThirdDownMatrix"
        description="3rd down conversion rates by distance — animated bar matrix with color-coded tiers"
        supportedStates={['default', 'loading', 'empty', 'error']}
      >
        {(_device: DeviceWidth, _variant: string, state: ComponentState) => {
          if (state === 'loading') return <SkeletonCard rows={6} />;
          if (state === 'empty')   return <EmptyState label="3rd down" />;
          if (state === 'error')   return <ErrorState message="3rd down data unavailable — ESPN API limitation" />;

          return (
            <div
              className="rounded-2xl border p-5"
              style={{
                background: labTokens.colors.surface,
                borderColor: labTokens.colors.surfaceBorder,
              }}
            >
              <div className="mb-4">
                <h3 className="font-bold text-sm" style={{ color: labTokens.colors.textPrimary }}>
                  3rd Down Conversion Rate
                </h3>
                <p className="font-mono text-xs mt-0.5" style={{ color: labTokens.colors.textMuted }}>
                  By yards to go · Season
                </p>
              </div>
              <ThirdDownMatrix data={fixtureThirdDownMatrix} />
            </div>
          );
        }}
      </ComponentPreview>

      {/* ================================================================
          6. PerformanceTrend
      ================================================================ */}
      <ComponentPreview
        id="performance-trend"
        title="PerformanceTrend"
        description="Weekly passer rating area chart with win/loss result indicators"
        variants={[
          { id: 'with-winloss',    label: 'with W/L' },
          { id: 'without-winloss', label: 'bare' },
        ]}
        defaultVariant="with-winloss"
        supportedStates={['default', 'loading', 'empty', 'error']}
      >
        {(_device: DeviceWidth, variant: string, state: ComponentState) => {
          if (state === 'loading') {
            return (
              <div
                className="w-full rounded-xl animate-pulse"
                style={{ height: 240, background: labTokens.colors.surfaceElevated }}
              />
            );
          }
          if (state === 'empty') return <EmptyState label="trend" />;
          if (state === 'error') return <ErrorState message="Performance data unavailable" />;

          return (
            <div
              className="rounded-2xl border p-5"
              style={{
                background: labTokens.colors.surface,
                borderColor: labTokens.colors.surfaceBorder,
              }}
            >
              <div className="mb-4">
                <h3 className="font-bold text-sm" style={{ color: labTokens.colors.textPrimary }}>
                  Passer Rating · Season Trend
                </h3>
                <p className="font-mono text-xs mt-0.5" style={{ color: labTokens.colors.textMuted }}>
                  Weekly · 12 games
                </p>
              </div>
              <PerformanceTrend
                data={fixturePerformanceTrend}
                showWinLoss={variant === 'with-winloss'}
                leagueAvg={88.0}
              />
            </div>
          );
        }}
      </ComponentPreview>

      {/* ================================================================
          7. MetricTooltip
      ================================================================ */}
      <ComponentPreview
        id="metric-tooltip"
        title="MetricTooltip"
        description="Keyboard-accessible inline tooltip for stat context, league average, and percentile"
        supportedStates={['default']}
      >
        {() => (
          <div
            className="rounded-2xl border p-6 space-y-6"
            style={{
              background: labTokens.colors.surface,
              borderColor: labTokens.colors.surfaceBorder,
            }}
          >
            <p className="font-mono text-xs" style={{ color: labTokens.colors.textMuted }}>
              Hover or focus the underlined values to see context tooltips.
            </p>

            {/* Passing stats line */}
            <div
              className="rounded-xl border px-5 py-4"
              style={{ background: labTokens.colors.surfaceElevated, borderColor: labTokens.colors.surfaceBorder }}
            >
              <p className="font-mono text-xs mb-3" style={{ color: labTokens.colors.textMuted }}>Passing · Season</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm" style={{ color: labTokens.colors.textSecondary }}>
                <span>
                  Comp %{' '}
                  <MetricTooltip
                    label="Completion Percentage"
                    value={fixturePassingStats.completionPct}
                    unit="%"
                    leagueAvg={63.0}
                    percentile={71}
                    context="Percentage of pass attempts resulting in a completion. Above 65% is typically elite."
                  />
                </span>
                <span>
                  Rating{' '}
                  <MetricTooltip
                    label="Passer Rating"
                    value={fixturePassingStats.rating}
                    leagueAvg={88.0}
                    percentile={62}
                    context="NFL passer rating (0–158.3 scale). 100+ is considered a good season."
                  />
                </span>
                <span>
                  YPA{' '}
                  <MetricTooltip
                    label="Yards Per Attempt"
                    value={fixturePassingStats.yardsPerAttempt}
                    leagueAvg={6.9}
                    percentile={78}
                    context="Average yards gained per pass attempt. 7.5+ is elite efficiency."
                  />
                </span>
              </div>
            </div>

            {/* Rushing stats line */}
            <div
              className="rounded-xl border px-5 py-4"
              style={{ background: labTokens.colors.surfaceElevated, borderColor: labTokens.colors.surfaceBorder }}
            >
              <p className="font-mono text-xs mb-3" style={{ color: labTokens.colors.textMuted }}>Rushing · Season</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm" style={{ color: labTokens.colors.textSecondary }}>
                <span>
                  YPC{' '}
                  <MetricTooltip
                    label="Yards Per Carry"
                    value={fixtureRushingStats.yardsPerCarry}
                    leagueAvg={4.2}
                    percentile={68}
                    context="Average yards gained per rushing attempt. 4.5+ is considered effective."
                  />
                </span>
                <span>
                  Carries{' '}
                  <MetricTooltip
                    label="Rush Attempts"
                    value={fixtureRushingStats.attempts}
                    context="Total rushing attempts for the season."
                  />
                </span>
              </div>
            </div>
          </div>
        )}
      </ComponentPreview>

    </LabShell>
  );
}
