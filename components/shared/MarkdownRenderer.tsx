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
        'prose-headings:text-foreground prose-headings:font-heading prose-headings:font-bold',
        'prose-p:text-muted-foreground prose-p:leading-relaxed',
        'prose-a:text-foreground prose-a:underline prose-a:decoration-brand prose-a:underline-offset-4 hover:prose-a:text-brand',
        'prose-strong:text-foreground',
        'prose-code:text-brand prose-code:bg-brand/10 prose-code:px-1 prose-code:rounded',
        'prose-pre:bg-popover prose-pre:border prose-pre:border-border prose-pre:overflow-x-auto',
        'prose-blockquote:border-s-brand prose-blockquote:text-muted-foreground',
        'prose-hr:border-border',
        'prose-ul:text-muted-foreground prose-ol:text-muted-foreground',
        'prose-li:marker:text-brand',
        'text-start',
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
