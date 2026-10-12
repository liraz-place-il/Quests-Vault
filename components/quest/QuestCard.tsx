'use client';

import { motion } from 'framer-motion';
import { Calendar, ChevronRight, User, ExternalLink, Clock, Send } from 'lucide-react';
import { QuestStatusBadge } from './QuestStatusBadge';
import { useUIStore } from '@/store/ui.store';
import { useT } from '@/hooks/useT';
import { formatDateRange, truncate, isLateStatus } from '@/lib/utils';
import type { Quest } from '@/types';

interface Props {
  quest: Quest;
  index?: number;
}

export function QuestCard({ quest, index = 0 }: Props) {
  const { openQuestDrawer, locale } = useUIStore();
  const t = useT();

  const title = (locale === 'he' && quest.titleHe) ? quest.titleHe : quest.title;
  const description = (locale === 'he' && quest.descriptionHe) ? quest.descriptionHe : quest.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={() => openQuestDrawer(quest)}
      className="rounded-2xl border border-border bg-card p-5 card-hover cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openQuestDrawer(quest)}
      aria-label={`Open quest ${quest.questNumber}: ${title}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-subtle text-xs font-mono">{quest.questNumber}</span>
        <div className="flex items-center gap-2">
          <QuestStatusBadge status={quest.status} size="sm" />
          <ChevronRight className="h-3.5 w-3.5 text-subtle rtl:-scale-x-100" />
        </div>
      </div>

      {/* Title */}
      <p className="text-foreground font-medium text-base leading-snug mb-2">{title}</p>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{truncate(description, 120)}</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-subtle">
        <span className="flex items-center gap-1">
          <Calendar className="h-2.5 w-2.5" />
          {formatDateRange(quest.startDate, quest.endDate)}
        </span>
        <span className="flex items-center gap-1">
          <User className="h-2.5 w-2.5" />
          {quest.creatorName}
        </span>
      </div>

      {/* Footer actions */}
      {(quest.detailsUrl || quest.submissionUrl) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          {quest.detailsUrl && (
            <a
              href={quest.detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline decoration-brand underline-offset-4 hover:text-brand"
            >
              {t('card.moreDetails')}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {quest.submissionUrl && (() => {
            const late = isLateStatus(quest.status);
            return (
              <a
                href={quest.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={late ? t('hint.lateSubmission') : undefined}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium ms-auto transition-colors ${
                  late
                    ? 'border-line-strong text-foreground hover:bg-foreground/5'
                    : 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:border-primary-hover'
                }`}
              >
                {late ? <Clock className="h-3 w-3" /> : <Send className="h-3 w-3" />}
                {late ? t('action.lateSubmission') : t('action.submit')}
              </a>
            );
          })()}
        </div>
      )}
    </motion.div>
  );
}
