'use client';

import { Company } from '@/data/companies';
import { CompanyCard } from '@/components/ui/CompanyCard';

interface CompanyExperienceSectionProps {
  data: Company[];
}

export function CompanyExperienceSection({ data }: CompanyExperienceSectionProps) {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Recent Experience
          </h2>
          {data.map((company, index) => (
            <CompanyCard key={index} {...company} />
          ))}
        </div>
      </div>
    </section>
  );
}