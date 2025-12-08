// src/components/features/HeroSection.tsx - Simplified hero
'use client';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            Senior UX Designer &<br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Frontend Professional
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
            Over a decade of proven impact turning complex ideas into usable, scalable digital 
            experiences that drive measurable business value.
          </p>

          {/* Navigation Links */}
            <Link href="/experience" className="hover:text-primary transition-colors">Professional Experience</Link>
            <span className="text-gray-400">•</span>
            <Link href="/case-studies" className="hover:text-primary transition-colors">Case Studies</Link>
            <span className="text-gray-400">•</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span className="text-gray-400">•</span>
            <Link href="mailto:brian.HLBDG@outlook.com?subject=Schedule Consultation" className="hover:text-primary transition-colors">Schedule Consultation</Link>
          

        </div>
      </div>
    </section>
  );
}