'use client';

import { motion } from 'framer-motion';
import { Calendar, Hash, ChevronRight, User } from 'lucide-react';
import { QuestStatusBadge } from './QuestStatusBadge';
import { useUIStore } from '@/store/ui.store';
import { formatDateRange, truncate } from '@/lib/utils';
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
      className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#121826] p-4 card-hover cursor-pointer"
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
      <p className="text-[#F3F4F6] font-semibold text-sm leading-snug mb-2">{title}</p>

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
    </motion.div>
  );
}
