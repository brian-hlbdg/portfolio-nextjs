'use client';

import { Company } from '@/data/companies';
import { Tag } from './Tag';
import Image from 'next/image';

export function CompanyCard({ 
  company, 
  role, 
  period, 
  description, 
  contributions, 
  tags, 
  logo, 
  logoAlt 
}: Company) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Main Content */}
        <div className="flex-1">
          
          {/* Company Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold text-xl">
                {company}
              </h3>
              <p className="text-primary dark:text-orange-400 text-sm">
                {period}
              </p>
            </div>
          </div>
          
          {/* Role */}
          <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
            {role}
          </h4>
          
          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {description}
          </p>
          
          {/* Key Contributions */}
          <div className="mb-4">
            <h5 className="text-primary dark:text-orange-400 font-semibold mb-2">
              Key Contributions:
            </h5>
            <ul className="space-y-2">
              {contributions.map((contribution, index) => (
                <li 
                  key={index} 
                  className="flex items-start text-gray-700 dark:text-gray-300"
                >
                  <span className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0">✓</span>
                  <span>{contribution}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap">
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        </div>
        
        {/* Company Logo */}
        {logo && (
          <div className="flex-shrink-0 md:w-48 flex items-start justify-center">
            <div className="bg-white dark:bg-white rounded-lg p-4 w-full max-w-[200px] shadow-sm">
              <Image 
                src={logo} 
                alt={logoAlt || `${company} logo`}
                className="w-full h-auto"
                loading="lazy"
                width={200}
                height={200}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}