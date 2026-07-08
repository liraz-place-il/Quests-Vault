'use client';

import { Search, X } from 'lucide-react';
import type { QuestStatus } from '@/types';

const STATUS_OPTIONS: { label: string; value: QuestStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Expired', value: 'Expired' },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  status: QuestStatus | 'all';
  onStatusChange: (v: QuestStatus | 'all') => void;
}

export function QuestFilters({ search, onSearchChange, status, onStatusChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search quests…"
          className="w-full rounded-lg py-2 ps-9 pe-9 text-sm bg-[rgba(243,239,248,0.04)] border border-[rgba(243,239,248,0.06)] text-[#f3eff8] placeholder:text-[#4B5563] outline-none focus:border-[rgba(48,145,255,0.4)] transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#9CA3AF]"
            aria-label="Clear search"
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
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(255,48,194,0.15), rgba(48,145,255,0.15))',
                      color: '#ff30c2',
                      border: '1px solid rgba(255,48,194,0.3)',
                    }
                  : {
                      background: 'rgba(243,239,248,0.03)',
                      color: '#6B7280',
                      border: '1px solid rgba(243,239,248,0.06)',
                    }
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
