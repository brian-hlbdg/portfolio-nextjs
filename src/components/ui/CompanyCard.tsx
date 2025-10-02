const CompanyCard = ({ company, role, period, description, contributions, tags, logo, logoAlt }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 transition-all duration-300">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-xl">{company}</h3>
            <p className="text-primary dark:text-orange-400 text-sm">{period}</p>
          </div>
        </div>
        
        <h4 className="text-gray-900 dark:text-white font-semibold mb-3">{role}</h4>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{description}</p>
        
        <div className="mb-4">
          <h5 className="text-primary dark:text-orange-400 font-semibold mb-2">Key Contributions:</h5>
          <ul className="space-y-2">
            {contributions.map((contribution, index) => (
              <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
                <span>{contribution}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap">
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </div>
      </div>
      
      {logo && (
        <div className="flex-shrink-0 md:w-48 flex items-start justify-center">
          <div className="bg-white dark:bg-white rounded-lg p-4 w-full max-w-[200px]">
            <img src={logo} alt={logoAlt} className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  </div>
);