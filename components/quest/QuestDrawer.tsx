'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, ExternalLink, Clock, Send } from 'lucide-react';
import { QuestStatusBadge } from './QuestStatusBadge';
import { useUIStore } from '@/store/ui.store';
import { useT } from '@/hooks/useT';
import { formatDateRange, isLateStatus } from '@/lib/utils';

export function QuestDrawer() {
  const { activeQuest, isQuestDrawerOpen, closeQuestDrawer, locale } = useUIStore();
  const t = useT();
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
  const late = activeQuest ? isLateStatus(activeQuest.status) : false;

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
              className="flex items-start justify-between px-6 pt-7 pb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(255,48,194,0.05), rgba(48,145,255,0.05))',
              }}
            >
              <div className="flex-1 min-w-0 me-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-[#a9a4b8] text-xs font-mono tracking-wide">{activeQuest.questNumber}</span>
                  <QuestStatusBadge status={activeQuest.status} size="sm" />
                </div>
                <h2 className="text-[#f3eff8] font-semibold text-2xl leading-snug tracking-tight">{title}</h2>
              </div>
              <button
                ref={closeRef}
                onClick={closeQuestDrawer}
                className="p-2 rounded-full text-[#a9a4b8] hover:text-[#f3eff8] hover:bg-[rgba(243,239,248,0.06)] transition-colors shrink-0"
                aria-label={t('drawer.close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Meta */}
            <div className="px-6 py-4 border-t border-b border-[rgba(243,239,248,0.05)] flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#a9a4b8]">
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 opacity-70" />
                {formatDateRange(activeQuest.startDate, activeQuest.endDate)}
              </span>
              <span className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 opacity-70" />
                {activeQuest.creatorLinkedin ? (
                  <a
                    href={activeQuest.creatorLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3091ff] hover:underline"
                  >
                    {activeQuest.creatorName}
                  </a>
                ) : (
                  activeQuest.creatorName
                )}
              </span>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {/* Description */}
              {description && (
                <div className="px-6 py-6">
                  <p className="text-[#c9c5d4] text-[15px] leading-relaxed">{description}</p>
                </div>
              )}

              {/* Late submission hint */}
              {late && activeQuest.submissionUrl && (
                <div className="px-6 pb-4">
                  <div
                    className="rounded-2xl px-4 py-3.5 text-[13px] leading-relaxed"
                    style={{
                      background: 'rgba(255, 176, 32, 0.07)',
                      border: '1px solid rgba(255, 176, 32, 0.2)',
                      color: '#FFB020',
                    }}
                  >
                    {t('hint.lateSubmission')}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky action footer */}
            {(activeQuest.detailsUrl || activeQuest.submissionUrl) && (
              <div
                className="px-6 py-5 border-t border-[rgba(243,239,248,0.06)] flex flex-col gap-3"
                style={{ background: 'rgba(8,14,44,0.6)', backdropFilter: 'blur(12px)' }}
              >
                {activeQuest.submissionUrl && (
                  <a
                    href={activeQuest.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
                    style={
                      late
                        ? {
                            background: 'rgba(255, 176, 32, 0.12)',
                            color: '#FFB020',
                            border: '1px solid rgba(255, 176, 32, 0.35)',
                          }
                        : {
                            background: 'linear-gradient(135deg, #ff30c2, #3091ff)',
                            color: '#fff',
                            boxShadow: '0 4px 20px rgba(255,48,194,0.25)',
                          }
                    }
                  >
                    {late ? <Clock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                    {late ? t('action.lateSubmission') : t('drawer.register')}
                  </a>
                )}
                {activeQuest.detailsUrl && (
                  <a
                    href={activeQuest.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
                    style={{
                      background: 'rgba(48, 145, 255, 0.1)',
                      color: '#3091ff',
                      border: '1px solid rgba(48, 145, 255, 0.3)',
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('drawer.details')}
                  </a>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
