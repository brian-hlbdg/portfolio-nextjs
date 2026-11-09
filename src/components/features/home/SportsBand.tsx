import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { NFL_TEAMS } from '@/data/nflTeamLogos';

export function SportsBand() {
  return (
    <section
      id="sports"
      className="relative bg-sports-ink overflow-hidden py-20"
    >
      {/* Bears logo watermark */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[25%] select-none pointer-events-none"
        style={{ width: 'clamp(360px, 64vw, 800px)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={NFL_TEAMS.CHI.logos.scoreboard}
          alt=""
          className="w-full h-full opacity-[0.18]"
        />
      </div>

      <div className="col relative z-10">
        <div className="flex flex-col min-[760px]:flex-row items-start min-[760px]:items-center gap-10 min-[760px]:gap-16">

          {/* Text */}
          <Reveal delay={0} className="flex-1">
            <p className="font-mono text-[11px] tracking-[0.1em] text-sports-accent uppercase mb-4">
              Chicago Sports · Side project
            </p>
            <h2 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.01em] text-white mb-5">
              Live Bears dashboard.
            </h2>
            <p className="text-[16px] leading-[1.6] text-white/60 max-w-[440px] mb-8">
              A real-time dashboard for Chicago Bears season stats, roster,
              and matchup analysis — built in Next.js with live ESPN data.
              Proof that the same design system scales to a sports context.
            </p>
            <Link
              href="/chicago-sports/bears"
              className="inline-flex items-center gap-2 font-mono text-[13px] text-white border border-white/25 px-5 py-3 rounded-[2px] hover:bg-white/10 transition-colors duration-200"
            >
              View dashboard →
            </Link>
          </Reveal>

          {/* Screenshot */}
          <Reveal delay={150} className="w-full min-[760px]:w-[420px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/sports.jpg"
              alt="Chicago Bears live dashboard"
              className="w-full rounded-[4px] shadow-2xl"
              style={{ aspectRatio: '16/10', objectFit: 'cover' }}
            />
          </Reveal>

        </div>
      </div>
    </section>
  );
}
