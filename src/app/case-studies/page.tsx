'use client';

import { RotatingStats } from '@/components/features/case-studies/RotatingStats';
import { CaseStudyCard } from '@/components/features/case-studies/CaseStudyCard';
import { ApproachCard } from '@/components/features/case-studies/ApproachCard';
import { featuredStudies, allCaseStudies, approachItems } from '@/data/caseStudiesData';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>



      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-5xl font-bold mb-4">Case Studies</h1>
          <p className="text-xl text-slate-400 max-w-3xl">
            Deep dives into real projects where design meets measurable business impact. 
            Each case study explores the challenges, process, and quantifiable results.
          </p>
        </section>

        {/* Rotating Stats */}
        <RotatingStats />

        {/* Featured Case Studies */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Featured Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredStudies.map(study => (
              <CaseStudyCard key={study.id} study={study} featured />
            ))}
          </div>
        </section>

        {/* All Case Studies */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">All Case Studies</h2>
          <div className="grid grid-cols-1 gap-6">
            {allCaseStudies.map(study => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        </section>

        {/* My Case Study Approach */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">My Case Study Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approachItems.map((item, idx) => (
              <ApproachCard key={idx} item={item} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-800/30 rounded-2xl p-12 text-center border border-slate-700">
          <h2 className="text-3xl font-bold mb-4">Want to discuss a project?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            I'm currently accepting new projects for Q3 2025. Let's talk about how I can help solve 
            your design and development challenges.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
              <span>💬</span>
              Start a Conversation
            </button>
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors">
              View Experience
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}