// src/components/features/TechnicalToolbox.tsx
'use client';

const toolboxCategories = [
  {
    title: "Design & UX",
    tools: [
      "Figma", "Sketch", "Adobe Creative Suite", "Miro", "Whimsical",
      "User Research", "Prototyping", "Usability Testing"
    ]
  },
  {
    title: "Frontend Development", 
    tools: [
      "Phoenix LiveView", "HTML/CSS", "JavaScript", "React", "Tailwind CSS",
      "Bootstrap", "Responsive Design", "Web Performance"
    ]
  },
  {
    title: "Backend & Systems",
    tools: [
      "Elixir", "Phoenix Framework", "PostgreSQL", "GraphQL",
      "Agile/Scrum", "Remote Collaboration Tools", "NodeJS", "Docker"
    ]
  },
  {
    title: "Tools & Methods",
    tools: [
      "Performance Monitoring", "A/B Testing", "VS Code", "Git/GitHub",
      "User Research", "Prototyping", "Usability Testing"
    ]
  }
];

export function TechnicalToolbox() {
  return (
    <section id="toolbox" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header */}
          <div className="text-left mb-16">
            <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Technical Toolbox
            </h2>
          </div>

          {/* Toolbox Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {toolboxCategories.map((category, index) => (
              <div key={category.title} className="space-y-4">
                <h4 className="text-gray-800 dark:text-white font-medium mb-4">{category.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.tools.map((tool) => (
                    <span 
                      key={tool}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm hover:bg-primary hover:text-white dark:hover:bg-orange-400 transition-colors cursor-default"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}