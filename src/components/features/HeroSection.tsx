// src/components/features/HeroSection.tsx
'use client';

import { useEffect, useState } from 'react';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen" />; // Prevent hydration issues
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              Senior UX Designer &<br />
              <span className="text-primary dark:text-orange-400">Frontend Developer</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Creating intuitive interfaces that drive business growth. 
              Specializing in Phoenix LiveView, Elixir, and modern web technologies.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="/case-studies"
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all transform hover:scale-105 hover:shadow-lg"
            >
              View My Work
            </a>
            <a 
              href="mailto:brian.HLBDG@outlook.com?subject=Project Discussion"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-primary dark:hover:border-orange-400 hover:text-primary dark:hover:text-orange-400 rounded-lg font-medium transition-all"
            >
              Start a Conversation
            </a>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl md:text-4xl font-light text-primary dark:text-orange-400 mb-2">12+</div>
              <div className="text-gray-600 dark:text-gray-300">Years Experience</div>
            </div>
            <div className="p-6">
              <div className="text-3xl md:text-4xl font-light text-primary dark:text-orange-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Projects Delivered</div>
            </div>
            <div className="p-6">
              <div className="text-3xl md:text-4xl font-light text-primary dark:text-orange-400 mb-2">8+</div>
              <div className="text-gray-600 dark:text-gray-300">Years UX Design</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}