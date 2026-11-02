'use client';

import { useState } from 'react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);

  if (!beforeImage || !afterImage) return null;

  return (
    <div>
      {/* Frame */}
      <div
        className="relative overflow-hidden rounded-[4px] bg-black/40 select-none"
        style={{ aspectRatio: '16/10' }}
      >
        {/* After image (full width underneath) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before image (clipped to slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 h-full object-cover"
            style={{ width: `${(100 / pos) * 100}%`, maxWidth: 'none' }}
            draggable={false}
          />
        </div>

        {/* Brass divider line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-brass pointer-events-none"
          style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
          aria-hidden="true"
        />

        {/* Corner labels */}
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.1em] text-white/60 uppercase bg-black/40 px-2 py-1 rounded-[2px]">
          {beforeLabel}
        </span>
        <span className="absolute top-3 right-3 font-mono text-[10px] tracking-[0.1em] text-white/60 uppercase bg-black/40 px-2 py-1 rounded-[2px]">
          {afterLabel}
        </span>
      </div>

      {/* Range input */}
      <div className="flex items-center gap-3 mt-3">
        <span className="font-mono text-[11px] text-white/40 uppercase shrink-0">{beforeLabel}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={e => setPos(Number(e.target.value))}
          className="flex-1 accent-[oklch(0.62_0.115_78)] cursor-pointer"
          aria-label="Before / After comparison"
          aria-valuetext={`${pos}% ${afterLabel}`}
        />
        <span className="font-mono text-[11px] text-white/40 uppercase shrink-0">{afterLabel}</span>
      </div>
    </div>
  );
}
