import React, { useState } from 'react';

interface FilterState {
  selectedTags: string[];
  dateSort: 'newest' | 'oldest';
  readTimeSort: 'longest' | 'shortest';
}

interface BlogFilterPanelProps {
  allTags: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const BlogFilterPanel: React.FC<BlogFilterPanelProps> = ({
  allTags,
  filters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const hasActiveFilters = 
    filters.selectedTags.length > 0 || 
    filters.dateSort !== 'newest' || 
    filters.readTimeSort !== 'shortest';

  const clearAllFilters = () => {
    onFiltersChange({
      selectedTags: [],
      dateSort: 'newest',
      readTimeSort: 'shortest',
    });
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 border border-slate-700 rounded-lg hover:border-slate-600 transition-all text-white"
        >
          <svg 
            className="w-5 h-5"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
            />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs rounded-full">
              {filters.selectedTags.length + (filters.dateSort !== 'newest' ? 1 : 0) + (filters.readTimeSort !== 'shortest' ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-slate-400 hover:text-orange-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Collapsible Filter Panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 mb-12' : 'max-h-0'
        }`}
      >
        <div className="bg-slate-800/20 border border-slate-700 rounded-lg p-6 space-y-6">
          {/* Tags Filter */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">By Tags</h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    filters.selectedTags.includes(tag)
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      : 'bg-slate-700/30 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700" />

          {/* Date Sort */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Sort by Date</h4>
            <div className="flex gap-3">
              {(['newest', 'oldest'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => onFiltersChange({ ...filters, dateSort: option })}
                  className={`px-3 py-1 rounded text-sm transition-all capitalize ${
                    filters.dateSort === option
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      : 'bg-slate-700/30 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Time Sort */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Sort by Reading Time</h4>
            <div className="flex gap-3">
              {(['longest', 'shortest'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => onFiltersChange({ ...filters, readTimeSort: option })}
                  className={`px-3 py-1 rounded text-sm transition-all capitalize ${
                    filters.readTimeSort === option
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      : 'bg-slate-700/30 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};