'use client';

import React, { useState, useId } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { labTokens } from './tokens';
import type { DeviceWidth } from './tokens';
import type { ComponentState } from './types';

const DEVICE_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

const DEVICE_LABELS = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

const STATE_LABELS: Record<ComponentState, string> = {
  default: 'Default',
  loading: 'Loading',
  empty: 'Empty',
  error: 'Error',
};

export interface Variant {
  id: string;
  label: string;
}

export interface ComponentPreviewProps {
  id: string;
  title: string;
  description: string;
  variants?: Variant[];
  defaultVariant?: string;
  supportedStates?: ComponentState[];
  children: (device: DeviceWidth, variant: string, state: ComponentState) => React.ReactNode;
}

export function ComponentPreview({
  id,
  title,
  description,
  variants = [],
  defaultVariant,
  supportedStates = ['default', 'loading', 'empty', 'error'],
  children,
}: ComponentPreviewProps) {
  const labelId = useId();
  const [device, setDevice] = useState<DeviceWidth>('desktop');
  const [variant, setVariant] = useState(defaultVariant ?? variants[0]?.id ?? 'default');
  const [state, setState] = useState<ComponentState>('default');

  const previewMaxWidth = labTokens.deviceWidths[device];
  const devices: DeviceWidth[] = ['desktop', 'tablet', 'mobile'];

  return (
    <section
      id={id}
      className="scroll-mt-20"
      aria-labelledby={labelId}
    >
      {/* Section header */}
      <div
        className="rounded-t-2xl border-b px-5 py-4"
        style={{
          background: labTokens.colors.surfaceElevated,
          borderColor: labTokens.colors.surfaceBorder,
        }}
      >
        <h2
          id={labelId}
          className="font-bold leading-tight"
          style={{ color: labTokens.colors.textPrimary, fontSize: '1.1rem' }}
        >
          {title}
        </h2>
        <p className="font-mono text-xs mt-0.5" style={{ color: labTokens.colors.textMuted }}>
          {description}
        </p>
      </div>

      {/* Controls bar */}
      <div
        className="flex flex-wrap items-center gap-3 px-5 py-3 border-b"
        style={{
          background: labTokens.colors.surface,
          borderColor: labTokens.colors.surfaceBorder,
        }}
      >
        {/* Device selector */}
        <div
          className="flex items-center rounded-lg p-0.5 gap-0.5"
          style={{ background: 'rgba(255,255,255,0.05)' }}
          role="group"
          aria-label="Device preview width"
        >
          {devices.map((d) => {
            const Icon = DEVICE_ICONS[d];
            const active = device === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs transition-all"
                style={{
                  background: active ? labTokens.colors.surfaceElevated : 'transparent',
                  color: active ? labTokens.colors.textPrimary : labTokens.colors.textMuted,
                  border: `1px solid ${active ? labTokens.colors.surfaceBorder : 'transparent'}`,
                }}
                aria-pressed={active}
              >
                <Icon size={12} aria-hidden="true" />
                <span className="hidden sm:inline">{DEVICE_LABELS[d]}</span>
                <span className="font-mono text-[10px] opacity-60">
                  {labTokens.deviceWidths[d]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Variant selector */}
        {variants.length > 1 && (
          <div
            className="flex items-center rounded-lg p-0.5 gap-0.5"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            role="group"
            aria-label="Component variant"
          >
            {variants.map((v) => {
              const active = variant === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariant(v.id)}
                  className="rounded-md px-2.5 py-1.5 font-mono text-xs transition-all"
                  style={{
                    background: active ? labTokens.colors.orangeMuted : 'transparent',
                    color: active ? labTokens.colors.orange : labTokens.colors.textMuted,
                    border: `1px solid ${active ? labTokens.colors.surfaceBorderAccent : 'transparent'}`,
                  }}
                  aria-pressed={active}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        )}

        {/* State selector */}
        {supportedStates.length > 1 && (
          <div
            className="flex items-center rounded-lg p-0.5 gap-0.5 ml-auto"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            role="group"
            aria-label="Component state"
          >
            {supportedStates.map((s) => {
              const active = state === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setState(s)}
                  className="rounded-md px-2.5 py-1.5 font-mono text-xs transition-all"
                  style={{
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: active ? labTokens.colors.textPrimary : labTokens.colors.textMuted,
                    border: `1px solid ${active ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                  }}
                  aria-pressed={active}
                >
                  {STATE_LABELS[s]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview area */}
      <div
        className="rounded-b-2xl border-t-0 p-6 flex justify-center"
        style={{
          background: labTokens.colors.pageBg,
          border: `1px solid ${labTokens.colors.surfaceBorder}`,
          borderTop: 'none',
        }}
      >
        <div
          className="w-full transition-all duration-300"
          style={{ maxWidth: previewMaxWidth }}
        >
          {children(device, variant, state)}
        </div>
      </div>
    </section>
  );
}
