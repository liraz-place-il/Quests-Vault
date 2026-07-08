'use client';

import { motion } from 'framer-motion';
import { Calendar, Hash, ChevronRight, User, ExternalLink, Clock, Send } from 'lucide-react';
import { QuestStatusBadge } from './QuestStatusBadge';
import { useUIStore } from '@/store/ui.store';
import { formatDateRange, truncate, isExpiredStatus, LATE_SUBMISSION_HINT } from '@/lib/utils';
import type { Quest } from '@/types';

interface Props {
  quest: Quest;
  index?: number;
}

export function QuestCard({ quest, index = 0 }: Props) {
  const { openQuestDrawer, locale } = useUIStore();

  const title = (locale === 'he' && quest.titleHe) ? quest.titleHe : quest.title;
  const description = (locale === 'he' && quest.descriptionHe) ? quest.descriptionHe : quest.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={() => openQuestDrawer(quest)}
      className="rounded-xl border border-[rgba(243,239,248,0.07)] bg-[#0d1638] p-4 card-hover cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openQuestDrawer(quest)}
      aria-label={`Open quest ${quest.questNumber}: ${title}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#6B7280] text-xs font-mono">{quest.questNumber}</span>
        <div className="flex items-center gap-2">
          <QuestStatusBadge status={quest.status} size="sm" />
          <ChevronRight className="h-3.5 w-3.5 text-[#6B7280]" />
        </div>
      </div>

      {/* Title */}
      <p className="text-[#f3eff8] font-semibold text-sm leading-snug mb-2">{title}</p>

      {/* Description */}
      {description && (
        <p className="text-[#6B7280] text-xs leading-relaxed mb-3">{truncate(description, 120)}</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6B7280]">
        <span className="flex items-center gap-1">
          <Calendar className="h-2.5 w-2.5" />
          {formatDateRange(quest.startDate, quest.endDate)}
        </span>
        <span className="flex items-center gap-1">
          <Hash className="h-2.5 w-2.5" />
          {quest.assetCount} asset{quest.assetCount !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1">
          <User className="h-2.5 w-2.5" />
          {quest.creatorName}
        </span>
      </div>

      {/* Footer actions */}
      {(quest.detailsUrl || quest.submissionUrl) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(243,239,248,0.05)]">
          {quest.detailsUrl && (
            <a
              href={quest.detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#3091ff] hover:underline"
            >
              More details
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {quest.submissionUrl && (() => {
            const expired = isExpiredStatus(quest.status);
            return (
              <a
                href={quest.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={expired ? LATE_SUBMISSION_HINT : undefined}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium ms-auto"
                style={
                  expired
                    ? {
                        background: 'rgba(255, 176, 32, 0.1)',
                        color: '#FFB020',
                        border: '1px solid rgba(255, 176, 32, 0.3)',
                      }
                    : {
                        background: 'rgba(48, 145, 255, 0.1)',
                        color: '#3091ff',
                        border: '1px solid rgba(48, 145, 255, 0.3)',
                      }
                }
              >
                {expired ? <Clock className="h-3 w-3" /> : <Send className="h-3 w-3" />}
                {expired ? 'Late Submission' : 'Submit'}
              </a>
            );
          })()}
        </div>
      )}
    </motion.div>
  );
}
