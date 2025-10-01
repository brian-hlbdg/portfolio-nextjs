'use client';

import Image from 'next/image';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              I bring together user experience design and frontend development to create digital products that people actually want to use.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300">
                I've had the privilege of working across various industries, from logistics and transportation to finance and retail, each opportunity adding new dimensions to my approach.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300">
                At NFI Industries, I've been bridging the gap between complex logistics systems and the people who use them. Working on Transportation Management Software has taught me the importance of simplifying complexity without losing functionality, a challenge I embrace daily.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300">
                Prior to this, my work at Calamos Investments allowed me to hone my skills in the financial sector, where precision and clarity are paramount. Creating interfaces that make complex financial information accessible to different audiences taught me valuable lessons about designing with the end user in mind.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300">
                My earlier experiences in web design at companies like GKIC and PMall built the foundation of my approach: clean, purposeful design that serves both business needs and user expectations.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                <Image
                  src="/images/web_chicago_skyline.jpg"
                  alt="Chicago skyline"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}