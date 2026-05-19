'use client';

import { useUIStore } from '@/store/ui.store';

export function LocaleSwitcher() {
  const { locale, setLocale } = useUIStore();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'he' : 'en')}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      title={locale === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
    >
      {locale === 'en' ? '🇮🇱 עב' : '🇺🇸 EN'}
    </button>
  );
}
