// src/components/features/SkillsSection.tsx - Updated styling
'use client';

import { useEffect, useRef, useState } from 'react';

interface Skill {
  name: string;
  percentage: number;
  years: string;
  description: string;
}

const skills: Skill[] = [
  {
    name: "UX Design & User Research",
    percentage: 95,
    years: "10+ years",
    description: "User interviews, personas, journey mapping, usability testing"
  },
  {
    name: "Phoenix LiveView & Elixir",
    percentage: 64,
    years: "6+ years", 
    description: "Real-time applications, interactive prototypes, server-side rendering"
  },
  {
    name: "Frontend Development",
    percentage: 92,
    years: "12+ years",
    description: "HTML/CSS, JavaScript, Tailwind, Bootstrap, responsive design"
  },
  {
    name: "Design Systems",
    percentage: 70,
    years: "3+ years",
    description: "Component libraries, style guides, design tokens, documentation"
  },
  {
    name: "Remote Collaboration",
    percentage: 90,
    years: "5+ years",
    description: "Distributed teams, async communication, project management"
  }
];

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stagger the animation
          setTimeout(() => {
            setAnimatedWidth(skill.percentage);
          }, index * 200);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [skill.percentage, index]);

  return (
    <div 
      ref={ref}
      className={`p-6 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-600 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-primary font-medium text-lg">{skill.name}</h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.years}</span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-1500 ease-out"
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        {skill.description}
      </p>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header */}
          <div className="text-left mb-16">
            <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Core Expertise
            </h2>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}