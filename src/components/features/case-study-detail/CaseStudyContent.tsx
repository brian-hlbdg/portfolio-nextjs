'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ReadingProgress } from './ReadingProgress';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { DecisionLog } from './DecisionLog';
import { Footer } from '@/components/layout/Footer';
import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

const sections = [
  { id: 'problem',  label: '01  Problem' },
  { id: 'research', label: '02  Research' },
  { id: 'approach', label: '03  Approach' },
  { id: 'outcome',  label: '04  Outcome' },
];

interface Props {
  data: CaseStudyDetailData;
  nextSlug: string;
  nextData: CaseStudyDetailData;
}

export function CaseStudyContent({ data, nextSlug, nextData }: Props) {
  const [activeSection, setActiveSection] = useState('problem');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const decisions = data.reflections.challenges.slice(0, 3).map(c => ({
    title: c.title,
    cost: c.description,
  }));

  const stats = data.results.metrics.slice(0, 3);

  return (
    <div className="bg-ink-950 text-white min-h-screen">
      <ReadingProgress />

      {/* Hero */}
      <div className="col pt-16 pb-12">
        <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-6">
          Case study · {data.hero.client} · {data.hero.timeline}
        </p>

        <h1
          className="font-sans font-black leading-[1.02] tracking-[-0.02em] text-white mb-6 max-w-[760px]"
          style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
        >
          {data.hero.title}
        </h1>

        <p className="text-[17px] leading-[1.6] text-white/60 max-w-[600px] mb-10">
          {data.tldr.scope}
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 min-[560px]:grid-cols-3 gap-4 mb-10">
          {stats.map(m => (
            <div key={m.label} className="bg-white/[0.04] border border-white/10 rounded-[4px] p-5">
              <div className="font-mono text-[28px] font-bold text-brass leading-none mb-1">{m.value}</div>
              <div className="text-[12px] text-white/50 leading-snug">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Role strip */}
        <div className="flex flex-wrap gap-6 border-t border-white/10 pt-6">
          {[
            { label: 'Role',     value: data.hero.role },
            { label: 'Team',     value: data.teamComposition?.size ?? '—' },
            { label: 'Timeline', value: data.hero.timeline },
            { label: 'Stack',    value: data.hero.technologies.slice(0, 3).join(' · ') },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="font-mono text-[10px] tracking-[0.1em] text-white/40 uppercase mb-1">{label}</div>
              <div className="text-[14px] font-medium text-white/80">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body with sticky rail */}
      <div className="col pb-20">
        <div className="flex gap-12 min-[900px]:gap-16">

          {/* Sticky rail — desktop only */}
          <aside className="hidden min-[900px]:flex flex-col gap-1 w-44 shrink-0 pt-2">
            <div className="sticky top-[80px]">
              <p className="font-mono text-[10px] tracking-[0.1em] text-white/30 uppercase mb-4">Contents</p>
              {sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`block font-mono text-[12px] py-1.5 transition-colors duration-150 ${
                    activeSection === id ? 'text-brass' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          </aside>

          {/* Article body */}
          <article className="flex-1 min-w-0 space-y-20">

            {/* 01 Problem */}
            <section id="problem" className="scroll-mt-20">
              <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-3">01 — Problem</p>
              <h2 className="text-[28px] font-bold text-white mb-4">{data.overview.challenge.title}</h2>
              <p className="text-[16px] leading-[1.7] text-white/65 mb-6">{data.overview.challenge.description}</p>
              <ul className="space-y-2.5">
                {data.overview.challenge.problems.map((p, i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-white/60 leading-snug">
                    <span className="text-brass mt-0.5 shrink-0" aria-hidden="true">—</span>
                    {p}
                  </li>
                ))}
              </ul>
            </section>

            {/* 02 Research */}
            <section id="research" className="scroll-mt-20">
              <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-3">02 — Research</p>
              {data.research.sections.slice(0, 2).map((s, i) => (
                <div key={i} className="mb-8">
                  <h3 className="text-[20px] font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-[16px] leading-[1.7] text-white/65">{s.content}</p>
                  {s.subsections && (
                    <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-4 mt-5">
                      {s.subsections.map((sub, j) => (
                        <div key={j} className="bg-white/[0.04] border border-white/10 rounded-[4px] p-5">
                          <h4 className="text-[14px] font-semibold text-white mb-2">{sub.title}</h4>
                          <p className="text-[13px] text-white/55 leading-[1.6]">{sub.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* 03 Approach */}
            <section id="approach" className="scroll-mt-20">
              <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-3">03 — Approach</p>
              <p className="text-[16px] leading-[1.7] text-white/65 mb-8">{data.designProcess.description}</p>
              <ol className="space-y-6 mb-10">
                {data.designProcess.steps.map(step => (
                  <li key={step.number} className="flex gap-5">
                    <span className="font-mono text-[12px] text-brass/60 w-6 shrink-0 pt-1">
                      {String(step.number).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="text-[16px] font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-[15px] text-white/60 leading-[1.65]">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {data.solution.beforeAfter?.beforeImage && data.solution.beforeAfter?.afterImage && (
                <div className="mt-8">
                  <p className="font-mono text-[11px] tracking-[0.1em] text-white/40 uppercase mb-4">Before / After</p>
                  <BeforeAfterSlider
                    beforeImage={data.solution.beforeAfter.beforeImage}
                    afterImage={data.solution.beforeAfter.afterImage}
                    beforeLabel={data.solution.beforeAfter.beforeLabel}
                    afterLabel={data.solution.beforeAfter.afterLabel}
                  />
                </div>
              )}
            </section>

            {/* 04 Outcome */}
            <section id="outcome" className="scroll-mt-20">
              <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-3">04 — Outcome</p>
              <p className="text-[16px] leading-[1.7] text-white/65 mb-8">{data.results.description}</p>

              <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-4 mb-10">
                {data.results.metrics.slice(0, 4).map(m => (
                  <div key={m.label} className="bg-white/[0.04] border border-white/10 rounded-[4px] p-5">
                    <div className="font-mono text-[24px] font-bold text-brass mb-1">{m.value}</div>
                    <div className="text-[13px] font-medium text-white mb-1">{m.label}</div>
                    <div className="text-[12px] text-white/45">{m.description}</div>
                  </div>
                ))}
              </div>

              {decisions.length > 0 && (
                <div>
                  <p className="font-mono text-[11px] tracking-[0.1em] text-white/40 uppercase mb-4">Decision log</p>
                  <DecisionLog decisions={decisions} />
                </div>
              )}
            </section>

            {/* Next study */}
            <div className="pt-4 border-t border-white/10">
              <Link href={`/case-studies/${nextSlug}`} className="inline-flex items-center gap-3 group">
                <span className="text-[14px] font-mono text-white/40 group-hover:text-white/60 transition-colors">
                  Next case study
                </span>
                <span className="text-[18px] text-brass group-hover:translate-x-1 transition-transform duration-200">→</span>
                <span className="text-[16px] font-semibold text-white">{nextData.hero.title}</span>
              </Link>
            </div>

          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
