'use client';

import { useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { BlogCard } from '@/components/features/blog/BlogCard';
import { CategoryFilter } from '@/components/features/blog/CategoryFilter';
import { featuredPosts, allPosts, categories } from '@/data/blogPosts';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'All' 
    ? allPosts 
    : allPosts.filter(post => post.category === activeCategory);

  // Remove featured posts from filtered list to avoid duplication
  const nonFeaturedPosts = filteredPosts.filter(
    post => !post.featured
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">


      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-slate-400 max-w-3xl">
            Thoughts, insights, and explorations on UX design, frontend development, and creative processes.
          </p>
        </section>

        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Featured Posts */}
        {activeCategory === 'All' && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Featured Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map(post => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            {activeCategory === 'All' ? 'All Posts' : `${activeCategory} Posts`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeCategory === 'All' ? nonFeaturedPosts : filteredPosts).map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              No posts found in this category yet.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 bg-slate-800/30 rounded-2xl p-12 text-center border border-slate-700">
          <h2 className="text-3xl font-bold mb-4">Want to discuss a project?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            I'm currently accepting new projects for Q3 2025. Let's talk about how I can help solve 
            your design and development challenges.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2">
              <span>💬</span>
              Start a Conversation
            </button>
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors">
              View Case Studies
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}