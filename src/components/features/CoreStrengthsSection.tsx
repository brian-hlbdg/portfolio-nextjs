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
              <h3 className="text-lg font-medium mb-3 text-primary">Discovery and Domain Research</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                My M.S. in HCI isn't a design credential, it's how I understand why users behave the way they do. I've run stakeholder interviews, usability sessions, and workflow analyses across logistics, finance, and enterprise software. That research becomes better architecture decisions, not just better wireframes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-primary">Full-Stack Engineering</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Elixir and Phoenix LiveView on the backend, React and Next.js on the front. I've built production systems that handle real scale, and I've learned that the most interesting engineering problems usually start with a user behavior that nobody thought to account for.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-primary">AI-Augmented Development</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                I use Claude Code, Cursor, and Copilot every day. Not as a novelty but as a genuine shift in how I work. I spend more time thinking about systems and architecture and less time on implementation details I've already solved. I've been helping my team make that same shift.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-primary">End-to-End Ownership</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The thing I'm best at is owning the whole cycle. Research, system design, implementation, production deployment, and the stakeholder conversations that happen at every step. I've done it on a company-wide TMS and I'm doing it now on an enterprise IT platform. No handoffs means no translation loss.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}