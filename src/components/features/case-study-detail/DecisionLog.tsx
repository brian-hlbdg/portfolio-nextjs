'use client';

import { useState } from 'react';

interface Decision {
  title: string;
  cost: string;
}

interface DecisionLogProps {
  decisions: Decision[];
}

export function DecisionLog({ decisions }: DecisionLogProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-white/10">
      {decisions.map((d, i) => (
        <div key={i} className="border-b border-white/10">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between py-4 text-left gap-4 min-h-[44px]"
          >
            <span className="text-[15px] font-semibold text-white leading-snug">{d.title}</span>
            <span className="font-mono text-[18px] text-brass shrink-0" aria-hidden="true">
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <p className="pb-5 text-[15px] leading-[1.7] text-white/60">{d.cost}</p>
          )}
        </div>
      ))}
    </div>
  );
}
