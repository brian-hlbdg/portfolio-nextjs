'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function EnhancedHeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state instead of blank
  if (!mounted) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 dark:text-white leading-tight animate-fade-in">
            Senior UX Designer &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-orange-500">
              Frontend Developer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl leading-relaxed font-light">
            I help companies build scalable digital experiences that drive measurable business growth. 
            Specializing in Phoenix LiveView with 10+ years of proven results.
          </p>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-8 text-gray-600 dark:text-gray-300 mb-16">
            <Link href="#experience" className="hover:text-primary transition-all duration-300 relative group">
              Professional Experience
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/case-studies" className="hover:text-primary transition-all duration-300 relative group">
              Case Studies
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/blog" className="hover:text-primary transition-all duration-300 relative group">
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="mailto:brian.HLBDG@outlook.com?subject=Schedule Consultation" className="hover:text-primary transition-all duration-300 relative group">
              Schedule Consultation
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/case-studies"
              className="px-8 py-4 bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-orange-600 text-white rounded-lg font-medium text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              View My Work
            </Link>
            
            <Link 
              href="mailto:brian.HLBDG@outlook.com?subject=Project Discussion"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-primary hover:text-primary hover:shadow-md rounded-lg font-medium transition-all duration-300 text-center transform hover:scale-105"
            >
              Start a Conversation
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}