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
                Born and raised in Chicago, I've always had a deep connection to the city that shaped me. From cheering on the White Sox at Rate Field(aka Comiskey Park) to browsing at Soldier Field for Bears games, my Chicago roots run deep. That Midwestern work ethic and straightforward approach to problem-solving influences everything I do.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When I'm not designing digital experiences, you'll find me exploring the city with my camera, capturing unique perspectives of Chicago's architecture, or sending my drone up to get those impossible aerial shots that tell a different story about familiar places.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                My approach to design blends technical expertise with a human-centered mindset. I believe the best digital products not only function flawlessly but also connect with users on a meaningful level. This philosophy has guided my work across finance, logistics, e-commerce, and retail sectors.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Whether I'm collaborating with cross-functional teams or diving deep into user research, my goal is always the same: to create intuitive, impactful experiences that make a difference in people's lives.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                With 8+ years of remote collaboration experience, I excel at working with distributed teams across multiple time zones. My hybrid design-development skill set eliminates handoff friction and accelerates project delivery.
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