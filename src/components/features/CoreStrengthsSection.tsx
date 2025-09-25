// src/components/features/CoreStrengthsSection.tsx - New section
'use client';

export function CoreStrengthsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Core Strengths
          </h2>

          <div className="space-y-6">
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-primary">Empathy</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                I approach every project with a deep understanding of the people who will use the product. By putting users at the center of the design process, I create experiences that feel intuitive and purposeful.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-primary">Partnership</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                My technical expertise in modern web technologies means I understand what's possible, ensuring that the user experience vision is technically achievable from the first playbook.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-primary">Problem Solving</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                I thrive on finding elegant solutions to complex problems. By breaking down challenges into manageable pieces, I can address user needs while meeting business requirements.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}