'use client';

import { useState } from 'react';
import { DecisionFork } from '@/components/features/types/caseStudyDetail';

interface Props {
  forks: DecisionFork[];
}

export function DecisionForks({ forks }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2">
      {forks.map((fork, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className="border border-white/10 rounded-[3px] overflow-hidden transition-colors duration-150"
            style={{ background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent' }}
          >
            {/* Header */}
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 min-h-[52px] hover:bg-white/[0.03] transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-white/30">{fork.num}</span>
                <span className="text-[15px] font-semibold text-white leading-snug">{fork.title}</span>
              </div>
              <span
                className="font-mono text-[18px] text-brass shrink-0 transition-transform duration-200"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            {/* Fork body */}
            {isOpen && (
              <div className="px-5 pb-5">
                {/* Two-column fork */}
                <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-3 mb-4">
                  {/* Rejected */}
                  <div className="border border-white/10 rounded-[3px] p-4 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white/30 text-[13px]" aria-hidden="true">✕</span>
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-white/30">
                        Ruled out
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-white/60 leading-snug mb-2">
                      {fork.rejected.title}
                    </p>
                    <p className="text-[13px] leading-[1.6] text-white/40">
                      {fork.rejected.description}
                    </p>
                  </div>

                  {/* Chosen */}
                  <div
                    className="border rounded-[3px] p-4"
                    style={{
                      borderColor: 'oklch(0.62 0.115 78 / 0.5)',
                      background:  'oklch(0.62 0.115 78 / 0.05)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-brass text-[13px]" aria-hidden="true">✓</span>
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-brass">
                        Chosen
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-white leading-snug mb-2">
                      {fork.chosen.title}
                    </p>
                    <p className="text-[13px] leading-[1.6] text-white/60">
                      {fork.chosen.description}
                    </p>
                  </div>
                </div>

                {/* Why */}
                <div
                  className="pl-4 py-3 border-l-[2px] rounded-r-[2px]"
                  style={{ borderColor: 'oklch(0.62 0.115 78 / 0.5)' }}
                >
                  <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-brass mb-1.5">Why</p>
                  <p className="text-[13px] leading-[1.65] text-white/55">{fork.why}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
