// src/components/features/ExperienceTimeline.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  current?: boolean;
}

const experiences: Experience[] = [
  {
    company: "NFI Industries",
    role: "UX Design & Frontend Development",
    period: "2017 - Present",
    description: "Leading UX design for transportation management systems, I work at the intersection of complex logistics and user-centered design. My focus has been creating intuitive interfaces for sophisticated software that makes daily operations smoother for logistics professionals.",
    current: true
  },
  {
    company: "Calamos Investments",
    role: "UX Designer",
    period: "2015 - 2017",
    description: "Designed user interfaces for financial platforms, focusing on making complex investment data accessible and actionable for different user types.",
  },
  {
    company: "GKIC",
    role: "Web Designer & Developer",
    period: "2012 - 2015",
    description: "Created marketing websites and digital experiences for business education company, focusing on conversion optimization and user engagement.",
  },
  {
    company: "PMall",
    role: "Frontend Developer",
    period: "2010 - 2012",
    description: "Developed e-commerce interfaces and improved conversion rates through user-centered design and A/B testing.",
  }
];

function TimelineItem({ experience, index }: { experience: Experience; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 200);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div 
      ref={ref}
      className={`mb-12 ml-8 transition-all duration-600 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
    >
      <div className={`absolute w-6 h-6 bg-white dark:bg-gray-800 rounded-full border-2 ${
        experience.current ? 'border-primary dark:border-orange-400' : 'border-gray-300 dark:border-gray-600'
      } -left-3 flex items-center justify-center`}>
        <div className={`w-2 h-2 rounded-full ${
          experience.current ? 'bg-primary dark:bg-orange-400' : 'bg-gray-300 dark:bg-gray-600'
        }`} />
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-1 dark:text-white">{experience.company}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-3">{experience.role} ({experience.period})</p>
        <p className="text-gray-700 dark:text-gray-300">{experience.description}</p>
      </div>
    </div>
  );
}

export function ExperienceTimeline() {
  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">
              Professional Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A timeline of experiences that have shaped my approach to design and development.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
            {experiences.map((experience, index) => (
              <TimelineItem key={experience.company} experience={experience} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}