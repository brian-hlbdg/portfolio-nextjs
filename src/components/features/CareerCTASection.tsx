export function CareerCTASection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center transition-all duration-300 shadow-lg">
            <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">
              Interested in Working Together?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              I'm always open to discussing new projects, creative collaborations, or opportunities to be part of 
              something meaningful. Feel free to reach out if you'd like to discuss how my skills and experience 
              could benefit your team or project.
            </p>
            <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded inline-flex items-center transition-colors">
              Get in Touch
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}