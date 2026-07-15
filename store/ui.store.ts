'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Quest, Locale, Direction } from '@/types';

interface UIStore {
  activeQuest: Quest | null;
  isQuestDrawerOpen: boolean;
  locale: Locale;
  direction: Direction;

  openQuestDrawer: (quest: Quest) => void;
  closeQuestDrawer: () => void;
  setLocale: (locale: Locale) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeQuest: null,
      isQuestDrawerOpen: false,
      locale: 'en',
      direction: 'ltr',

      openQuestDrawer: (quest) =>
        set({ activeQuest: quest, isQuestDrawerOpen: true }),

      closeQuestDrawer: () => set({ isQuestDrawerOpen: false }),

      setLocale: (locale) =>
        set({ locale, direction: locale === 'he' ? 'rtl' : 'ltr' }),
    }),
    {
      name: 'qv-locale',
      storage: createJSONStorage(() => localStorage),
      // Only the language preference is persisted — not drawer/quest state.
      partialize: (s) => ({ locale: s.locale, direction: s.direction }),
      // Rehydrate manually after mount (see LocaleSync) to avoid an SSR/client
      // hydration mismatch: the server always renders the default 'en'.
      skipHydration: true,
    }
  )
);
