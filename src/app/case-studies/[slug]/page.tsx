import { notFound } from 'next/navigation';
import { CaseStudyContent } from '@/components/features/case-study-detail/CaseStudyContent';
import { nfiCaseStudyData } from '@/data/nfiCaseStudy';
import { palateCollectifCaseStudyData } from '@/data/palateCollectifCaseStudy';
import { nfiRelayExceptionHandlingCaseStudyData } from '@/data/nfiRelayExceptionHandlingCaseStudy';
import { portfolioRedesignCaseStudyData } from '@/data/portfolioRedesignCaseStudy';
import { chicagoSportsDashboardCaseStudyData } from '@/data/chicagoSportsDashboardCaseStudy';
import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

const dataMap: Record<string, CaseStudyDetailData> = {
  'nfi-tms-platform':             nfiCaseStudyData,
  'wine-tasting-app':             palateCollectifCaseStudyData,
  'nfi-relay-exception-handling': nfiRelayExceptionHandlingCaseStudyData,
  'portfolio-redesign':           portfolioRedesignCaseStudyData,
  'chicago-sports-dashboard':     chicagoSportsDashboardCaseStudyData,
};

const slugOrder = Object.keys(dataMap);

export async function generateStaticParams() {
  return slugOrder.map(slug => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = dataMap[slug];
  if (!data) notFound();

  const nextSlug = slugOrder[(slugOrder.indexOf(slug) + 1) % slugOrder.length];
  const nextData = dataMap[nextSlug];

  return <CaseStudyContent data={data} nextSlug={nextSlug} nextData={nextData} />;
}
