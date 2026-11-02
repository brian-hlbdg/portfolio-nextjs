'use client';

import { useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';

interface Chapter {
  id: string;
  years: string;
  title: string;
  company: string;
  body: string;
  tags: string[];
}

const chapters: Chapter[] = [
  {
    id: 'ahead',
    years: '2026 – now',
    title: 'Senior Software Engineer',
    company: 'AHEAD',
    body: 'Building enterprise IT lifecycle management tools in Elixir and Phoenix LiveView. Full-stack ownership from architecture through production — the same research-first approach applied to backend system design.',
    tags: ['Elixir', 'Phoenix LiveView', 'PostgreSQL', 'TypeScript', 'React'],
  },
  {
    id: 'nfi',
    years: '2017 – 25',
    title: 'UX Lead & Design Systems',
    company: 'NFI Industries',
    body: 'Led user research, information architecture, and component system design for a national logistics platform. Delivered a TMS redesign that cut end-user operational workload by 50% across coordinators nationwide.',
    tags: ['UX research', 'Design systems', 'Figma', 'React', 'Elixir'],
  },
  {
    id: 'calamos',
    years: '2015 – 17',
    title: 'Frontend Engineer',
    company: 'Calamos Investments',
    body: 'Built interactive financial data visualizations and a corporate website serving institutional investors. Heavy focus on performance, data-dense UI, and accessibility for complex financial products.',
    tags: ['JavaScript', 'D3.js', 'CSS', 'CMS integration'],
  },
  {
    id: 'early',
    years: '2010 – 14',
    title: 'Web Designer',
    company: 'PMall · GKIC',
    body: 'Designed and developed membership and e-commerce experiences for direct-marketing clients. First exposure to conversion optimization, A/B testing, and designing under hard revenue constraints.',
    tags: ['HTML/CSS', 'jQuery', 'Email campaigns', 'Photoshop'],
  },
];

export function ExperienceChapters() {
  const [activeId, setActiveId] = useState('ahead');
  const active = chapters.find(c => c.id === activeId) ?? chapters[0];

  return (
    <section id="experience" className="bg-bone-100 py-20">
      <div className="col">

        <Reveal delay={0}>
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-2">
            Experience
          </p>
          <h2 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.01em] text-ink mb-10">
            Fifteen years, four chapters.
          </h2>
        </Reveal>

        <div className="flex flex-col min-[760px]:flex-row gap-8 min-[760px]:gap-12">

          {/* Era list */}
          <div className="flex flex-col gap-1 min-[760px]:w-56 shrink-0">
            {chapters.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveId(ch.id)}
                className={`text-left px-3 py-3 rounded-[2px] transition-colors duration-150 flex items-center gap-3 min-h-[44px] ${
                  ch.id === activeId
                    ? 'bg-bone-50'
                    : 'hover:bg-bone-50/50'
                }`}
              >
                <span
                  className={`shrink-0 w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
                    ch.id === activeId ? 'bg-brass' : 'bg-transparent border border-ink/20'
                  }`}
                  aria-hidden="true"
                />
                <span>
                  <span className="font-mono text-[11px] text-ink/50 block">{ch.years}</span>
                  <span className={`text-[14px] font-semibold leading-tight block mt-0.5 ${
                    ch.id === activeId ? 'text-ink' : 'text-ink/60'
                  }`}>
                    {ch.title}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 bg-bone-50 rounded-[4px] p-7 min-[760px]:p-9">
            <p className="font-mono text-[11px] tracking-[0.08em] text-brass uppercase mb-1">
              {active.company}
            </p>
            <h3 className="text-[22px] font-bold text-ink mb-4">{active.title}</h3>
            <p className="text-[16px] leading-[1.65] text-ink/75 mb-6">{active.body}</p>
            <div className="flex flex-wrap gap-2">
              {active.tags.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[11px] text-ink/50 px-2.5 py-1 border border-ink/15 rounded-[2px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
