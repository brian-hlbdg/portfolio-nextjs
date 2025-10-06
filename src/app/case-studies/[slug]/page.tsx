import { use } from 'react';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/features/case-studies/HeroSection';
import { TLDRSection } from '@/components/features/case-study-detail/TLDRSection';
import { MetricsGrid } from '@/components/features/case-study-detail/MetricsGrid';
import { ProcessSteps } from '@/components/features/case-study-detail/ProcessSteps';
import { nfiCaseStudyData } from '@/data/nfiCaseStudy';
import { palateCollectifCaseStudyData } from '@/data/palateCollectifCaseStudy';
import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

const caseStudyDataMap: Record<string, CaseStudyDetailData> = {
  'nfi-tms-platform': nfiCaseStudyData,
  'wine-tasting-app': palateCollectifCaseStudyData,
};

export async function generateStaticParams() {
  return Object.keys(caseStudyDataMap).map((slug) => ({
    slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CaseStudyDetailPage({ params }: PageProps) {
  // Unwrap the params Promise using React.use()
  const { slug } = use(params);
  
  // Get data for this slug
  const data = caseStudyDataMap[slug];

  // Handle not found
  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">


      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <HeroSection hero={data.hero} />

        {/* TL;DR */}
        <TLDRSection tldr={data.tldr} />

        {/* Project Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Project Overview</h2>
          
          {/* Challenge */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{data.overview.challenge.title}</h3>
            <p className="text-slate-300 mb-4">{data.overview.challenge.description}</p>
            <ul className="space-y-2">
              {data.overview.challenge.problems.map((problem, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">⚠️</span>
                  <span className="text-slate-300">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Goals */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{data.overview.goals.title}</h3>
            <p className="text-slate-300 mb-4">{data.overview.goals.description}</p>
            <ul className="space-y-2">
              {data.overview.goals.objectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">🎯</span>
                  <span className="text-slate-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Role & Responsibilities */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">My Role & Responsibilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800/20 border border-slate-700 rounded-xl p-6">
              <div>
                <h4 className="text-orange-500 font-semibold mb-3">UX Research & Design</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  {data.overview.role.uxResearch.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-orange-500 font-semibold mb-3">Frontend Development</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  {data.overview.role.frontendDev.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-orange-500 font-semibold mb-3">Cross-functional Collaboration</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  {data.overview.role.collaboration.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Development Approach */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Development Approach</h2>
          <p className="text-slate-300 mb-8">{data.developmentApproach.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-orange-500 font-semibold mb-4">Technology Stack</h3>
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Frontend</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  {data.developmentApproach.techStack.frontend.map((tech, idx) => (
                    <li key={idx}>• {tech}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Backend Integration</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  {data.developmentApproach.techStack.backend.map((tech, idx) => (
                    <li key={idx}>• {tech}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-orange-500 font-semibold mb-4">Design Principles</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {data.developmentApproach.designPrinciples.map((principle, idx) => (
                  <li key={idx}>• {principle}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Research & Discovery */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Research & Discovery</h2>
          
          {data.research.sections.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
              <p className="text-slate-300 mb-6">{section.content}</p>
              
              {section.subsections && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {section.subsections.map((sub, subIdx) => (
                    <div key={subIdx} className="bg-slate-800/20 border border-slate-700 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">{sub.title}</h4>
                      <p className="text-slate-300 text-sm">{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {section.images && (
                <div className="grid grid-cols-2 gap-4">
                  {section.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="bg-slate-800/30 rounded-lg h-48 flex items-center justify-center">
                      <span className="text-slate-500">[Image: {img}]</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Design Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Design Process</h2>
          <p className="text-slate-300 mb-8">{data.designProcess.description}</p>
          <ProcessSteps steps={data.designProcess.steps} />
        </section>

        {/* The Solution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">The Solution</h2>
          <p className="text-slate-300 mb-8">{data.solution.description}</p>
          
          <div className="space-y-12 mb-8">
            {data.solution.features.map((feature) => (
              <div key={feature.number} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-orange-500 font-bold text-lg mb-2">
                    {feature.number}. {feature.title}
                  </div>
                  <p className="text-slate-300">{feature.description}</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-slate-500">[Image: {feature.image}]</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.solution.improvements.map((improvement, idx) => (
              <div key={idx} className="bg-slate-800/20 border border-slate-700 rounded-xl p-6">
                <h3 className="text-orange-500 font-semibold mb-4">{improvement.title}</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {improvement.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Results & Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Results & Impact</h2>
          <p className="text-slate-300 mb-8">{data.results.description}</p>
          
          {/* Metrics */}
          <MetricsGrid metrics={data.results.metrics} />

          {/* Business Outcomes & User Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Business Outcomes</h3>
              <div className="space-y-3">
                {data.results.businessOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-slate-300">{outcome.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">User Feedback</h3>
              <div className="space-y-4">
                {data.results.userFeedback.map((feedback, idx) => (
                  <div key={idx} className="bg-slate-800/20 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 italic mb-3">"{feedback.quote}"</p>
                    <p className="text-slate-400 text-sm">
                      — {feedback.author}, {feedback.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Long-Term Value */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Long-Term Value</h3>
            <p className="text-slate-300 mb-6">
              Based on the performance improvements and business impacts, the project achieved a positive return on investment. The long-term benefits include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.results.longTermValue.map((value, idx) => (
                <div key={idx} className="bg-slate-800/20 border border-slate-700 rounded-xl p-6">
                  <h4 className={`font-semibold mb-3 ${
                    value.color === 'orange' ? 'text-orange-500' :
                    value.color === 'green' ? 'text-green-500' : 'text-blue-500'
                  }`}>
                    {value.title}
                  </h4>
                  <p className="text-slate-300 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reflections & Lessons Learned */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Reflections & Lessons Learned</h2>
          <p className="text-slate-300 mb-8">{data.reflections.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">What Worked Well</h3>
              <div className="space-y-4">
                {data.reflections.whatWorkedWell.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/20 border border-slate-700 rounded-lg p-4">
                    <h4 className="text-green-500 font-semibold mb-2 flex items-start gap-2">
                      <span>✓</span>
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Challenges & Takeaways</h3>
              <div className="space-y-4">
                {data.reflections.challenges.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/20 border border-slate-700 rounded-lg p-4">
                    <h4 className="text-orange-500 font-semibold mb-2 flex items-start gap-2">
                      <span>⚠</span>
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Key Takeaways</h3>
            <p className="text-slate-300 mb-6">
              This project highlighted several principles that I now apply to all of my UX work:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.reflections.keyTakeaways.map((takeaway, idx) => (
                <div key={idx}>
                  <h4 className="text-orange-500 font-semibold mb-2">{takeaway.title}</h4>
                  <p className="text-slate-300 text-sm">{takeaway.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-800/30 rounded-2xl p-12 text-center border border-slate-700">
          <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            I'm currently accepting new projects for Q3 2025. Let's discuss how I can help solve 
            your design and development challenges.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
              <span>💬</span>
              Start a Conversation
            </button>
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors">
              View More Case Studies
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}