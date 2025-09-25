// src/components/features/InteractiveSkillsSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface Skill {
  name: string;
  percentage: number;
  years: string;
  description: string;
  icon: string;
}

const skills: Skill[] = [
  {
    name: "UX Design & User Research",
    percentage: 95,
    years: "10+ years",
    description: "User interviews, personas, journey mapping, usability testing",
    icon: "🎨"
  },
  {
    name: "Phoenix LiveView & Elixir",
    percentage: 85,
    years: "6+ years", 
    description: "Real-time applications, interactive prototypes, server-side rendering",
    icon: "🔥"
  },
  {
    name: "Frontend Development",
    percentage: 92,
    years: "12+ years",
    description: "HTML/CSS, JavaScript, Tailwind, Bootstrap, responsive design",
    icon: "💻"
  },
  {
    name: "Design Systems",
    percentage: 78,
    years: "4+ years",
    description: "Component libraries, style guides, design tokens, documentation",
    icon: "🎯"
  },
  {
    name: "Remote Collaboration",
    percentage: 90,
    years: "8+ years",
    description: "Distributed teams, async communication, project management",
    icon: "🌍"
  }
];

function InteractiveSkillBar({ skill, index }: { skill: Skill; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className="group cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`p-6 rounded-xl transition-all duration-300 ${
        isHovered 
          ? 'bg-white dark:bg-gray-700 shadow-xl transform scale-105' 
          : 'bg-gray-50 dark:bg-gray-800 shadow-sm'
      }`}>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{skill.icon}</span>
            <div>
              <h4 className="text-primary font-semibold text-lg">{skill.name}</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">{skill.years}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{skill.percentage}%</div>
        </div>
        
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.percentage}%` } : {}}
            transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
          />
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
        </div>
        
        <motion.p 
          className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
          animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
        >
          {skill.description}
        </motion.p>
      </div>
    </motion.div>
  );
}

export function InteractiveSkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          <motion.div 
            ref={ref}
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Core Expertise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Technical skills and design capabilities that drive measurable business results for remote-first teams
            </p>
          </motion.div>

          <div className="space-y-6">
            {skills.map((skill, index) => (
              <InteractiveSkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}