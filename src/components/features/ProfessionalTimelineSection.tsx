'use client';

import { ProfessionalTimeline } from '@/data/professionalTimeline';
import { Tag } from '@/components/ui/Tag';

interface ProfessionalTimelineSectionProps {
  data: ProfessionalTimeline[];
}

interface TimelineItemComponentProps extends ProfessionalTimeline {
  isLast: boolean;
}

function TimelineItemComponent({ 
  year, 
  title, 
  description, 
  tags, 
  number, 
  isLast 
}: TimelineItemComponentProps) {
  return (
    <div className="flex gap-4 mb-8 relative">
      <div className="flex-shrink-0 relative z-10">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          {number}
        </div>
        {!isLast && (
          <div 
            className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary" 
            style={{ height: 'calc(100% + 2rem)' }}
          />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
          {year}: {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap">
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfessionalTimelineSection({ data }: ProfessionalTimelineSectionProps) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Growth & Skills Evolution
          </h2>
          <div className="ml-4">
            {data.map((item, index) => (
              <TimelineItemComponent 
                key={index} 
                {...item} 
                isLast={index === data.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}