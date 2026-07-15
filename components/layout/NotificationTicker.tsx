'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { useQuests } from '@/hooks/useQuests';
import { useUIStore } from '@/store/ui.store';
import { useT } from '@/hooks/useT';
import type { Quest } from '@/types';

/** Evergreen promo lines; one is picked per session and runs in the ticker. */
const PROMO_LABELS = [
  'Build like a pro, deliver like an expert. Submit your Quest and get professional feedback.',
  'Bridge the gap to the industry. Tackle real-world challenges, submit your Quest, and get expert feedback.',
  'Solve industry-level problems. Submit your Quest, get expert feedback, and win the LinkedIn spotlight!',
];

function questLabel(quest: Quest, locale: 'en' | 'he'): string {
  return locale === 'he' && quest.titleHe ? quest.titleHe : quest.title;
}

export function NotificationTicker() {
  const { data } = useQuests({ pageSize: 100 });
  const { openQuestDrawer, locale } = useUIStore();
  const t = useT();

  // Pick one promo line per session (stable until a full reload). Chosen after
  // mount so Math.random() can't cause an SSR/client hydration mismatch.
  const [promo, setPromo] = useState<string | null>(null);
  useEffect(() => {
    setPromo(PROMO_LABELS[Math.floor(Math.random() * PROMO_LABELS.length)]);
  }, []);

  const quests = data?.data ?? [];

  const activeQuests = useMemo(
    () => quests.filter((q) => q.status?.toLowerCase() === 'active'),
    [quests]
  );
  const pendingQuests = useMemo(
    () => quests.filter((q) => q.status?.toLowerCase() === 'pending'),
    [quests]
  );

  // Active takes total priority — never show Pending while Active exists.
  const mode: 'active' | 'pending' | null =
    activeQuests.length > 0 ? 'active' : pendingQuests.length > 0 ? 'pending' : null;

  const shownQuests = mode === 'active' ? activeQuests : mode === 'pending' ? pendingQuests : [];

  const questMessages = shownQuests.map((q) =>
    mode === 'active'
      ? t('ticker.submit', { title: questLabel(q, locale) })
      : t('ticker.comingSoon', { title: questLabel(q, locale) })
  );

  // Promo line runs alongside the quest messages; on its own if no live quest.
  const messages = [...questMessages, ...(promo ? [promo] : [])];

  if (messages.length === 0) return null;

  const joined = messages.join('   •   ');
  const isClickable = mode === 'active';

  const handleClick = () => {
    if (isClickable) openQuestDrawer(activeQuests[0]);
  };

  const Icon = mode === 'active' ? Send : Sparkles;

  return (
    <div
      role={isClickable ? 'button' : 'status'}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={isClickable ? `${joined} — open quest details` : joined}
      className={`relative w-full overflow-hidden border-b border-[rgba(243,239,248,0.08)] py-2 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
      style={{
        background:
          mode === 'active'
            ? 'linear-gradient(90deg, rgba(255,48,194,0.16), rgba(48,145,255,0.16))'
            : 'linear-gradient(90deg, rgba(48,145,255,0.1), rgba(255,48,194,0.1))',
      }}
    >
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[0, 1].map((dupIndex) => (
          <div key={dupIndex} className="flex items-center gap-3 px-6" aria-hidden={dupIndex === 1}>
            <span
              className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full animate-pulse"
              style={{ background: mode === 'active' ? '#ff30c2' : '#3091ff' }}
            />
            <Icon
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: mode === 'active' ? '#ff30c2' : '#3091ff' }}
            />
            <span
              className="text-xs font-semibold tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #ff30c2, #3091ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {joined}
            </span>
            <span className="px-6 text-[#a9a4b8]/40">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
