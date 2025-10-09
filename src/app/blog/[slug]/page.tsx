import { use } from 'react';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import  Link from 'next/link';
import { BlogPostData } from '@/components/features/types/blogPost';

import { uxPrinciplesComplexSystemsData } from '@/data/uxPrinciplesComplexSystems';
import { chosenFewPicnicData } from '@/data/chosenFewPicnic';
import { designSystemsScaleData } from '@/data/designSystemsScale';
import { accessibilityBasicsData } from '@/data/accessibilityBasics';
import { chicagoDesignCommunityData } from '@/data/chicagoDesignCommunity';
import { elixirForDesignersData } from '@/data/elixirForDesigners';


const blogPostDataMap: Record<string, BlogPostData> = {
  'ux-principles-complex-systems': uxPrinciplesComplexSystemsData,
  'chosen-few-picnic': chosenFewPicnicData,
  'design-systems-scale': designSystemsScaleData,
  'accessibility-basics': accessibilityBasicsData,
  'chicago-design-community': chicagoDesignCommunityData,
  'elixir-for-designers': elixirForDesignersData,
};

export async function generateStaticParams() {
  return Object.keys(blogPostDataMap).map((slug) => ({
    slug,
  }));
}
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: PageProps) {
  const { slug } = use(params);
  
  // Find the post
  const post = blogPostDataMap[slug];

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Simple markdown-to-JSX renderer for the content
  const renderContent = (content?: string) => {
    if (!content) {
      return (
        <div className="space-y-6 text-slate-300">
          <p className="text-lg leading-relaxed">
            {post.excerpt}
          </p>
          <p className="text-slate-400 italic">
            Full article content coming soon...
          </p>
        </div>
      );
    }

    // Split content by sections and render
    const sections = content.split('\n\n');
    
    return sections.map((section, idx) => {
      // Main heading (h1)
      if (section.startsWith('# ')) {
        return null; // Skip main title, it's in the header
      }
      
      // Section heading (h2)
      if (section.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-bold text-white mt-12 mb-4">
            {section.replace('## ', '')}
          </h2>
        );
      }
      
      // Subsection heading (h3)
      if (section.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-semibold text-white mt-8 mb-3">
            {section.replace('### ', '')}
          </h3>
        );
      }
      
      // Bullet list
      if (section.includes('\n- ')) {
        const items = section.split('\n- ').filter(Boolean);
        return (
          <ul key={idx} className="space-y-2 my-6 ml-6">
            {items.map((item, i) => (
              <li key={i} className="text-slate-300 leading-relaxed flex items-start gap-3">
                <span className="text-orange-500 mt-2">•</span>
                <span>{item.trim()}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      // Horizontal rule
      if (section.trim() === '---') {
        return <hr key={idx} className="border-slate-700 my-12" />;
      }
      
      // Bold text in paragraphs
      const renderParagraphWithBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      };
      
      // Regular paragraph
      if (section.trim()) {
        return (
          <p key={idx} className="text-slate-300 leading-relaxed my-6">
            {renderParagraphWithBold(section)}
          </p>
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">


      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          <div className="flex gap-2 mb-6">
            <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-md font-medium">
              {post.category}
            </span>
            {post.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="mb-12 rounded-lg overflow-hidden bg-slate-800/30 border border-slate-700 h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <span className="text-slate-500 text-sm">{post.title}</span>
          </div>
        </div>

        {/* Lead paragraph */}
        <div className="mb-12">
          <p className="text-xl text-slate-300 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Author Bio */}
        <div className="mt-16 pt-8 border-t border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
              BH
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Brian Hall</h3>
              <p className="text-slate-400 text-sm mb-3">
                UX Designer and Frontend Developer specializing in creating intuitive interfaces for complex systems.
              </p>
              <div className="flex gap-4 text-sm">
                <Link href="https://www.linkedin.com/in/hlbdg/" className="text-orange-500 hover:text-orange-400 transition-colors">
                  LinkedIn
                </Link>
                <span className="text-slate-600">·</span>
                <Link href="mailto:brian.HLBDG@outlook.com" className="text-orange-500 hover:text-orange-400 transition-colors">
                  Email
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-slate-700">
          <h3 className="text-xl font-semibold mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="#"
              className="flex gap-4 p-4 bg-slate-800/40 border border-slate-700 rounded-lg hover:border-slate-600 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white mb-1 group-hover:text-orange-500 transition-colors">
                  Building Design Systems: Component Libraries vs. Style Guides
                </h4>
                <p className="text-slate-500 text-sm">March 22, 2025</p>
              </div>
            </Link>

            <Link 
              href="#"
              className="flex gap-4 p-4 bg-slate-800/40 border border-slate-700 rounded-lg hover:border-slate-600 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white mb-1 group-hover:text-orange-500 transition-colors">
                  Bridging the Gap: From Design to Development
                </h4>
                <p className="text-slate-500 text-sm">February 15, 2025</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-12">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}