/**
 * src/components/features/dashboard/bears/sections/TeamNewsSection.tsx
 * ========================================================================
 * Renders latest Bears news from ESPN as an article card grid.
 *
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import React from 'react';
import { useBearsNews, BearsNewsArticle } from '@/hooks/useBearsNews';

// ========================================================================
// HELPERS
// ========================================================================

function formatPublishedDate(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

// ========================================================================
// ARTICLE CARD
// ========================================================================

interface ArticleCardProps {
  article: BearsNewsArticle;
}

function ArticleCard({ article }: ArticleCardProps): React.ReactElement {
  return (
    <a
      href={article.articleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 hover:border-orange-500/40 hover:bg-slate-800/60 transition-colors"
    >
      {/* Thumbnail */}
      {article.imageUrl && (
        <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.headline}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      {!article.imageUrl && (
        <div className="flex-shrink-0 w-20 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-orange-500/40">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
          {article.headline}
          {article.isPremium && (
            <span className="ml-1.5 inline-block px-1 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-400 rounded align-middle">
              ESPN+
            </span>
          )}
        </h3>
        {article.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        )}
        <p className="text-xs text-slate-500 mt-2">
          {article.byline && <span>{article.byline} · </span>}
          {formatPublishedDate(article.published)}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 flex items-center text-slate-600 group-hover:text-orange-400 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </a>
  );
}

// ========================================================================
// SKELETON
// ========================================================================

function NewsCardSkeleton(): React.ReactElement {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 animate-pulse">
      <div className="flex-shrink-0 w-20 h-16 rounded-lg bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-2/3" />
      </div>
    </div>
  );
}

// ========================================================================
// MAIN SECTION
// ========================================================================

export default function TeamNewsSection(): React.ReactElement {
  const { articles, loading, source } = useBearsNews();

  return (
    <section aria-label="Bears Team News">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Team News &amp; Updates</h2>
        <div className="flex items-center gap-2">
          {!loading && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                source === 'live'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {source === 'live' ? 'Live' : 'Cached'}
            </span>
          )}
          <a
            href="https://www.espn.com/nfl/team/_/name/chi/chicago-bears"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            All Bears News →
          </a>
        </div>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <NewsCardSkeleton key={i} />)
          : articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
      </div>

      {!loading && articles.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-8">
          No news articles available right now.
        </p>
      )}
    </section>
  );
}
