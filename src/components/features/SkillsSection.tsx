// src/components/features/SkillsSection.tsx
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
    name: "UX Design",
    percentage: 88,
    years: "8+ years",
    description: "User research, wireframing, prototyping, usability testing"
  },
  {
    name: "Phoenix LiveView",
    percentage: 85,
    years: "4+ years", 
    description: "Real-time web apps, server-side rendering"
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
        <h4 className="text-primary dark:text-orange-400 font-medium">{skill.name}</h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.years}</span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <div 
          className="bg-primary dark:bg-orange-400 h-2 rounded-full transition-all duration-1500 ease-out"
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm">
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">
              Core Expertise
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A blend of design thinking and technical implementation, 
              focused on creating exceptional user experiences.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="space-y-6">
            {skills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}