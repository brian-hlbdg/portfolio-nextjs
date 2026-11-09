// src/components/features/LookingForward.tsx
'use client';

const lookingForwardItems = [
  {
    title: "Forward-Deployed or Staff Engineer Roles",
    description: "Positions where owning the full cycle matters. I want to be in the room where the problem gets defined and still be the person writing the code that solves it. That combination is where I do my best work."
  },
  {
    title: "Complex Domains Worth Understanding",
    description: "The most interesting engineering problems I've worked on came from industries with real operational complexity. Logistics, enterprise IT, finance. Domains where understanding the work deeply changes what you build."
  },
  {
    title: "Teams That Take AI Seriously",
    description: "Not teams chasing the trend, but teams genuinely rethinking how they work. I've been deep in AI-assisted development for over a year and I'm looking for environments where that mindset is shared, not sold."
  },
  {
    title: "Engineering and Design at the Same Table",
    description: "Companies where the people who understand users and the people who write the systems are in the same conversation. The best products I've shipped came from that proximity. I want more of it."
  },
  {
    title: "Remote or Chicago-Based",
    description: "I've worked distributed for years and I'm good at it. Clear communication, solid documentation, real outcomes. I'm also in Chicago and open to hybrid if the work is right."
  }
];

export function LookingForward() {
  return (
    <section id="looking-forward" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header */}
          <div className="text-left mb-16">
            <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Looking Forward
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              I'm open to the right opportunity and I know what that looks like. Here's what I'm actually looking for:
            </p>
          </div>

          {/* Looking Forward Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lookingForwardItems.map((item) => (
              <div 
                key={item.title}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="text-primary dark:text-orange-400 font-medium mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
