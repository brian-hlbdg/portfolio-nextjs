// src/components/features/EducationSection.tsx - New section
'use client';

export function EducationSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Educational Background
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-primary">Human Computer Interaction</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Master of Science</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">DePaul University, Chicago</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                My graduate studies deepened my understanding of user-centered design, cognitive psychology, and the principles that lead to intuitive digital experiences.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-primary">Design</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Bachelor of Arts</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Chicago State University 2008</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                My undergraduate education gave me a strong foundation in design principles, visual communication, and creative problem-solving.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}