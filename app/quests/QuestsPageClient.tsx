'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuests } from '@/hooks/useQuests';
import { useIsMobile } from '@/hooks/useIsMobile';
import { QuestTable } from '@/components/quest/QuestTable';
import { QuestCard } from '@/components/quest/QuestCard';
import { QuestFilters } from '@/components/quest/QuestFilters';
import { SkeletonQuestRow, SkeletonQuestCard } from '@/components/shared/SkeletonCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import type { QuestStatus, QuestListParams } from '@/types';

const PAGE_SIZE = 20;

export function QuestsPageClient() {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<QuestStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const params: QuestListParams = {
    page,
    pageSize: PAGE_SIZE,
    search,
    status,
    sortBy: 'questNumber',
    sortDir: 'asc',
  };

  const { data, isLoading, isError } = useQuests(params);

  const quests = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handleStatus = useCallback((v: QuestStatus | 'all') => {
    setStatus(v);
    setPage(1);
  }, []);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-[#f3eff8] mb-1"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Quest{' '}
          <span className="gradient-text">Vault</span>
        </motion.h1>
        <p className="text-sm text-[#c9c5d4] leading-relaxed max-w-xl">
          Your way to enhance your experience — every cycle we spotlight the best
          submission on{' '}
          <span className="font-semibold text-[#3091ff]">LinkedIn</span> ✨
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-[57px] z-20 py-3 -mx-4 px-4 md:-mx-6 md:px-6"
        style={{
          background: 'rgba(8,14,44,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(243,239,248,0.04)',
        }}
      >
        <QuestFilters
          search={search}
          onSearchChange={handleSearch}
          status={status}
          onStatusChange={handleStatus}
        />
      </div>

      {/* Content */}
      {isError ? (
        <EmptyState
          title="Failed to load quests"
          description="Check your Airtable configuration and try again."
          icon={<Inbox className="h-12 w-12" />}
        />
      ) : isLoading ? (
        isMobile ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonQuestCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-0 rounded-xl border border-[rgba(243,239,248,0.06)] overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonQuestRow key={i} />)}
          </div>
        )
      ) : quests.length === 0 ? (
        <EmptyState
          title="No quests found"
          description={search ? `No results for "${search}"` : 'No quests match the current filter.'}
          icon={<Inbox className="h-12 w-12" />}
        />
      ) : isMobile ? (
        <div className="grid gap-3">
          {quests.map((q, i) => <QuestCard key={q.id} quest={q} index={i} />)}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <QuestTable quests={quests} />
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#a9a4b8]">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-[#a9a4b8] hover:text-[#f3eff8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ background: 'rgba(243,239,248,0.04)', border: '1px solid rgba(243,239,248,0.06)' }}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-[#a9a4b8] hover:text-[#f3eff8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ background: 'rgba(243,239,248,0.04)', border: '1px solid rgba(243,239,248,0.06)' }}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
