'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, ExternalLink, Clock, Send } from 'lucide-react';
import { QuestStatusBadge } from './QuestStatusBadge';
import { useUIStore } from '@/store/ui.store';
import { useT } from '@/hooks/useT';
import { formatDateRange, isLateStatus } from '@/lib/utils';

export function QuestDrawer() {
  const { activeQuest, isQuestDrawerOpen, closeQuestDrawer, locale, direction } = useUIStore();
  // Panel slides in from the inline-end edge (right in LTR, left in RTL)
  const offscreenX = direction === 'rtl' ? '-100%' : '100%';
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
            className="fixed inset-0 z-40 bg-scrim/75"
            onClick={closeQuestDrawer}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Quest: ${title}`}
            initial={{ x: offscreenX }}
            animate={{ x: 0 }}
            exit={{ x: offscreenX }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed end-0 top-0 bottom-0 z-50 w-full max-w-[520px] flex flex-col overflow-hidden bg-background border-s border-border"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-7 pb-6 bg-card">
              <div className="flex-1 min-w-0 me-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-subtle text-xs font-mono tracking-wide">{activeQuest.questNumber}</span>
                  <QuestStatusBadge status={activeQuest.status} size="sm" />
                </div>
                <h2 className="font-heading text-foreground font-bold text-2xl leading-snug m-0">{title}</h2>
              </div>
              <button
                ref={closeRef}
                onClick={closeQuestDrawer}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors shrink-0"
                aria-label={t('drawer.close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Meta */}
            <div className="px-6 py-4 border-t border-b border-border flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
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
                    className="text-foreground underline decoration-brand underline-offset-4 hover:text-brand"
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
                  <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
                </div>
              )}

              {/* Late submission hint */}
              {late && activeQuest.submissionUrl && (
                <div className="px-6 pb-4">
                  <div className="rounded-xl border border-line-strong bg-card px-4 py-3.5 text-sm leading-relaxed text-foreground">
                    {t('hint.lateSubmission')}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky action footer */}
            {(activeQuest.detailsUrl || activeQuest.submissionUrl) && (
              <div
                className="px-6 py-5 border-t border-border bg-card flex flex-col gap-3"
              >
                {activeQuest.submissionUrl && (
                  <a
                    href={activeQuest.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition-colors duration-150 active:scale-[0.98] ${
                      late
                        ? 'border-line-strong text-foreground hover:bg-foreground/5'
                        : 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:border-primary-hover'
                    }`}
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
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line-strong px-5 py-3 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-foreground/5 active:scale-[0.98]"
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
