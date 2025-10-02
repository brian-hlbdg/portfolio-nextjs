import { ProfessionalTimelineSection } from '@/components/features/ProfessionalTimelineSection';
import { CompanyExperienceSection } from '@/components/features/CompanyExperienceSection';
import { EarlierCareerSection } from '@/components/features/EarlierCareerSection';
import { CareerCTASection } from '@/components/features/CareerCTASection';
import { Footer } from '@/components/layout/Footer';

import { professionalTimelineData } from '@/data/professionalTimeline';
import { companiesData } from '@/data/companies';
import { earlierCareersData } from '@/data/earlierCareers';

export const metadata = {
  title: 'Professional Experience',
  description: 'Explore my professional journey spanning UX design, frontend development, and digital transformation across various industries.',
};

export default function ExperiencePage() {
  return (
    <>
      {/* Page Header */}
      <section className="py-16 bg-white dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Experience
            </h1>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Over the years, I've had the privilege of working with diverse companies across various 
              industries. Each role has contributed to my growth as a designer and developer, building a 
              unique skill set that combines technical expertise with creative problem-solving.
            </p>
            
          </div>
        </div>
      </section>

      {/* Feature Sections - Each is a separate, reusable component */}
      <ProfessionalTimelineSection data={professionalTimelineData} />
      <CompanyExperienceSection data={companiesData} />
      <EarlierCareerSection data={earlierCareersData} />
      <CareerCTASection />
      <Footer />
    </>
  );
}