import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'About — Brian Hall',
  description: 'Chicago-based engineer and designer. Fifteen years closing the gap between understanding a problem and shipping the answer.',
};

const workingStyle = [
  {
    label: 'Research first',
    note: "I don't start with a solution. I start with what people are actually trying to do — contextual inquiry, task analysis, stakeholder sessions before a line of code.",
  },
  {
    label: 'Own the full cycle',
    note: 'From the first conversation about requirements through production deployment. No handoffs means no translation loss.',
  },
  {
    label: 'AI-augmented daily',
    note: 'Claude Code, Cursor, Copilot — not as novelty but as a genuine shift in how I allocate thinking. More architecture, less rote implementation.',
  },
  {
    label: 'Write for the next person',
    note: "Code, docs, design decisions. If it isn't captured, it only exists in someone's head — and that person might leave.",
  },
  {
    label: 'Critique as practice',
    note: "The best teams I've worked on had honest design reviews. I bring that discipline to engineering work too.",
  },
  {
    label: 'Direct communication',
    note: "Midwest-practical. I'll tell you what I think and I want you to do the same. The best outcomes come from that.",
  },
];

const passions = [
  {
    label: 'Street photography',
    description: "Chicago's architecture, neighborhoods, and the moments between moments. I shoot mostly on streets, in stations, and from rooftops.",
    image: '/images/passions/photography.jpg',
  },
  {
    label: 'Drone & aerial',
    description: 'Sending the drone up to find the shots that aren\'t visible from the ground. A different lens on familiar places.',
    image: '/images/passions/drone.jpg',
  },
  {
    label: 'Chicago sports',
    description: 'Bears, White Sox, Bulls, Hawks. Rate Field will always be Comiskey. The Bears are going to be good soon. I believe this.',
    image: '/images/passions/sports.jpg',
  },
];

const lookingFor = [
  {
    title: 'Forward-Deployed or Staff Engineer Roles',
    description: 'Positions where owning the full cycle matters. I want to be in the room where the problem gets defined and still be the person writing the code that solves it.',
  },
  {
    title: 'Complex Domains Worth Understanding',
    description: 'The most interesting engineering problems I\'ve worked on came from industries with real operational complexity — logistics, enterprise IT, finance.',
  },
  {
    title: 'Teams That Take AI Seriously',
    description: "Not teams chasing the trend, but teams genuinely rethinking how they work. I've been deep in AI-assisted development for over a year and I'm looking for environments where that mindset is shared, not sold.",
  },
  {
    title: 'Engineering and Design at the Same Table',
    description: "Companies where the people who understand users and the people who write the systems are in the same conversation. The best products I've shipped came from that proximity.",
  },
  {
    title: 'Remote or Chicago-Based',
    description: "I've worked distributed for years and I'm good at it. Clear communication, solid documentation, real outcomes. Also in Chicago and open to hybrid if the work is right.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bone-50">
      <div className="col">

        {/* Page heading */}
        <div className="pt-12 pb-10 border-b border-black/[0.08]">
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-3">About</p>
          <h1 className="text-[40px] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink mb-4">
            Chicago-based.<br />Full-stack curious.
          </h1>
          <p className="text-[17px] leading-[1.6] text-ink/60 max-w-[560px]">
            Fifteen years closing the gap between understanding a problem and shipping the answer.
          </p>
        </div>

        {/* Bio + photo */}
        <div className="py-14 border-b border-black/[0.07] grid grid-cols-1 min-[760px]:grid-cols-[1fr_260px] gap-10 min-[760px]:gap-16 items-start">
          <div className="space-y-5">
            <p className="text-[16px] leading-[1.8] text-ink/70">
              Born and raised in Chicago — Rate Field (Comiskey, forever), Soldier Field, the whole thing. That city shapes how I think: direct, practical, not interested in work that doesn't connect to something real.
            </p>
            <p className="text-[16px] leading-[1.8] text-ink/70">
              Professionally I sit at the intersection of design and engineering, and I've been there long enough to see what goes wrong when the two are separated. The handoff problem is real. Someone understands the users, someone else designs the system, a third person writes the code, and by the time it ships the original insight is three translations removed from the product. I've built my career being all three of those people.
            </p>
            <p className="text-[16px] leading-[1.8] text-ink/70">
              Right now I'm at AHEAD building Hatch, an enterprise IT lifecycle management platform, in Elixir, Phoenix LiveView, and React. I own features from the first conversation about requirements through to code running in production.
            </p>
            <p className="text-[16px] leading-[1.8] text-ink/70">
              Before that I spent nine years at NFI Industries leading the design and engineering of a Transportation Management System now used company-wide. Built the design system, owned the architecture, mentored the team, presented to the C-suite. End-user workload dropped by more than 50%, which is the kind of outcome that makes the work feel worth it.
            </p>
          </div>

          <div className="min-[760px]:sticky min-[760px]:top-[80px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/avatar.jpg"
              alt="Brian Hall"
              className="w-full rounded-[3px] aspect-square object-cover"
            />
          </div>
        </div>

        {/* How I work */}
        <div className="py-14 border-b border-black/[0.07]">
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-10">How I work</p>
          <div className="grid grid-cols-1 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3 gap-x-10 gap-y-9">
            {workingStyle.map((item) => (
              <div key={item.label}>
                <p className="text-[14px] font-bold text-ink mb-2">{item.label}</p>
                <p className="text-[14px] leading-[1.7] text-ink/55">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Outside the work */}
        <div className="py-14 border-b border-black/[0.07]">
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-10">Outside the work</p>
          <div className="grid grid-cols-1 min-[560px]:grid-cols-3 gap-6">
            {passions.map((p) => (
              <div key={p.label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.label}
                  className="w-full rounded-[3px] mb-4 object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
                <p className="text-[14px] font-bold text-ink mb-1.5">{p.label}</p>
                <p className="text-[13px] leading-[1.7] text-ink/55">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What I'm looking for */}
        <div className="py-14 pb-20">
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-3">What I'm looking for</p>
          <p className="text-[17px] leading-[1.6] text-ink/60 max-w-[520px] mb-12">
            I'm open to the right opportunity. Here's what that actually looks like.
          </p>
          <div className="divide-y divide-black/[0.06]">
            {lookingFor.map((item, i) => (
              <div
                key={i}
                className="py-6 grid grid-cols-1 min-[640px]:grid-cols-[220px_1fr] gap-2 min-[640px]:gap-12"
              >
                <p className="text-[15px] font-bold text-ink leading-snug">{item.title}</p>
                <p className="text-[14px] leading-[1.7] text-ink/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
