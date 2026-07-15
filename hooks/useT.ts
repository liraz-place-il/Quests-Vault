'use client';

import { useUIStore } from '@/store/ui.store';
import { translate, type TranslationKey } from '@/lib/i18n';

/** Returns a `t(key, vars?)` translator bound to the current locale. */
export function useT() {
  const locale = useUIStore((s) => s.locale);
  return (key: TranslationKey, vars?: Record<string, string | number>) =>
    translate(locale, key, vars);
}
