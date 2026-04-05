/**
 * src/hooks/useBearsNews.ts
 * ========================================================================
 * Fetches latest Bears news from ESPN news API.
 *
 * Pattern mirrors useTeamLeaders.ts:
 * - 8-second timeout via Promise.race
 * - Falls back to hardcoded off-season headlines when API is blocked/unavailable
 * - Returns source: 'live' | 'fallback' for UI indicator
 *
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ========================================================================
// TYPES
// ========================================================================

export interface BearsNewsArticle {
  id: string;
  headline: string;
  description: string;
  published: string; // ISO 8601
  imageUrl: string | null;
  articleUrl: string;
  byline: string | null;
  isPremium: boolean;
}

export interface UseBearsNewsReturn {
  articles: BearsNewsArticle[];
  loading: boolean;
  error: string | null;
  source: 'live' | 'fallback';
  refetch: () => Promise<void>;
}

// ========================================================================
// ESPN API RESPONSE TYPES
// ========================================================================

interface ESPNNewsImage {
  url?: string;
  name?: string;
  alt?: string;
}

interface ESPNNewsLinks {
  web?: { href?: string };
  mobile?: { href?: string };
}

interface ESPNNewsArticle {
  id?: string;
  headline?: string;
  description?: string;
  published?: string;
  lastModified?: string;
  byline?: string;
  premium?: boolean;
  type?: string;
  images?: ESPNNewsImage[];
  links?: ESPNNewsLinks;
}

interface ESPNNewsResponse {
  articles?: ESPNNewsArticle[];
  header?: string;
}

// ========================================================================
// CONSTANTS
// ========================================================================

const ESPN_NEWS_URL =
  'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?team=chi&limit=8';

const FETCH_TIMEOUT_MS = 8000;

const FALLBACK_ARTICLES: BearsNewsArticle[] = [
  {
    id: 'fallback-1',
    headline: 'Bears set sights on building around Caleb Williams in 2025',
    description:
      'Chicago enters the offseason focused on surrounding their franchise quarterback with weapons after a tough Year 1.',
    published: '2025-02-01T12:00:00Z',
    imageUrl: null,
    articleUrl: 'https://www.espn.com/nfl/team/_/name/chi/chicago-bears',
    byline: 'ESPN Staff',
    isPremium: false,
  },
  {
    id: 'fallback-2',
    headline: "Bears' 2025 NFL Draft: Chicago holds multiple early picks",
    description:
      'General Manager Ryan Poles has significant draft capital to reshape the roster heading into the 2025 NFL Draft.',
    published: '2025-03-15T12:00:00Z',
    imageUrl: null,
    articleUrl: 'https://www.espn.com/nfl/team/_/name/chi/chicago-bears',
    byline: 'ESPN Staff',
    isPremium: false,
  },
  {
    id: 'fallback-3',
    headline: 'Free agency targets: Bears look to upgrade offensive line',
    description:
      'Chicago is expected to prioritize protecting Caleb Williams in free agency after the offensive line struggled in 2025.',
    published: '2025-03-10T12:00:00Z',
    imageUrl: null,
    articleUrl: 'https://www.espn.com/nfl/team/_/name/chi/chicago-bears',
    byline: 'ESPN Staff',
    isPremium: false,
  },
  {
    id: 'fallback-4',
    headline: "Montez Sweat named one of Bears' defensive cornerstones",
    description:
      "The pass rusher's 7.5-sack 2025 season has Chicago confident in building their defensive front around him.",
    published: '2025-02-20T12:00:00Z',
    imageUrl: null,
    articleUrl: 'https://www.espn.com/nfl/team/_/name/chi/chicago-bears',
    byline: 'ESPN Staff',
    isPremium: false,
  },
];

// ========================================================================
// PARSING
// ========================================================================

function parseArticle(raw: ESPNNewsArticle): BearsNewsArticle | null {
  if (!raw.id || !raw.headline) return null;

  const image = raw.images?.find((img) => img.url) ?? null;
  const articleUrl = raw.links?.web?.href ?? 'https://www.espn.com/nfl/team/_/name/chi';

  return {
    id: raw.id,
    headline: raw.headline,
    description: raw.description ?? '',
    published: raw.published ?? new Date().toISOString(),
    imageUrl: image?.url ?? null,
    articleUrl,
    byline: raw.byline ?? null,
    isPremium: raw.premium ?? false,
  };
}

// ========================================================================
// HOOK
// ========================================================================

export function useBearsNews(): UseBearsNewsReturn {
  const [articles, setArticles] = useState<BearsNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'fallback'>('fallback');

  const fetchNews = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), FETCH_TIMEOUT_MS)
      );

      const response = await Promise.race([
        fetch(ESPN_NEWS_URL),
        timeoutPromise,
      ]);

      if (!response.ok) {
        throw new Error(`ESPN news API returned ${response.status}`);
      }

      const data = (await response.json()) as ESPNNewsResponse;
      const parsed = (data.articles ?? [])
        .map(parseArticle)
        .filter((a): a is BearsNewsArticle => a !== null);

      if (parsed.length > 0) {
        setArticles(parsed);
        setSource('live');
      } else {
        throw new Error('No articles in response');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.warn(`[useBearsNews] Fetch failed: ${msg} — using fallback data`);
      setArticles(FALLBACK_ARTICLES);
      setSource('fallback');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNews();
  }, [fetchNews]);

  return { articles, loading, error, source, refetch: fetchNews };
}

export default useBearsNews;
