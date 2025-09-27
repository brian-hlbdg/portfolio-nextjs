// src/components/features/LookingForward.tsx
'use client';

const lookingForwardItems = [
  {
    title: "Innovation-Driven Companies",
    description: "I thrive in environments where innovation is valued and where design is seen as a strategic advantage."
  },
  {
    title: "Human-Centered Teams", 
    description: "I'm drawn to teams that put people—both users and team members—at the center of their work. Creating positive experiences is as much about the process as it is about the end result."
  },
  {
    title: "Remote-First Cultures",
    description: "Companies that embrace distributed work and understand that great talent isn't limited by geography. I thrive in environments that prioritize clear communication, documentation, and results-driven work cultures."
  },
  {
    title: "Impact-Focused Projects",
    description: "I'm eager to work on products and services that solve meaningful problems and make a positive difference in users' daily lives, whether that's in healthcare, education, sustainability, or other impact-driven fields."
  },
  {
    title: "Collaborative Environments",
    description: "Places that value cross-functional collaboration, where diverse perspectives come together to create solutions that wouldn't be possible in silos. The best work happens when different disciplines inform each other."
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
            <p className=" text-gray-600 dark:text-gray-300">
              I'm passionate about creating digital experiences that make a real difference in people's lives. Looking ahead, I'm particularly interested in opportunities with:
            </p>
          </div>

          {/* Looking Forward Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lookingForwardItems.map((item, index) => (
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
