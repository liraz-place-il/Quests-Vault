'use client';

import { useUIStore } from '@/store/ui.store';

export function LocaleSwitcher() {
  const { locale, setLocale } = useUIStore();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'he' : 'en')}
      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-line-strong transition-colors"
      title={locale === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
    >
      {locale === 'en' ? '🇮🇱 עב' : '🇺🇸 EN'}
    </button>
  );
}
