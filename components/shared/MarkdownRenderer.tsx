import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { detectDirection } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: Props) {
  const dir = detectDirection(content);

  return (
    <div
      dir={dir}
      className={cn(
        'prose prose-sm max-w-none',
        'prose-invert',
        'prose-headings:text-[#F3F4F6] prose-headings:font-semibold',
        'prose-p:text-[#9CA3AF] prose-p:leading-relaxed',
        'prose-a:text-[#3CF2FF] prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-[#F3F4F6]',
        'prose-code:text-[#FF00D4] prose-code:bg-[rgba(255,0,212,0.08)] prose-code:px-1 prose-code:rounded',
        'prose-pre:bg-[#1a2235] prose-pre:border prose-pre:border-[rgba(255,255,255,0.08)]',
        'prose-blockquote:border-l-[#A100FF] prose-blockquote:text-[#9CA3AF]',
        'prose-hr:border-[rgba(255,255,255,0.08)]',
        'prose-ul:text-[#9CA3AF] prose-ol:text-[#9CA3AF]',
        'prose-li:marker:text-[#A100FF]',
        dir === 'rtl' && 'text-right',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
