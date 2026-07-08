'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Hash, ExternalLink, Clock } from 'lucide-react';
import { QuestStatusBadge } from './QuestStatusBadge';
import { AssetGrid } from '@/components/asset/AssetGrid';
import { useUIStore } from '@/store/ui.store';
import { formatDateRange, isExpiredStatus } from '@/lib/utils';

export function QuestDrawer() {
  const { activeQuest, isQuestDrawerOpen, closeQuestDrawer, locale } = useUIStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuestDrawerOpen) closeQuestDrawer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isQuestDrawerOpen, closeQuestDrawer]);

  useEffect(() => {
    if (isQuestDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isQuestDrawerOpen]);

  const title = (locale === 'he' && activeQuest?.titleHe) ? activeQuest.titleHe : activeQuest?.title;
  const description = (locale === 'he' && activeQuest?.descriptionHe) ? activeQuest.descriptionHe : activeQuest?.description;

  return (
    <AnimatePresence>
      {isQuestDrawerOpen && activeQuest && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeQuestDrawer}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Quest: ${title}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[520px] flex flex-col overflow-hidden"
            style={{
              background: '#0a1030',
              borderLeft: '1px solid rgba(243,239,248,0.08)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between p-5 border-b border-[rgba(243,239,248,0.06)]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,48,194,0.04), rgba(48,145,255,0.04))',
              }}
            >
              <div className="flex-1 min-w-0 me-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#6B7280] text-xs font-mono">{activeQuest.questNumber}</span>
                  <QuestStatusBadge status={activeQuest.status} size="sm" />
                </div>
                <h2 className="text-[#f3eff8] font-semibold text-lg leading-snug">{title}</h2>
              </div>
              <button
                ref={closeRef}
                onClick={closeQuestDrawer}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#f3eff8] hover:bg-[rgba(243,239,248,0.05)] transition-colors shrink-0"
                aria-label="Close quest panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Meta */}
            <div className="px-5 py-3 border-b border-[rgba(243,239,248,0.04)] flex flex-wrap gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {formatDateRange(activeQuest.startDate, activeQuest.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-3 w-3" />
                {activeQuest.creatorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="h-3 w-3" />
                {activeQuest.assetCount} asset{activeQuest.assetCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Description */}
            {description && (
              <div className="px-5 py-4 border-b border-[rgba(243,239,248,0.04)]">
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{description}</p>
              </div>
            )}

            {/* Quest-level actions */}
            {(activeQuest.detailsUrl ||
              (isExpiredStatus(activeQuest.status) && activeQuest.lateSubmissionUrl)) && (
              <div className="px-5 py-3 border-b border-[rgba(243,239,248,0.04)] flex flex-wrap items-center gap-2">
                {activeQuest.detailsUrl && (
                  <a
                    href={activeQuest.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
                    style={{
                      background: 'rgba(48, 145, 255, 0.1)',
                      color: '#3091ff',
                      border: '1px solid rgba(48, 145, 255, 0.3)',
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    More details
                  </a>
                )}
                {isExpiredStatus(activeQuest.status) && activeQuest.lateSubmissionUrl && (
                  <a
                    href={activeQuest.lateSubmissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
                    style={{
                      background: 'rgba(255, 176, 32, 0.1)',
                      color: '#FFB020',
                      border: '1px solid rgba(255, 176, 32, 0.3)',
                    }}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Late Submission
                  </a>
                )}
              </div>
            )}

            {/* Assets */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
              <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wider mb-3">
                Assets
              </p>
              <AssetGrid questId={activeQuest.id} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
