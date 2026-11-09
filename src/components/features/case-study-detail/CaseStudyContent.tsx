'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ReadingProgress } from './ReadingProgress';
import { StageRail } from './StageRail';
import { CountingMetric } from './CountingMetric';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { DecisionForks } from './DecisionForks';
import { DecisionLog } from './DecisionLog';
import { Footer } from '@/components/layout/Footer';
import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

const stages = [
  { id: 'problem',  label: 'Problem'  },
  { id: 'research', label: 'Research' },
  { id: 'approach', label: 'Approach' },
  { id: 'outcome',  label: 'Outcome'  },
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
      { rootMargin: '-15% 0px -70% 0px' }
    );
    stages.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const legacyDecisions = data.reflections.challenges.slice(0, 3).map(c => ({
    title: c.title,
    cost: c.description,
  }));

  return (
    <div className="bg-ink-950 text-white min-h-screen">
      <ReadingProgress />
      <StageRail stages={stages} activeId={activeSection} />

      {/* Hero */}
      <div className="col pt-14 pb-12">
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

        {/* Stat cards with counting animation */}
        <div className="grid grid-cols-1 min-[560px]:grid-cols-3 gap-4 mb-10">
          {data.results.metrics.slice(0, 3).map(m => (
            <CountingMetric
              key={m.label}
              value={m.value}
              label={m.label}
              description={m.description}
            />
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

      {/* Article body */}
      <div className="col pb-20">
        <article className="max-w-[720px] space-y-20">

          {/* 01 Problem */}
          <section id="problem" className="scroll-mt-28">
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
          <section id="research" className="scroll-mt-28">
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
          <section id="approach" className="scroll-mt-28">
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
          <section id="outcome" className="scroll-mt-28">
            <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-3">04 — Outcome</p>
            <p className="text-[16px] leading-[1.7] text-white/65 mb-8">{data.results.description}</p>

            {/* Counting metrics */}
            <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-4 mb-12">
              {data.results.metrics.slice(0, 4).map(m => (
                <CountingMetric
                  key={m.label}
                  value={m.value}
                  label={m.label}
                  description={m.description}
                />
              ))}
            </div>

            {/* Decision forks or legacy accordion */}
            {(data.decisions?.length ?? 0) > 0 ? (
              <div>
                <p className="font-mono text-[11px] tracking-[0.1em] text-white/40 uppercase mb-4">
                  Key decisions
                </p>
                <DecisionForks forks={data.decisions!} />
              </div>
            ) : legacyDecisions.length > 0 ? (
              <div>
                <p className="font-mono text-[11px] tracking-[0.1em] text-white/40 uppercase mb-4">
                  Decision log
                </p>
                <DecisionLog decisions={legacyDecisions} />
              </div>
            ) : null}
          </section>

          {/* Next study */}
          <div className="pt-4 border-t border-white/10">
            <Link href={`/case-studies/${nextSlug}`} className="group flex items-center gap-3">
              <span className="text-[14px] font-mono text-white/40 group-hover:text-white/60 transition-colors">
                Next case study
              </span>
              <span className="text-[18px] text-brass group-hover:translate-x-1 transition-transform duration-200">→</span>
              <span className="text-[16px] font-semibold text-white">{nextData.hero.title}</span>
            </Link>
          </div>

        </article>
      </div>

      <Footer />
    </div>
  );
}
