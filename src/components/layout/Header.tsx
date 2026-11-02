'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Work',           href: '/#work' },
  { label: 'Experience',     href: '/#experience' },
  { label: 'Writing',        href: '/blog' },
  { label: 'Chicago Sports', href: '/chicago-sports' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-[60px] bg-bone-50/95 backdrop-blur-sm border-b border-black/[0.07]">
      <div className="col h-full flex items-center justify-between gap-6">

        <Link href="/" onClick={() => setOpen(false)} className="shrink-0 font-sans font-bold text-[15px] tracking-[-0.01em] text-ink hover:opacity-75 transition-opacity">
          Brian Hall
        </Link>

        {/* Desktop nav */}
        <nav className="hidden min-[760px]:flex items-center gap-7">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-sans text-[13px] font-medium text-ink/70 hover:text-ink transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="min-[760px]:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className={`block h-[1.5px] bg-ink transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block h-[1.5px] bg-ink transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block h-[1.5px] bg-ink transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="min-[760px]:hidden absolute top-[60px] inset-x-0 bg-bone-50 border-b border-black/[0.07] py-2 shadow-sm">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-[14px] font-medium text-ink/80 hover:text-ink hover:bg-bone-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
