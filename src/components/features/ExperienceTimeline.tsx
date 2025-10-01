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
      <div className={`absolute w-6 h-6 bg-white dark:bg-gray-900 rounded-full border-2 ${
        experience.current ? 'border-primary dark:border-orange-400' : 'border-gray-300 dark:border-gray-600'
      } -left-3 flex items-center justify-center`}>
        <div className={`w-2 h-2 rounded-full ${
          experience.current ? 'bg-primary dark:bg-orange-400' : 'bg-gray-300 dark:bg-gray-600'
        }`} />
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
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
          <div className="text-left mb-16">
            <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Professional Journey
            </h2>
            <div className='mb-10'>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                My career has been shaped by a passion for creating intuitive digital experiences that solve real problems for users. I've had the privilege of working across various industries, from logistics and transportation to finance and retail, each opportunity adding new dimensions to my approach.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                At NFI Industries, I've been bridging the gap between complex logistics systems and the people who use them. Working on Transportation Management Software has taught me the importance of simplifying complexity without losing functionality, a challenge I embrace daily. My collaboration with cross-functional teams has reinforced my belief that the best digital products emerge from diverse perspectives working together.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                Prior to this, my work at Calamos Investments allowed me to hone my skills in the financial sector, where precision and clarity are paramount. Creating interfaces that make complex financial information accessible to different audiences taught me valuable lessons about designing with the end user in mind.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                My earlier experiences in web design at companies like GKIC and PMall built the foundation of my approach: clean, purposeful design that serves both business needs and user expectations. Each role has contributed to my understanding that effective digital experiences are those that disappear into the background, allowing users to accomplish their goals without friction.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600"></div>
          
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <div key={index} className="relative pl-12">
                {/* Timeline dot - Double Circle */}
                <div className="absolute -left-3 top-2 w-6 h-6 flex items-center justify-center">
                  {/* Outer circle */}
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    experience.current
                      ? 'border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800'
                  }`}></div>
                  
                  {/* Inner circle */}
                  <div className={`absolute w-3 h-3 rounded-full ${
                    experience.current
                      ? 'bg-orange-500'
                      : 'bg-gray-400 dark:bg-gray-500'
                  }`}></div>
                </div>
                
                {/* Content card */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="mb-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      experience.current
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {experience.period}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold dark:text-white mb-1">
                    {experience.role} @ {experience.company}
                  </h3>
                  
                  <h4 className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
                    {experience.role}
                  </h4>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        </div>
      </div>
    </section>
  );
}