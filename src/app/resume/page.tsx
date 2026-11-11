export const metadata = {
  title: 'Resume — Brian Hall',
  robots: { index: false },
};

export default function ResumePage() {
  return (
    <>
      <style>{`
        @media print {
          header, nav { display: none !important; }
          main { padding-top: 0 !important; }
          body { background: white !important; }
          .no-print { display: none !important; }
          .page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
          @page { margin: 0.65in 0.75in; size: letter; }
        }
        @media screen {
          .page { max-width: 760px; margin: 2rem auto 4rem; background: white; box-shadow: 0 1px 4px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.05); border-radius: 4px; padding: 3rem 3.5rem; }
        }
      `}</style>

      {/* Print bar — hidden when printing */}
      <div className="no-print bg-ink-950 text-white/70 text-[12px] font-mono py-3 px-6 flex items-center justify-between sticky top-[60px] z-10">
        <span>Resume · Brian Hall</span>
        <button
          onClick={() => window.print()}
          className="bg-white/10 hover:bg-white/20 transition-colors text-white px-4 py-1.5 rounded-[3px] text-[11px] tracking-[0.05em] cursor-pointer"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="page font-sans text-[#111]">

        {/* ── Header ── */}
        <div style={{ marginBottom: '1.6rem', paddingBottom: '1.2rem', borderBottom: '2px solid #111' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '0.3rem' }}>
            Brian Hall
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '0.65rem' }}>
            UI Engineering Lead · UX Research · Design Systems · Chicago
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem 1.4rem', fontSize: '0.78rem', fontFamily: 'var(--font-ibm-mono, monospace)', color: '#444' }}>
            <span>your@email.com</span>
            <span>312-xxx-xxxx</span>
            <a href="https://www.linkedin.com/in/hlbdg/" style={{ color: '#444', textDecoration: 'none' }}>linkedin.com/in/hlbdg</a>
            <a href="https://hlbdesigngroup.com" style={{ color: '#444', textDecoration: 'none' }}>hlbdesigngroup.com</a>
          </div>
        </div>

        {/* ── Summary ── */}
        <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#333', marginBottom: '1.8rem', maxWidth: '65ch' }}>
          Twenty years of frontend engineering, UX research, and design systems across enterprise, logistics, and financial services. M.S. in Human-Computer Interaction. Own features end-to-end — from data model and user research through React/TypeScript UI and production release.
        </p>

        {/* ── Experience ── */}
        <Section title="Experience">

          <Role
            company="AHEAD"
            title="Senior Software Engineer"
            period="2026 – present"
            description="Building enterprise IT lifecycle management tools for one of the largest IT solutions providers in the country. Full-stack ownership from schema design through client-facing UI."
            bullets={[
              'Owned full feature delivery end-to-end — data model design, API layer, React/TypeScript UI, test coverage, and production release — with direct accountability at every stage',
              'Shipped a client-facing capability matrix used by every enterprise customer on the platform, built from a shared read model so the display layer owns no queries',
              'Navigated structured code review cycles with architectural feedback on schema design, security model, and query structure',
              'Applied contextual inquiry and task analysis to backend data model decisions before writing code, reducing structural rework during review',
            ]}
            tags={['React', 'TypeScript', 'Elixir', 'Phoenix LiveView', 'PostgreSQL']}
          />

          <Role
            company="NFI Industries"
            title="UI Engineering Lead & Design Systems"
            period="2017 – 2025"
            description="Led frontend engineering, UX, and design systems for a national logistics platform serving 120+ daily users. Eight years across two major platform generations."
            bullets={[
              'Led end-to-end feature development for the Transportation Management System — owned the full cycle from brief and user research through UI architecture and production frontend implementation, cutting operational workload by 50%',
              'Architected a component library in LiveView and Tailwind from scratch; became the shared frontend foundation for all TMS modules and the cross-team standard for new feature development',
              'Mentored engineers on component architecture, design system standards, and accessibility — built shared critique and code review processes that improved implementation consistency across a distributed team',
              'Facilitated 20+ event storming workshops with engineering, product, and operations stakeholders, aligning on complex workflow requirements before implementation began',
              'Championed WCAG accessibility standards across all production interfaces; introduced inclusive design practices into the development pipeline',
            ]}
            tags={['React', 'TypeScript', 'Phoenix LiveView', 'Tailwind CSS', 'Design Systems', 'Figma', 'Accessibility']}
          />

          <Role
            company="Calamos Investments"
            title="Web Developer — Financial Services"
            period="2015 – 2017"
            description="Sole web developer for a global investment management firm. Built client-facing investment data tools and enterprise content infrastructure in a regulated financial environment."
            bullets={[
              'Engineered an interactive financial dashboard surfacing complex investment portfolio data for high-net-worth clients and institutional investors',
              'Rebuilt the corporate website for a registered investment advisor, improving user engagement 35% and reducing bounce rate 28% under compliance review cycles',
              'Developed custom Sitecore CMS templates, reducing content operations time by 60% across editorial and marketing teams',
            ]}
            tags={['JavaScript', 'Data Visualization', 'Sitecore CMS', 'Financial Services', 'Bootstrap']}
          />

          <Role
            company="GKIC · PMall"
            title="Web Designer & UX"
            period="2010 – 2014"
            description="Two e-commerce and marketing organizations in sequence. At PMall redesigned the product customization interface. At GKIC built and maintained the web presence through rapid digital expansion."
            bullets={[
              'Redesigned PMall product customization interface — 22% increase in completed orders driven by user research',
              'Conducted user interviews and usability tests that directly shaped UX improvements across the product',
              'Created three new GKIC websites and redesigned four heavily utilized existing properties',
            ]}
            tags={['UI Design', 'JavaScript', 'User Research', 'E-commerce', 'HTML/CSS']}
            last
          />

        </Section>

        {/* ── Skills ── */}
        <Section title="Skills">
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0.45rem 1rem', fontSize: '0.82rem' }}>
            <SkillRow label="Frontend" value="React, TypeScript, Next.js, Phoenix LiveView, Tailwind CSS, HTML/CSS" />
            <SkillRow label="Backend" value="Elixir, Node.js, PostgreSQL" />
            <SkillRow label="Design" value="Figma, Design Systems, Component Architecture, Information Architecture" />
            <SkillRow label="Research" value="Contextual Inquiry, Usability Testing, Task Analysis, Event Storming" />
            <SkillRow label="Other" value="Accessibility (WCAG), CI/CD, Agile, Git" />
          </div>
        </Section>

        {/* ── Education ── */}
        <Section title="Education">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <EduRow degree="M.S. Human-Computer Interaction" school="DePaul University" year="2018" note="Thesis: information architecture patterns in enterprise logistics software" />
            <EduRow degree="B.S. Communication & Media Studies" school="Governors State University" year="2005" />
          </div>
        </Section>

        {/* ── Earlier Career ── */}
        <Section title="Earlier Career" last>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#555' }}>
            <EarlierRow company="Premier Data Services (PDS)" role="Manager of Web Services" period="2009–2010" />
            <EarlierRow company="Marist School" role="Photography & Web Content Manager" period="2007–2008" />
            <EarlierRow company="Magnest Street" role="Graphic Designer → Asst. Director of Technical Design" period="2005–2007" />
          </div>
        </Section>

      </div>
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────── */

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : '1.8rem' }}>
      <h2 style={{
        fontSize: '0.65rem',
        fontFamily: 'var(--font-ibm-mono, monospace)',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#888',
        marginBottom: '0.75rem',
        paddingBottom: '0.4rem',
        borderBottom: '1px solid #E5E5E5',
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Role({
  company, title, period, description, bullets, tags, last
}: {
  company: string;
  title: string;
  period: string;
  description: string;
  bullets: string[];
  tags: string[];
  last?: boolean;
}) {
  return (
    <div style={{ marginBottom: last ? 0 : '1.5rem', paddingBottom: last ? 0 : '1.5rem', borderBottom: last ? 'none' : '1px solid #F0F0F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem', flexWrap: 'wrap', gap: '0.25rem' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{company}</span>
          <span style={{ color: '#888', margin: '0 0.4rem', fontSize: '0.85rem' }}>·</span>
          <span style={{ fontSize: '0.88rem', color: '#333' }}>{title}</span>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-ibm-mono, monospace)', color: '#888', whiteSpace: 'nowrap' }}>{period}</span>
      </div>
      <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.5, marginBottom: '0.6rem', maxWidth: '68ch' }}>{description}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', color: '#333', lineHeight: 1.5 }}>
            <span style={{ color: '#AAA', flexShrink: 0, marginTop: '0.05rem' }}>–</span>
            {b}
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontSize: '0.68rem',
            fontFamily: 'var(--font-ibm-mono, monospace)',
            color: '#666',
            border: '1px solid #DDD',
            borderRadius: '2px',
            padding: '0.1rem 0.4rem',
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function SkillRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span style={{ fontFamily: 'var(--font-ibm-mono, monospace)', color: '#888', fontSize: '0.75rem', paddingTop: '0.1rem' }}>{label}</span>
      <span style={{ color: '#222', lineHeight: 1.5 }}>{value}</span>
    </>
  );
}

function EduRow({ degree, school, year, note }: { degree: string; school: string; year: string; note?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
      <div>
        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{degree}</span>
        <span style={{ color: '#888', margin: '0 0.4rem', fontSize: '0.82rem' }}>·</span>
        <span style={{ fontSize: '0.82rem', color: '#555' }}>{school}</span>
        {note && <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.1rem' }}>{note}</p>}
      </div>
      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-ibm-mono, monospace)', color: '#888' }}>{year}</span>
    </div>
  );
}

function EarlierRow({ company, role, period }: { company: string; role: string; period: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
      <div>
        <span style={{ fontWeight: 600 }}>{company}</span>
        <span style={{ color: '#AAA', margin: '0 0.4rem' }}>·</span>
        <span>{role}</span>
      </div>
      <span style={{ fontFamily: 'var(--font-ibm-mono, monospace)', color: '#AAA', fontSize: '0.75rem' }}>{period}</span>
    </div>
  );
}
