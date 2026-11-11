import { Footer } from '@/components/layout/Footer';
import { earlierCareersData } from '@/data/earlierCareers';

export const metadata = {
  title: 'Experience — Brian Hall',
  description: 'Fifteen years of UX research, design systems, and full-stack engineering across logistics, finance, and enterprise software.',
};

const roles = [
  {
    company: 'AHEAD',
    period: '2026 – now',
    role: 'Senior Software Engineer',
    description: 'Building enterprise IT lifecycle management tools for one of the largest IT solutions providers in the country. Full-stack ownership from schema design through client-facing UI — end-to-end, with no handoff chain between research, design, and implementation.',
    contributions: [
      'Owned full feature delivery end-to-end — data model design, API layer, LiveView and React UI, test coverage, and production release — with direct accountability at every stage',
      'Navigated structured code review cycles with architectural feedback on schema design, security model, and query structure; each round reshaped the implementation rather than just the surface',
      'Designed and shipped a client-facing capability matrix used by every enterprise customer on the platform, built from a shared read model so the display layer owns no queries',
      'Applied contextual inquiry and task analysis to backend data model decisions before writing code, reducing structural rework during review',
      'Contributed to shared component patterns, engineering standards, and cross-team documentation',
    ],
    tags: ['React', 'TypeScript', 'Elixir', 'Phoenix LiveView', 'PostgreSQL', 'End-to-End Ownership'],
  },
  {
    company: 'NFI Industries',
    period: '2017 – 2025',
    role: 'UI Engineering Lead & Design Systems',
    description: 'Led frontend engineering, UX, and design systems for a national logistics platform serving 120+ daily users across operations centers nationwide. Eight years of end-to-end ownership across two major platform generations — from initial user research through component architecture, frontend code, and production release.',
    contributions: [
      'Led end-to-end feature development for the Transportation Management System — owned the full cycle from brief and user research through UI architecture and production frontend implementation, cutting operational workload by 50% for coordinators',
      'Architected a component library in LiveView and Tailwind from scratch; became the shared frontend foundation for all TMS modules and the cross-team standard for new feature development',
      'Mentored engineers on component architecture, design system standards, and accessibility practices — built shared critique and code review processes that improved implementation consistency across a distributed team',
      'Facilitated 20+ event storming workshops with engineering, product, and operations stakeholders, aligning on complex workflow requirements before a line of code was written',
      'Championed WCAG accessibility standards across all production interfaces; introduced inclusive design practices into the development pipeline and engineering review process',
    ],
    tags: ['React', 'TypeScript', 'Design Systems', 'Component Architecture', 'Elixir', 'Phoenix LiveView', 'Tailwind CSS', 'Accessibility', 'Team Leadership'],
  },
  {
    company: 'Calamos Investments',
    period: '2015 – 2017',
    role: 'Web Developer — Financial Services',
    description: 'Sole web developer for a global investment management firm operating in a regulated financial environment. Built client-facing investment data tools and enterprise content infrastructure under strict compliance and brand governance requirements.',
    contributions: [
      'Engineered an interactive financial dashboard surfacing complex investment portfolio data for high-net-worth clients and institutional investors — translating dense financial data into a navigable, accessible UI',
      'Rebuilt the corporate website for a registered investment advisor, improving user engagement 35% and reducing bounce rate 28% while meeting compliance and legal review cycles',
      'Developed custom Sitecore CMS templates in a regulated content environment, reducing content operations time by 60% across editorial and marketing teams',
      'Executed campaign microsites and conversion-focused landing pages under compliance review, contributing measurably to lead generation goals',
    ],
    tags: ['Financial Services UI', 'JavaScript', 'Data Visualization', 'Sitecore CMS', 'Regulated Environment', 'Bootstrap'],
  },
  {
    company: 'GKIC · PMall',
    period: '2010 – 2014',
    role: 'Web Designer & UX',
    description: 'Two e-commerce and marketing organizations in sequence. At PMall (a top-500 e-commerce retailer) redesigned the product customization interface. At GKIC built and maintained the web presence through a period of rapid digital expansion.',
    contributions: [
      'Redesigned PMall product customization interface — 22% increase in completed orders driven by user research findings',
      'Conducted user interviews and usability tests that directly shaped UX improvements across the product',
      'Created three new GKIC websites and redesigned four heavily utilized existing properties',
      'Designed high-converting landing pages contributing to 25% increase in lead generation',
    ],
    tags: ['UI Design', 'User Research', 'E-commerce', 'JavaScript', 'HTML/CSS', 'Usability Testing'],
  },
];

const education = [
  {
    degree: 'M.S. Human-Computer Interaction',
    school: 'DePaul University',
    year: '2018',
    notes: 'Thesis on information architecture patterns in enterprise logistics software.',
  },
  {
    degree: 'B.S. Communication & Media Studies',
    school: 'Governors State University',
    year: '2005',
    notes: null,
  },
];

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-bone-50">
      <div className="col">

        {/* Page heading */}
        <div className="pt-12 pb-10 border-b border-black/[0.08]">
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-3">Experience</p>
          <h1 className="text-[40px] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink mb-4">
            Twenty years. Full-stack, end-to-end.
          </h1>
          <p className="text-[17px] leading-[1.6] text-ink/60 max-w-[560px]">
            React and TypeScript in production, component systems at enterprise scale, and a research background that shapes architecture decisions before the first line of code — with no handoff chain in between.
          </p>
        </div>

        {/* Main roles */}
        <div className="divide-y divide-black/[0.07]">
          {roles.map((r, i) => (
            <div key={i} className="py-12 grid grid-cols-1 min-[760px]:grid-cols-[200px_1fr] gap-6 min-[760px]:gap-12">

              {/* Left: period + company */}
              <div className="min-[760px]:pt-1">
                <p className="font-mono text-[11px] tracking-[0.08em] text-ink/40 mb-1">{r.period}</p>
                <p className="text-[15px] font-bold text-ink">{r.company}</p>
              </div>

              {/* Right: detail */}
              <div>
                <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ink mb-3">{r.role}</h2>
                <p className="text-[15px] leading-[1.7] text-ink/65 mb-6 max-w-[580px]">{r.description}</p>

                <ul className="space-y-3 mb-6">
                  {r.contributions.map((c, j) => (
                    <li key={j} className="flex gap-3 text-[14px] text-ink/65 leading-snug">
                      <span className="text-brass mt-0.5 shrink-0 font-mono text-[13px]" aria-hidden="true">—</span>
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {r.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] text-ink/50 border border-ink/15 rounded-[2px] px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Earlier career */}
        <div className="border-t-[1.5px] border-ink pt-10 pb-12 mt-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-6">Earlier career</p>
          <div className="divide-y divide-black/[0.06]">
            {earlierCareersData.map((e, i) => (
              <div key={i} className="py-5 flex flex-col min-[560px]:flex-row min-[560px]:items-baseline gap-1 min-[560px]:gap-8">
                <span className="font-mono text-[11px] text-ink/35 w-24 shrink-0">{e.period}</span>
                <div className="flex-1">
                  <span className="text-[14px] font-semibold text-ink">{e.company}</span>
                  <span className="text-ink/40 mx-2">·</span>
                  <span className="text-[14px] text-ink/60">{e.role}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 min-[560px]:justify-end">
                  {e.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="font-mono text-[10px] text-ink/40 border border-ink/10 rounded-[2px] px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="border-t border-black/[0.08] pt-10 pb-16">
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-6">Education</p>
          <div className="flex flex-col gap-6">
            {education.map((e, i) => (
              <div key={i} className="flex flex-col min-[560px]:flex-row min-[560px]:items-baseline gap-1 min-[560px]:gap-8">
                <span className="font-mono text-[11px] text-ink/35 w-24 shrink-0">{e.year}</span>
                <div>
                  <p className="text-[15px] font-bold text-ink">{e.degree}</p>
                  <p className="text-[14px] text-ink/55">{e.school}</p>
                  {e.notes && (
                    <p className="text-[13px] text-ink/40 mt-1 leading-snug">{e.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
