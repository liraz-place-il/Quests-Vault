import { cn } from '@/lib/utils';

interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-[#a9a4b8] opacity-60">
          {icon}
        </div>
      )}
      <p className="text-[#f3eff8] font-medium text-base mb-1">{title}</p>
      {description && (
        <p className="text-[#a9a4b8] text-sm max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
