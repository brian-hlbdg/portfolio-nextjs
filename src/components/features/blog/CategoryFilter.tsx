'use client';

import { BlogCategory } from '@/components/features/types/blog';

interface CategoryFilterProps {
  categories: BlogCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-12">
      <button
        onClick={() => onCategoryChange('All')}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          activeCategory === 'All'
            ? 'bg-orange-500 text-white'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeCategory === category
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};