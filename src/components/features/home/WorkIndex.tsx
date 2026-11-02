'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

type Discipline = 'all' | 'ux' | 'design-systems' | 'frontend' | 'data-viz';

interface WorkItem {
  num: string;
  title: string;
  outcome: string | null;
  client: string;
  year: string;
  slug: string;
  disciplines: Discipline[];
}

const workItems: WorkItem[] = [
  {
    num: '01',
    title: 'Transportation Management System redesign',
    outcome: '→ 50%+ less end-user workload',
    client: 'NFI Industries',
    year: '2023',
    slug: 'nfi-tms-platform',
    disciplines: ['ux', 'design-systems'],
  },
  {
    num: '02',
    title: 'Exception handling UX in the relay TMS',
    outcome: null,
    client: 'NFI Industries',
    year: '2021',
    slug: 'nfi-relay-exception-handling',
    disciplines: ['ux', 'frontend'],
  },
  {
    num: '03',
    title: 'Wine tasting structured learning app',
    outcome: null,
    client: 'Palate Collectif',
    year: '2020',
    slug: 'wine-tasting-app',
    disciplines: ['ux', 'frontend'],
  },
  {
    num: '04',
    title: 'Chicago Sports live dashboard',
    outcome: null,
    client: 'Side project',
    year: '2024',
    slug: 'chicago-sports-dashboard',
    disciplines: ['frontend', 'data-viz'],
  },
  {
    num: '05',
    title: 'Portfolio redesign',
    outcome: null,
    client: 'Personal',
    year: '2024',
    slug: 'portfolio-redesign',
    disciplines: ['ux', 'design-systems', 'frontend'],
  },
];

const filters: { id: Discipline; label: string }[] = [
  { id: 'all',            label: 'All' },
  { id: 'ux',             label: 'UX' },
  { id: 'design-systems', label: 'Design systems' },
  { id: 'frontend',       label: 'Frontend' },
  { id: 'data-viz',       label: 'Data viz' },
];

export function WorkIndex() {
  const [active, setActive] = useState<Discipline>('all');
  const [hovered, setHovered] = useState<number | null>(null);

  const rowOpacity = (item: WorkItem, idx: number): number => {
    const matches = active === 'all' || item.disciplines.includes(active);
    if (!matches) return 0.22;
    if (hovered !== null && hovered !== idx) return 0.6;
    return 1;
  };

  const rowShift = (idx: number): string =>
    hovered === idx ? 'translateX(12px)' : 'translateX(0)';

  return (
    <section id="work" className="pt-20 pb-16">
      <div className="col">

        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-3">
          <Reveal delay={0}>
            <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-2">
              Selected work
            </p>
            <h2 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.01em] text-ink">
              Projects
            </h2>
          </Reveal>

          {/* Discipline filters */}
          <div className="flex flex-wrap gap-2 pb-1">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                aria-pressed={active === id}
                className={`px-3 py-1.5 text-[12px] font-mono rounded-[2px] border transition-colors duration-150 min-h-[44px] min-w-[44px] ${
                  active === id
                    ? 'bg-ink text-bone-50 border-ink'
                    : 'bg-transparent text-ink/60 border-ink/20 hover:border-ink/40'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Ruled work rows */}
        <div className="border-t-[1.5px] border-ink">
          {workItems.map((item, idx) => (
            <Link
              key={item.num}
              href={`/case-studies/${item.slug}`}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(idx)}
              onBlur={() => setHovered(null)}
              className="group flex items-baseline gap-4 py-5 border-b border-black/10 no-underline"
              style={{
                opacity: rowOpacity(item, idx),
                transform: rowShift(idx),
                transition: 'opacity 240ms, transform 240ms var(--ease-site)',
              }}
            >
              {/* Number */}
              <span className="font-mono text-[12px] text-ink/40 shrink-0 w-6">{item.num}</span>

              {/* Title + outcome */}
              <span className="flex-1 min-w-0">
                <span className="text-[18px] font-bold text-ink leading-snug block">
                  {item.title}
                </span>
                {item.outcome && (
                  <span className="font-mono text-[12px] text-brass mt-0.5 block">
                    {item.outcome}
                  </span>
                )}
              </span>

              {/* Client */}
              <span className="hidden sm:block text-[13px] text-ink/50 shrink-0">{item.client}</span>

              {/* Year + arrow */}
              <span className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[12px] text-ink/40">{item.year}</span>
                <span
                  className="font-mono text-[14px] text-brass"
                  style={{
                    opacity: hovered === idx ? 1 : 0,
                    translate: hovered === idx ? '0px' : '-6px',
                    transition: 'opacity 240ms var(--ease-site), translate 240ms var(--ease-site)',
                  }}
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
