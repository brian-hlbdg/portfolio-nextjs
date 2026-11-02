import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { nfiCaseStudyData } from '@/data/nfiCaseStudy';
import { palateCollectifCaseStudyData } from '@/data/palateCollectifCaseStudy';
import { chicagoSportsDashboardCaseStudyData } from '@/data/chicagoSportsDashboardCaseStudy';

const studies = [
  { slug: 'nfi-tms-platform',           data: nfiCaseStudyData },
  { slug: 'chicago-sports-dashboard',   data: chicagoSportsDashboardCaseStudyData },
  { slug: 'wine-tasting-app',            data: palateCollectifCaseStudyData },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-bone-50">
      <div className="col pt-16 pb-20">

        <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-2">Case studies</p>
        <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.01em] text-ink mb-3">Work</h1>
        <p className="text-[17px] text-ink/60 mb-12 max-w-[520px]">
          Selected projects with outcomes, role, and decisions documented.
        </p>

        <div className="border-t-[1.5px] border-ink">
          {studies.map(({ slug, data }, idx) => (
            <Link
              key={slug}
              href={`/case-studies/${slug}`}
              className="group flex items-start gap-6 py-6 border-b border-black/10 hover:bg-bone-100 transition-colors duration-150 -mx-4 px-4 rounded-[2px]"
            >
              <span className="font-mono text-[12px] text-ink/35 w-6 shrink-0 pt-1">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-[20px] font-bold text-ink leading-snug mb-1 group-hover:text-brass transition-colors duration-150">
                  {data.hero.title}
                </h2>
                <p className="text-[14px] text-ink/55 mb-3 line-clamp-2">{data.tldr.scope}</p>
                <div className="flex flex-wrap gap-2">
                  {data.hero.technologies.slice(0, 4).map(t => (
                    <span key={t} className="font-mono text-[11px] text-ink/40 border border-ink/15 px-2 py-0.5 rounded-[2px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-right hidden sm:block">
                <div className="font-mono text-[11px] text-brass uppercase">{data.hero.client}</div>
                <div className="font-mono text-[11px] text-ink/35 mt-0.5">{data.hero.timeline}</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}
