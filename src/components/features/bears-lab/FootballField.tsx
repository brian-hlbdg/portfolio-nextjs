'use client';

import React, { useState, useId } from 'react';
import { labTokens } from './tokens';

// NFL field: 120 yd × 53.33 yd
// ViewBox: 1200 × 533 (10px per yard)
const W = 1200;
const H = 533;
const EZ = 100;      // end zone depth (10 yd)
const PW = W - 2 * EZ; // playing field width (100 yd)

// NFL hash marks: 70'9" from each sideline = ~23.6 yd
const HASH_Y1 = Math.round(H / 2 - (18.5 / 3) * 10 / 2); // ~258 (top hash)
const HASH_Y2 = H - HASH_Y1;                                // ~275 (bottom hash)

const FIELD_GREEN = '#173825';
const FIELD_GREEN_ALT = '#1A4030';
const LINE_COLOR = 'rgba(255,255,255,0.72)';
const LINE_FAINT = 'rgba(255,255,255,0.18)';
const EZ_HOME = '#0B1A2E';   // Bears navy
const EZ_AWAY = '#1A1A2E';

// 10-yard line x positions (within playing field, offset from EZ)
const TEN_LINES = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => EZ + n * 100);
// 5-yard line x positions (non-10-yd)
const FIVE_LINES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  .map(n => EZ + n * 50)
  .filter(x => !TEN_LINES.includes(x));

// Yard labels (10,20,30,40,50,40,30,20,10) at x positions
const YARD_LABELS = [
  { x: EZ + 100, label: '10' },
  { x: EZ + 200, label: '20' },
  { x: EZ + 300, label: '30' },
  { x: EZ + 400, label: '40' },
  { x: EZ + 500, label: '50' },
  { x: EZ + 600, label: '40' },
  { x: EZ + 700, label: '30' },
  { x: EZ + 800, label: '20' },
  { x: EZ + 900, label: '10' },
];

type ZoneHighlight = { x1: number; y1: number; x2: number; y2: number; label?: string };

export interface FootballFieldProps {
  width?: number | string;
  homeTeam?: string;
  awayTeam?: string;
  showEndzones?: boolean;
  highlights?: ZoneHighlight[];
  interactive?: boolean;
  onFieldClick?: (fieldX: number, fieldY: number) => void;
  className?: string;
}

export function FootballField({
  width = '100%',
  homeTeam = 'BEARS',
  awayTeam = 'AWAY',
  showEndzones = true,
  highlights = [],
  interactive = false,
  onFieldClick,
  className = '',
}: FootballFieldProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const gradId = useId();

  function handleSvgClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!interactive || !onFieldClick) return;
    const rect = (e.target as Element).closest('svg')!.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const svgY = ((e.clientY - rect.top) / rect.height) * H;
    // Normalize to 0-100 field coords (playing field only)
    const fieldX = Math.max(0, Math.min(100, ((svgX - EZ) / PW) * 100));
    const fieldY = Math.max(0, Math.min(100, (svgY / H) * 100));
    onFieldClick(fieldX, fieldY);
  }

  return (
    <div className={`w-full ${className}`} style={{ maxWidth: typeof width === 'number' ? width : undefined }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={width}
        height="auto"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="NFL football field diagram"
        className="block"
        style={{ cursor: interactive ? 'crosshair' : 'default' }}
        onClick={handleSvgClick}
      >
        <defs>
          {/* Field pattern for alternating yard bands */}
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
        </defs>

        {/* Field base */}
        <rect x={0} y={0} width={W} height={H} fill={FIELD_GREEN} />
        {/* Alternating 10-yd stripes on playing field */}
        <rect x={EZ} y={0} width={PW} height={H} fill={`url(#${gradId}-stripe)`} />

        {/* End zones */}
        {showEndzones && (
          <>
            <rect x={0} y={0} width={EZ} height={H} fill={EZ_HOME} />
            <rect x={W - EZ} y={0} width={EZ} height={H} fill={EZ_AWAY} />
            {/* End zone text */}
            <text
              x={EZ / 2}
              y={H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(-90, ${EZ / 2}, ${H / 2})`}
              fill={labTokens.colors.orange}
              fontFamily="var(--font-archivo), system-ui, sans-serif"
              fontWeight="800"
              fontSize={28}
              letterSpacing="0.15em"
            >
              {homeTeam}
            </text>
            <text
              x={W - EZ / 2}
              y={H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(90, ${W - EZ / 2}, ${H / 2})`}
              fill={LINE_FAINT}
              fontFamily="var(--font-archivo), system-ui, sans-serif"
              fontWeight="800"
              fontSize={28}
              letterSpacing="0.15em"
            >
              {awayTeam}
            </text>
          </>
        )}

        {/* Outer boundary */}
        <rect x={1} y={1} width={W - 2} height={H - 2} fill="none" stroke={LINE_COLOR} strokeWidth={3} />

        {/* Goal lines */}
        <line x1={EZ} y1={0} x2={EZ} y2={H} stroke={LINE_COLOR} strokeWidth={3} />
        <line x1={W - EZ} y1={0} x2={W - EZ} y2={H} stroke={LINE_COLOR} strokeWidth={3} />

        {/* 10-yard lines */}
        {TEN_LINES.map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={H} stroke={LINE_COLOR} strokeWidth={1.5} />
        ))}

        {/* 5-yard lines (shorter, faint) */}
        {FIVE_LINES.map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={H} stroke={LINE_FAINT} strokeWidth={1} />
        ))}

        {/* Hash marks — top set */}
        {[...TEN_LINES, ...FIVE_LINES].map((x) => (
          <React.Fragment key={`hash-top-${x}`}>
            <line x1={x - 10} y1={HASH_Y1} x2={x + 10} y2={HASH_Y1} stroke={LINE_COLOR} strokeWidth={1.5} />
            <line x1={x - 10} y1={HASH_Y2} x2={x + 10} y2={HASH_Y2} stroke={LINE_COLOR} strokeWidth={1.5} />
          </React.Fragment>
        ))}

        {/* Yard number labels — near top sideline */}
        {YARD_LABELS.map(({ x, label }) => (
          <React.Fragment key={`label-${x}`}>
            <text
              x={x}
              y={HASH_Y1 - 20}
              textAnchor="middle"
              fill={LINE_COLOR}
              fontSize={28}
              fontFamily="var(--font-ibm-mono), ui-monospace, monospace"
              fontWeight="700"
              opacity={0.7}
            >
              {label}
            </text>
            <text
              x={x}
              y={HASH_Y2 + 36}
              textAnchor="middle"
              fill={LINE_COLOR}
              fontSize={28}
              fontFamily="var(--font-ibm-mono), ui-monospace, monospace"
              fontWeight="700"
              opacity={0.7}
            >
              {label}
            </text>
          </React.Fragment>
        ))}

        {/* Zone highlights */}
        {highlights.map((zone, i) => {
          const zId = `zone-${i}`;
          const isHovered = hoveredZone === zId;
          return (
            <g key={zId}>
              <rect
                x={EZ + (zone.x1 / 100) * PW}
                y={(zone.y1 / 100) * H}
                width={((zone.x2 - zone.x1) / 100) * PW}
                height={((zone.y2 - zone.y1) / 100) * H}
                fill={isHovered ? 'rgba(200,56,3,0.35)' : 'rgba(200,56,3,0.18)'}
                stroke={labTokens.colors.orange}
                strokeWidth={1.5}
                strokeOpacity={0.6}
                style={{ cursor: interactive ? 'pointer' : 'default', transition: 'fill 200ms' }}
                onMouseEnter={() => setHoveredZone(zId)}
                onMouseLeave={() => setHoveredZone(null)}
              />
              {zone.label && (
                <text
                  x={EZ + ((zone.x1 + zone.x2) / 2 / 100) * PW}
                  y={((zone.y1 + zone.y2) / 2 / 100) * H}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={labTokens.colors.orange}
                  fontSize={18}
                  fontFamily="var(--font-ibm-mono), ui-monospace, monospace"
                  fontWeight="700"
                >
                  {zone.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
