import { Reveal } from '@/components/ui/Reveal';

const stats = [
  { figure: '15 yrs',  label: 'HCI research and production engineering' },
  { figure: '50%+',    label: 'less end-user workload, NFI TMS' },
  { figure: 'M.S. HCI', label: 'DePaul University, 2018' },
];

export function ProofStrip() {
  return (
    <div className="border-t-[1.5px] border-ink border-b border-black/10">
      <div className="col">
        <div className="grid grid-cols-1 min-[560px]:grid-cols-3 divide-y min-[560px]:divide-y-0 min-[560px]:divide-x divide-black/10">
          {stats.map(({ figure, label }, i) => (
            <Reveal key={figure} delay={i * 110} className="py-6 min-[560px]:px-8 first:pl-0 last:pr-0">
              <div
                className="font-mono font-bold text-brass mb-1"
                style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}
              >
                {figure}
              </div>
              <div className="text-[13px] text-ink/60 leading-snug">{label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
