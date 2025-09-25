// src/components/features/PassionsSection.tsx - New section for passions & interests
'use client';

import Image from 'next/image';

const passions = [
  {
    title: "Photography",
    description: "Capturing Chicago's urban landscape and architecture through my lens",
    image: "/images/passions/photography.jpg" // You'll need to add these images
  },
  {
    title: "Drone Flying", 
    description: "Getting a bird's-eye view of Chicago and exploring new perspectives",
    image: "/images/passions/drone.jpg"
  },
  {
    title: "Chicago Sports",
    description: "Dedicated White Sox and Bears fan through thick and thin",
    image: "/images/passions/sports.jpg"
  }
];

export function PassionsSection() {
  return (
    <section id="passions" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Passions & Interests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {passions.map((passion, index) => (
              <div key={passion.title} className="group">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    {/* Placeholder - replace with actual images */}
                    <span className="text-primary text-lg font-medium">{passion.title}</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                  {passion.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {passion.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}