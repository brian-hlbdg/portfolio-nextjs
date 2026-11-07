import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { ReadingProgress } from '@/components/features/case-study-detail/ReadingProgress';
import { Footer } from '@/components/layout/Footer';
import { BlogPostData } from '@/components/features/types/blogPost';
import { allPosts } from '@/data/blogPosts';

import { uxPrinciplesComplexSystemsData } from '@/data/uxPrinciplesComplexSystems';
import { chosenFewPicnicData } from '@/data/chosenFewPicnic';
import { designSystemsScaleData } from '@/data/designSystemsScale';
import { accessibilityBasicsData } from '@/data/accessibilityBasics';
import { chicagoDesignCommunityData } from '@/data/chicagoDesignCommunity';
import { elixirForDesignersData } from '@/data/elixirForDesigners';
import { growingup104thparnellpart1Data } from '@/data/growing-up-104th-parnell-part-1';
import { eventStormsTmsData } from '@/data/eventStormsTms';

const blogPostDataMap: Record<string, BlogPostData> = {
  'ux-principles-complex-systems':    uxPrinciplesComplexSystemsData,
  'chosen-few-picnic':                chosenFewPicnicData,
  'design-systems-scale':             designSystemsScaleData,
  'accessibility-basics':             accessibilityBasicsData,
  'chicago-design-community':         chicagoDesignCommunityData,
  'elixir-for-designers':             elixirForDesignersData,
  'growing-up-104th-parnell-part-1':  growingup104thparnellpart1Data,
  'event-storms-tms':                 eventStormsTmsData,
};

const sortedSlugs = [...allPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map(p => p.slug)
  .filter(s => blogPostDataMap[s]);

export async function generateStaticParams() {
  return Object.keys(blogPostDataMap).map(slug => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CRAFT_CATEGORIES = new Set(['UX Design', 'Design Systems', 'Accessibility', 'Development']);

export default function BlogPostPage({ params }: PageProps) {
  const { slug } = use(params);
  const post = blogPostDataMap[slug];
  if (!post) notFound();

  const track = CRAFT_CATEGORIES.has(post.category) ? 'Craft' : 'Chicago & life';

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

  // Next post
  const idx = sortedSlugs.indexOf(slug);
  const nextSlug = sortedSlugs[(idx + 1) % sortedSlugs.length];
  const nextPost = blogPostDataMap[nextSlug];

  return (
    <div className="min-h-screen bg-bone-50">

      <ReadingProgress />

      {/* Hero */}
      <div className="col pt-12 pb-10 border-b border-black/[0.07]">
        {/* Track + meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-brass bg-brass/10 px-2 py-0.5 rounded-[2px]">
            {track}
          </span>
          <span className="font-mono text-[11px] text-ink/35">{fmtDate(post.date)}</span>
          <span className="font-mono text-[11px] text-ink/35">·</span>
          <span className="font-mono text-[11px] text-ink/35">{post.readTime}</span>
        </div>

        {/* Title */}
        <h1
          className="font-black leading-[1.08] tracking-[-0.025em] text-ink mb-6"
          style={{ fontSize: 'clamp(32px, 5vw, 60px)', maxWidth: '760px' }}
        >
          {post.title}
        </h1>

        {/* Dek */}
        <p className="text-[20px] leading-[1.6] text-ink/60 max-w-[640px] mb-10">
          {post.excerpt}
        </p>

        {/* Author row */}
        <div className="flex items-center gap-3 pt-5 border-t border-black/[0.07]">
          <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-bone-50 text-[12px] font-bold shrink-0">
            BH
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink leading-tight">Brian Hall</div>
            <div className="font-mono text-[11px] text-ink/40">Senior Software Engineer · M.S. HCI</div>
          </div>
        </div>
      </div>

      {/* Reading body — narrow column */}
      <div style={{ maxWidth: '680px' }} className="mx-auto px-8 py-12">

        {post.content ? (
          <MarkdownRenderer content={post.content} />
        ) : (
          <p className="text-[18px] leading-[1.75] text-ink/80">{post.excerpt}</p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-10 mt-10 border-t border-black/[0.07]">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-[11px] text-ink/50 border border-ink/15 rounded-[2px] px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Back + Next */}
        <div className="mt-12 pt-8 border-t border-black/[0.07] flex flex-col gap-4">
          <Link
            href="/blog"
            className="font-mono text-[12px] text-ink/40 hover:text-brass transition-colors duration-150"
          >
            ← All writing
          </Link>

          {nextPost && (
            <Link
              href={`/blog/${nextSlug}`}
              className="group bg-bone-100 border border-black/[0.07] rounded-[3px] p-6 flex items-center justify-between gap-4 no-underline hover:bg-white transition-colors duration-200"
            >
              <div>
                <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink/35 mb-2">
                  Next essay
                </p>
                <p className="text-[16px] font-bold text-ink group-hover:text-brass transition-colors duration-150 leading-snug">
                  {nextPost.title}
                </p>
              </div>
              <span className="font-mono text-[14px] text-brass shrink-0">→</span>
            </Link>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}
