'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CopyEmailButton } from '@/components/ui/CopyEmailButton';
import { Reveal } from '@/components/ui/Reveal';

function useChicagoTime() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function HeroSection() {
  const time = useChicagoTime();

  return (
    <section className="pt-20 pb-16">
      <div className="col">

        <Reveal delay={0} as="p" className="font-mono text-[11px] tracking-[0.1em] text-ink/50 mb-8 flex items-center gap-2">
          <span className="inline-block w-[7px] h-[7px] rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
          SENIOR SOFTWARE ENGINEER · AHEAD / CHICAGO
          {time && <span className="ml-1">{time} CT</span>}
        </Reveal>

        <Reveal delay={110}>
          <h1
            className="font-sans font-black leading-[0.98] tracking-[-0.02em] mb-8 text-ink"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            I build software that matches<br className="hidden sm:block" /> how people actually think.
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="text-[17px] leading-[1.6] text-ink/70 max-w-[600px] mb-10">
            Full-stack engineer with an M.S. in HCI. Fifteen years from contextual
            inquiry and cognitive task analysis to production Elixir and React — with
            no handoff chain in between.
          </p>
        </Reveal>

        <Reveal delay={330}>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-bone-50 text-[13px] font-medium rounded-[2px] hover:bg-ink/85 transition-colors duration-200"
            >
              Selected work
            </Link>
            <CopyEmailButton variant="ghost" />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
