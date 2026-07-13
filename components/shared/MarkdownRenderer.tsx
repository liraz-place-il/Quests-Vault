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
        'prose-headings:text-[#f3eff8] prose-headings:font-semibold',
        'prose-p:text-[#c9c5d4] prose-p:leading-relaxed',
        'prose-a:text-[#3091ff] prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-[#f3eff8]',
        'prose-code:text-[#ff30c2] prose-code:bg-[rgba(255,48,194,0.08)] prose-code:px-1 prose-code:rounded',
        'prose-pre:bg-[#141e47] prose-pre:border prose-pre:border-[rgba(243,239,248,0.08)]',
        'prose-blockquote:border-l-[#3091ff] prose-blockquote:text-[#c9c5d4]',
        'prose-hr:border-[rgba(243,239,248,0.08)]',
        'prose-ul:text-[#c9c5d4] prose-ol:text-[#c9c5d4]',
        'prose-li:marker:text-[#3091ff]',
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
