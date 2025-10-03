'use client';

import Link from 'next/link';

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4">
              Let's Connect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact Info */}
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                I'm currently accepting new projects for Q3 2025. Whether you're looking to improve an existing product or build something entirely new, I'd love to discuss how I can help.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-orange-400/10 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-primary dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <Link href="mailto:brian.HLBDG@outlook.com" className="text-primary dark:text-orange-400 hover:underline">
                      brian.HLBDG@outlook.com
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-orange-400/10 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-primary dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">LinkedIn</p>
                    <Link href="https://www.linkedin.com/in/hlbdg/" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-orange-400 hover:underline">
                      Connect with me
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-orange-400/10 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-primary dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">GitHub</p>
                    <Link href="https://github.com/brian-hlbdg" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-orange-400 hover:underline">
                      View my code
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
              <h3 className="text-xl font-medium mb-4 dark:text-white">Ready to start a project?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Let's discuss how I can help solve your design and development challenges.
              </p>
              <div className="space-y-4">
                <Link
                  href="mailto:brian.HLBDG@outlook.com?subject=Project Discussion"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Start a Conversation
                </Link>
                <Link
                  href="/case-studies"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary dark:hover:border-orange-400 hover:text-primary dark:hover:text-orange-400 rounded-lg transition-colors"
                >
                  View My Work
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}