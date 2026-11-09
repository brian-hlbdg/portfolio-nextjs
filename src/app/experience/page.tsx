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
    description: 'Building enterprise IT lifecycle management tools in Elixir and Phoenix LiveView. Full-stack ownership from architecture through production — the same research-first approach applied to backend system design.',
    contributions: [
      'Architecting LiveView-based interfaces for asset lifecycle workflows used across enterprise IT teams',
      'Applying contextual inquiry and task analysis to inform data model and UI decisions before implementation begins',
      'Contributing to shared component patterns and engineering standards across the product',
    ],
    tags: ['Elixir', 'Phoenix LiveView', 'PostgreSQL', 'TypeScript', 'React'],
  },
  {
    company: 'NFI Industries',
    period: '2017 – 2025',
    role: 'UX Lead & Design Systems',
    description: 'Led user research, information architecture, and component system design for a national logistics platform serving 120+ coordinators. Eight years, two major platform generations.',
    contributions: [
      'Led the UX redesign of the Transportation Management System — reduced end-user operational workload by 50% across coordinators nationwide',
      'Built a LiveView + Tailwind component library from scratch; became the shared foundation for all TMS modules',
      'Ran contextual inquiry sessions, cognitive task analysis, and usability tests that directly shaped feature priorities',
      'Championed inclusive design and accessibility standards across engineering and product teams',
      'Mentored engineers on design thinking and established shared critique practices across the team',
    ],
    tags: ['UX Research', 'Design Systems', 'Figma', 'Elixir', 'Phoenix LiveView', 'Tailwind CSS', 'Accessibility'],
  },
  {
    company: 'Calamos Investments',
    period: '2015 – 2017',
    role: 'Web Developer',
    description: 'Sole web developer for a global investment management firm. Rebuilt the corporate site and built interactive data visualization tools for client-facing financial reporting.',
    contributions: [
      'Redesigned the main corporate website — 35% improvement in user engagement, 28% reduction in bounce rate',
      'Built an interactive financial dashboard making complex investment data accessible to clients',
      'Developed custom Sitecore CMS templates, reducing content update time by 60%',
      'Executed marketing microsites and campaign landing pages with strong conversion metrics',
    ],
    tags: ['Web Development', 'Sitecore CMS', 'JavaScript', 'Data Visualization', 'Bootstrap'],
  },
  {
    company: 'GKIC · PMall',
    period: '2010 – 2014',
    role: 'Web Designer & UX',
    description: 'Two e-commerce and marketing organizations in sequence. At PMall (a top-500 e-commerce retailer) redesigned the product customization interface. At GKIC built and maintained the web presence through a period of rapid digital expansion.',
    contributions: [
      'Redesigned PMall product customization interface — 22% increase in completed orders',
      'Conducted user interviews and usability tests that directly informed UX improvements',
      'Created three new GKIC websites and redesigned four heavily utilized existing properties',
      'Designed high-converting landing pages contributing to 25% increase in lead generation',
    ],
    tags: ['UI Design', 'User Research', 'E-commerce', 'WordPress', 'HTML/CSS', 'Usability Testing'],
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
            Fifteen years, four chapters.
          </h1>
          <p className="text-[17px] leading-[1.6] text-ink/60 max-w-[560px]">
            From contextual inquiry and cognitive task analysis to production Elixir and React — with no handoff chain in between.
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
