'use client';

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
        h1: ({ children }) => null, // title is in the page header

        h2: ({ children }) => (
          <h2 className="text-[28px] font-extrabold tracking-[-0.015em] text-ink leading-snug mt-12 mb-4">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="text-[20px] font-bold tracking-[-0.01em] text-ink leading-snug mt-8 mb-3">
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className="text-[18px] leading-[1.75] text-ink/80 my-6">
            {children}
          </p>
        ),

        blockquote: ({ children }) => (
          <blockquote className="my-10 pl-8 border-l-[3px] border-brass bg-[color-mix(in_oklch,var(--color-brass)_5%,var(--color-bone-50))] py-6 pr-6 rounded-r-[2px]">
            <div className="text-[22px] font-bold leading-[1.4] tracking-[-0.01em] text-ink [&>p]:my-0 [&>p]:text-[22px] [&>p]:leading-[1.4] [&>p]:text-ink [&>p]:font-bold">
              {children}
            </div>
          </blockquote>
        ),

        ul: ({ children }) => (
          <ul className="my-6 flex flex-col gap-3 pl-0 list-none">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="my-6 flex flex-col gap-3 pl-6 list-decimal marker:text-brass marker:font-mono marker:text-[14px]">
            {children}
          </ol>
        ),

        li: ({ children }) => (
          <li className="text-[17px] leading-[1.65] text-ink/75 flex gap-3 items-start [ol_&]:pl-2 [ul_&]:before:content-['—'] [ul_&]:before:text-brass [ul_&]:before:font-mono [ul_&]:before:text-[14px] [ul_&]:before:mt-[3px] [ul_&]:before:shrink-0">
            <span>{children}</span>
          </li>
        ),

        strong: ({ children }) => (
          <strong className="font-bold text-ink">{children}</strong>
        ),

        em: ({ children }) => (
          <em className="italic text-ink/70">{children}</em>
        ),

        code: ({ children, className }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return (
              <code className="block font-mono text-[14px] leading-[1.6] text-ink/85 bg-bone-100 border border-black/[0.07] rounded-[3px] p-5 overflow-x-auto my-6 whitespace-pre">
                {children}
              </code>
            );
          }
          return (
            <code className="font-mono text-[14px] text-brass bg-bone-100 px-1.5 py-0.5 rounded-[2px]">
              {children}
            </code>
          );
        },

        pre: ({ children }) => (
          <pre className="my-6">{children}</pre>
        ),

        hr: () => (
          <hr className="my-12 border-t border-black/10" />
        ),

        a: ({ href, children }) => (
          <a
            href={href}
            className="text-brass underline underline-offset-2 hover:text-ink transition-colors duration-150"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),

        img: ({ src, alt }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ''}
            className="w-full rounded-[3px] my-8 border border-black/[0.07]"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
