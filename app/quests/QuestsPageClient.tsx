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
import { ChevronLeft, ChevronRight, ChevronDown, Inbox } from 'lucide-react';
import { useT } from '@/hooks/useT';
import type { QuestStatus, QuestListParams } from '@/types';

const PAGE_SIZE = 20;

export function QuestsPageClient() {
  const t = useT();
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
    sortDir: 'desc',
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
        <div className="mt-4 max-w-3xl space-y-3">
          <details
            open
            className="group rounded-xl border border-[rgba(243,239,248,0.08)] bg-[rgba(243,239,248,0.02)] px-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-base font-semibold text-[#f3eff8] [&::-webkit-details-marker]:hidden">
              {t('about.whatTitle')}
              <ChevronDown className="h-4 w-4 text-[#a9a4b8] transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="pb-4 text-sm text-[#c9c5d4] leading-relaxed">
              {t('about.whatBody')}
            </p>
          </details>

          <details
            open
            className="group rounded-xl border border-[rgba(243,239,248,0.08)] bg-[rgba(243,239,248,0.02)] px-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-base font-semibold text-[#f3eff8] [&::-webkit-details-marker]:hidden">
              {t('about.whyTitle')}
              <ChevronDown className="h-4 w-4 text-[#a9a4b8] transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ul className="space-y-2.5 pb-4">
              {[
                { lead: t('why.feedbackLead'), rest: <> {t('why.feedbackBody')}</> },
                { lead: t('why.portfolioLead'), rest: <> {t('why.portfolioBody')}</> },
                {
                  lead: t('why.spotlightLead'),
                  rest: (
                    <>
                      {' '}
                      {t('why.spotlightBefore')}
                      <a
                        href="https://www.linkedin.com/company/place-il/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#3091ff] hover:underline"
                      >
                        {t('why.spotlightLink')}
                      </a>
                      {t('why.spotlightAfter')}
                    </>
                  ),
                },
              ].map((item) => (
                <li
                  key={item.lead}
                  className="flex gap-2.5 text-sm text-[#c9c5d4] leading-relaxed"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #ff30c2, #3091ff)' }}
                    aria-hidden
                  />
                  <span>
                    <span className="font-semibold text-[#f3eff8]">{item.lead}</span>
                    {item.rest}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </div>
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
          title={t('error.loadTitle')}
          description={t('error.loadBody')}
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
          title={t('empty.title')}
          description={search ? t('empty.search', { query: search }) : t('empty.filter')}
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
            {t('pagination.info', { page, totalPages, total })}
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
