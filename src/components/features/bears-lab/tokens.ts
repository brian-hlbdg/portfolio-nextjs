// Bears Intelligence Lab — design tokens
// These extend the existing Bears color system (src/data/bears.ts)
// and are scoped to lab components only.

export const labTokens = {
  colors: {
    // Page & surface layers
    pageBg: '#030A14',
    surface: '#080F1E',
    surfaceElevated: '#0C1829',
    surfaceBright: '#112036',
    surfaceBorder: 'rgba(255,255,255,0.07)',
    surfaceBorderAccent: 'rgba(200,56,3,0.35)',

    // Text
    textPrimary: '#EEF2F7',
    textSecondary: '#7A98C0',
    textMuted: '#3A5272',
    textInverse: '#050C18',

    // Bears brand
    orange: '#C83803',
    orangeBright: '#E84800',
    orangeMuted: 'rgba(200,56,3,0.14)',
    orangeHover: 'rgba(200,56,3,0.25)',
    navy: '#0B162A',

    // Semantic data colors
    win: '#22C55E',
    loss: '#EF4444',
    tie: '#94A3B8',
    positive: '#22C55E',
    neutral: '#94A3B8',
    negative: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Pass outcome colors
    complete: '#22C55E',
    incomplete: '#475569',
    touchdown: '#F59E0B',
    interception: '#EF4444',

    // Data series
    series1: '#C83803',
    series2: '#3B82F6',
    series3: '#8B5CF6',
    series4: '#22C55E',

    // Field
    fieldGreen: '#1A4A2E',
    fieldGreenAlt: '#153D26',
    fieldLine: 'rgba(255,255,255,0.75)',
    fieldLineFaint: 'rgba(255,255,255,0.18)',
  },

  // Framer Motion transition configs
  transitions: {
    fast: { duration: 0.15, ease: [0.2, 0.7, 0.2, 1] as const },
    normal: { duration: 0.3, ease: [0.2, 0.7, 0.2, 1] as const },
    slow: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const },
    stagger: 0.06,
  },

  // Device preview widths (px)
  deviceWidths: {
    desktop: 1280,
    tablet: 768,
    mobile: 375,
  },
} as const;

export type LabColor = keyof typeof labTokens.colors;
export type DeviceWidth = keyof typeof labTokens.deviceWidths;
