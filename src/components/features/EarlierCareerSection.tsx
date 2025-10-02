'use client';

import { EarlierCareer } from '@/data/earlierCareers';
import { Tag } from '@/components/ui/Tag';

interface EarlierCareerSectionProps {
  data: EarlierCareer[];
}

export function EarlierCareerSection({ data }: EarlierCareerSectionProps) {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Earlier Career
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((job, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-all duration-300"
              >
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">
                  {job.company}
                </h3>
                <p className="text-primary dark:text-orange-400 text-sm mb-3">
                  {job.period}
                </p>
                <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
                  {job.role}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {job.description}
                </p>
                <div className="flex flex-wrap">
                  {job.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}