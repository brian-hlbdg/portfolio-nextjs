'use client';

import React from 'react';
import { labTokens } from './tokens';
import { FIXTURE_DISCLAIMER } from './fixtureData';

const NAV_ITEMS = [
  { href: '#player-spotlight',   label: 'PlayerSpotlight' },
  { href: '#player-avatar',      label: 'PlayerAvatar' },
  { href: '#football-field',     label: 'FootballField' },
  { href: '#passing-territory',  label: 'PassingTerritory' },
  { href: '#third-down-matrix',  label: 'ThirdDownMatrix' },
  { href: '#performance-trend',  label: 'PerformanceTrend' },
  { href: '#metric-tooltip',     label: 'MetricTooltip' },
];

function LabHeader() {
  return (
    <header
      className="border-b px-5 py-4 flex flex-wrap items-start justify-between gap-3"
      style={{
        background: labTokens.colors.surface,
        borderColor: labTokens.colors.surfaceBorderAccent,
      }}
    >
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="font-mono font-bold text-xs uppercase tracking-widest px-2 py-0.5 rounded"
            style={{
              background: labTokens.colors.orangeMuted,
              color: labTokens.colors.orange,
              border: `1px solid ${labTokens.colors.surfaceBorderAccent}`,
              letterSpacing: '0.12em',
            }}
          >
            LAB
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: labTokens.colors.textMuted }}
          >
            v0.1.0 · Phase 1
          </span>
        </div>
        <h1
          className="font-bold leading-tight"
          style={{ color: labTokens.colors.textPrimary, fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}
        >
          Bears Intelligence Lab
        </h1>
        <p className="font-mono text-xs mt-0.5" style={{ color: labTokens.colors.textSecondary }}>
          Football Analytics · Visualization Laboratory
        </p>
      </div>

      {/* Fixture data disclaimer */}
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 border font-mono text-xs"
        style={{
          background: 'rgba(239,68,68,0.08)',
          borderColor: 'rgba(239,68,68,0.3)',
          color: '#FCA5A5',
        }}
        role="alert"
        aria-live="polite"
      >
        <span aria-hidden="true">⚠</span>
        <span>{FIXTURE_DISCLAIMER}</span>
      </div>
    </header>
  );
}

function LabNav() {
  return (
    <nav
      className="sticky top-[60px] z-30 border-b overflow-x-auto"
      style={{
        background: labTokens.colors.surface + 'F0',
        borderColor: labTokens.colors.surfaceBorder,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      aria-label="Lab component navigation"
    >
      <div className="flex gap-0 px-2 py-1 min-w-max">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-lg font-mono text-xs font-medium transition-colors whitespace-nowrap"
            style={{ color: labTokens.colors.textSecondary }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = labTokens.colors.textPrimary;
              (e.currentTarget as HTMLElement).style.background = labTokens.colors.surfaceElevated;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = labTokens.colors.textSecondary;
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export interface LabShellProps {
  children: React.ReactNode;
}

export function LabShell({ children }: LabShellProps) {
  return (
    <div
      className="min-h-screen"
      style={{ background: labTokens.colors.pageBg }}
    >
      <LabHeader />
      <LabNav />
      <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">
        {children}
      </main>
    </div>
  );
}
