'use client';

interface Stage {
  id: string;
  label: string;
}

interface StageRailProps {
  stages: Stage[];
  activeId: string;
}

export function StageRail({ stages, activeId }: StageRailProps) {
  const activeIdx = stages.findIndex(s => s.id === activeId); // used for isActive only

  return (
    <div className="sticky top-[60px] z-30 bg-ink-950/95 backdrop-blur-sm border-b border-white/[0.08]">
      <div className="col">
        <div className="flex items-start py-3">
          {stages.map((stage, i) => {
            const isActive = i === activeIdx;
            const isLast   = i === stages.length - 1;

            return (
              <div key={stage.id} className="flex items-start flex-1 last:flex-none">
                {/* Dot + label */}
                <a
                  href={`#${stage.id}`}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className="block w-2 h-2 rounded-full mt-1 transition-all duration-300"
                    style={{
                      background: isActive ? 'oklch(0.62 0.115 78)' : 'rgba(255,255,255,0.15)',
                      boxShadow:  isActive ? '0 0 0 3px oklch(0.62 0.115 78 / 0.25)' : 'none',
                    }}
                  />
                  <span
                    className="font-mono text-[10px] tracking-[0.07em] uppercase whitespace-nowrap transition-colors duration-200"
                    style={{
                      color:      isActive ? 'white' : 'rgba(255,255,255,0.3)',
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    {stage.label}
                  </span>
                </a>

                {/* Static connecting line */}
                {!isLast && (
                  <div className="flex-1 h-[1px] mt-[8px] mx-2 rounded-full bg-white/10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
