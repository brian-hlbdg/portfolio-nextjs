'use client';

import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
            {children}
          </h3>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed my-6">
            {children}
          </p>
        ),

        // Bold & Italic
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-white">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-700 dark:text-slate-200">{children}</em>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="space-y-2 my-6 ml-6">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-2 my-6 ml-6 list-decimal">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-600 dark:text-slate-300 leading-relaxed flex items-start gap-3">
            <span className="text-orange-500 mt-2 flex-shrink-0">•</span>
            <span>{children}</span>
          </li>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-orange-500 pl-6 py-2 my-8 bg-gray-50 dark:bg-slate-800/50 rounded-r-lg">
            <div className="text-gray-700 dark:text-slate-200 italic">{children}</div>
          </blockquote>
        ),

        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-8">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-100 dark:bg-slate-800">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
            {children}
          </td>
        ),

        // Horizontal Rule
        hr: () => (
          <hr className="border-gray-200 dark:border-slate-700 my-12" />
        ),
        // Links
        a: ({ href, children }: { href?: string; children?: ReactNode }) => (
          <a
            href={href}
            className="text-orange-500 hover:text-orange-400 underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),

        // Code
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-sm font-mono text-orange-500">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="p-4 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-x-auto my-6">
            {children}
          </pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>  
  );
}