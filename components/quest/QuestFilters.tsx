'use client';

import { Search, X } from 'lucide-react';
import { useT } from '@/hooks/useT';
import type { TranslationKey } from '@/lib/i18n';
import type { QuestStatus } from '@/types';

const STATUS_OPTIONS: { labelKey: TranslationKey; value: QuestStatus | 'all' }[] = [
  { labelKey: 'filter.all', value: 'all' },
  { labelKey: 'status.active', value: 'Active' },
  { labelKey: 'status.pending', value: 'Pending' },
  { labelKey: 'status.completed', value: 'Completed' },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  status: QuestStatus | 'all';
  onStatusChange: (v: QuestStatus | 'all') => void;
}

export function QuestFilters({ search, onSearchChange, status, onStatusChange }: Props) {
  const t = useT();
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-subtle" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('filter.searchPlaceholder')}
          className="w-full rounded-lg py-2 ps-9 pe-9 text-sm bg-card border border-input text-foreground placeholder:text-subtle outline-none focus:border-brand transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground"
            aria-label={t('filter.clearSearch')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-0.5 sm:pb-0">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? 'border-brand bg-brand text-on-brand'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-line-strong'
              }`}
            >
              {t(opt.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
