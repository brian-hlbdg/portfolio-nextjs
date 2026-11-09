import Link from 'next/link';
import { CopyEmailButton } from '@/components/ui/CopyEmailButton';

const social = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hlbdg/' },
  { label: 'GitHub',   href: 'https://github.com/brian-hlbdg' },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 text-white/80">

      {/* Main footer content */}
      <div className="col py-16 min-[760px]:py-20">

        {/* Closing line */}
        <h2
          className="font-sans font-black leading-[1.05] tracking-[-0.02em] text-white mb-8 max-w-[620px]"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
        >
          Need someone who can research it, design it and ship it?
        </h2>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          <CopyEmailButton variant="brass" />
          <a
            href="mailto:brian@hlbdesigngroup.com?subject=Resume%20Request&body=Hi%20Brian%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20see%20your%20resume.%0A%0AThanks"
            className="inline-flex items-center gap-2 font-mono text-[13px] text-white/80 border border-white/25 px-5 py-3 rounded-[2px] hover:border-white/50 hover:text-white transition-colors duration-200"
          >
            Request résumé ↗
          </a>
        </div>

        {/* Base row */}
        <div className="border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-white/40 uppercase">
            HLB Design Group · Chicago
          </p>
          <div className="flex items-center gap-6">
            {social.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] tracking-[0.05em] text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
            <Link
              href="/about"
              className="font-mono text-[11px] tracking-[0.05em] text-white/40 hover:text-white/80 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/#work"
              className="font-mono text-[11px] tracking-[0.05em] text-white/40 hover:text-white/80 transition-colors duration-200"
            >
              Work
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
