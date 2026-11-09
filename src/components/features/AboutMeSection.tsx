// src/components/features/AboutMeSection.tsx - New section matching your HTML
'use client';

import Image from 'next/image';

export function AboutMeSection() {
  return (
    <section id="about" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            About Me
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Content */}
            <div className="lg:col-span-2 space-y-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Born and raised in Chicago, I've always had a deep connection to the city that shaped me. From cheering on the White Sox at Rate Field (aka Comiskey Park) to browsing at Soldier Field for Bears games, my Chicago roots run deep. That Midwestern work ethic and straightforward approach to problem-solving influences everything I do.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When I'm not designing digital experiences, you'll find me exploring the city with my camera, capturing unique perspectives of Chicago's architecture, or sending my drone up to get those impossible aerial shots that tell a different story about familiar places.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Professionally I sit at the intersection of design and engineering, and I've been there long enough to see what goes wrong when the two are separated. The handoff problem is real. Someone understands the users, someone else designs the system, a third person writes the code, and by the time it ships the original insight is three translations removed from the product. I've built my career being all three of those people.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Right now I'm at AHEAD building Hatch, an enterprise IT lifecycle management platform, in Elixir, Phoenix LiveView, and React. I own features from the first conversation about requirements through to code running in production. I've also been deep in AI-assisted development for the past year, using Claude Code, Cursor, and Copilot as part of my daily workflow, and helping my team do the same.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Before that I spent nine years at NFI Industries leading the design and engineering of a Transportation Management System now used company-wide. Built the design system, owned the architecture, mentored the team, presented to the C-suite. The whole cycle. End-user workload dropped by more than 50%, which is the kind of outcome that makes the work feel worth it.
              </p>
            </div>

            {/* Avatar Image */}
            <div className="lg:col-span-1">
              <div className="w-full max-w-sm mx-auto">
                <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                  <Image
                    src="/images/avatar.jpg"
                    alt="Brian H. - UX Designer"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}