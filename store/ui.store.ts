'use client';

import { create } from 'zustand';
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

export const useUIStore = create<UIStore>((set) => ({
  activeQuest: null,
  isQuestDrawerOpen: false,
  locale: 'en',
  direction: 'ltr',

  openQuestDrawer: (quest) =>
    set({ activeQuest: quest, isQuestDrawerOpen: true }),

  closeQuestDrawer: () =>
    set({ isQuestDrawerOpen: false }),

  setLocale: (locale) =>
    set({ locale, direction: locale === 'he' ? 'rtl' : 'ltr' }),
}));
