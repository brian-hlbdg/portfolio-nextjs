// src/components/features/HeroSection.tsx - Simplified hero
'use client';

export function HeroSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            Senior UX Designer &<br />
            Frontend Developer
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
            I help companies build scalable digital experiences that drive measurable business growth. 
            Specializing in Phoenix LiveView with 10+ years of proven results.
          </p>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-300">
            <a href="#experience" className="hover:text-primary transition-colors">Professional Experience</a>
            <span className="text-gray-400">•</span>
            <a href="/case-studies" className="hover:text-primary transition-colors">Case Studies</a>
            <span className="text-gray-400">•</span>
            <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
            <span className="text-gray-400">•</span>
            <a href="mailto:brian.HLBDG@outlook.com?subject=Schedule Consultation" className="hover:text-primary transition-colors">Schedule Consultation</a>
          </div>

        </div>
      </div>
    </section>
  );
}