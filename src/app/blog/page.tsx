'use client';

import { useState, useMemo } from 'react';
import { Footer } from '@/components/layout/Footer';
import { BlogCard } from '@/components/features/blog/BlogCard';
import { BlogFilterPanel } from '@/components/features/blog/BlogFilterPanel';
import { FeaturedPostsSection } from '@/components/features/blog/FeaturedPostsSection';
import { allPosts } from '@/data/blogPosts';


interface FilterState {
  selectedTags: string[];
  dateSort: 'newest' | 'oldest';
  readTimeSort: 'longest' | 'shortest';
}

export default function BlogPage() {
  const [filters, setFilters] = useState<FilterState>({
    selectedTags: [],
    dateSort: 'newest',
    readTimeSort: 'shortest',
  });

  // Extract all unique tags from all posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Parse reading time to minutes for sorting
  const parseReadTime = (readTime: string): number => {
    const match = readTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Filter and sort posts (excluding featured posts from main grid)
  const filteredAndSortedPosts = useMemo(() => {
    // Start with all non-featured posts
    let posts = allPosts.filter(post => !post.featured);

    // Apply tag filter - show posts matching ANY selected tag
    if (filters.selectedTags.length > 0) {
      posts = posts.filter(post =>
        post.tags.some(tag => filters.selectedTags.includes(tag))
      );
    }

    // Sort by date
    posts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Sort by reading time (secondary sort)
    if (filters.readTimeSort === 'longest') {
      posts.sort((a, b) => parseReadTime(b.readTime) - parseReadTime(a.readTime));
    } else {
      posts.sort((a, b) => parseReadTime(a.readTime) - parseReadTime(b.readTime));
    }

    return posts;
  }, [filters]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-800 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-slate-400 max-w-3xl">
            Thoughts, insights, and explorations on UX design, frontend development, and creative processes.
          </p>
        </section>

        {/* Featured Posts Section - Shows 2 random featured posts */}
        <FeaturedPostsSection posts={allPosts} />

        {/* Filter Panel - Tags, Date Sort, Reading Time Sort */}
        <BlogFilterPanel 
          allTags={allTags}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* All Posts - Filtered & Sorted */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-white">All Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-slate-400 text-lg">
                No posts found matching your filters.
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gray-50 dark:bg-slate-800/30 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-700">
          <h2 className="text-3xl font-bold mb-4">Want to discuss a project?</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            I'm currently accepting new projects for Q3 2025. Let's talk about how I can help solve
            your design and development challenges.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}