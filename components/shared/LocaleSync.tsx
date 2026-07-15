'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';

/**
 * Applies the persisted language after mount and mirrors it onto the
 * <html> element (lang + dir) so RTL styling works document-wide.
 */
export function LocaleSync() {
  const direction = useUIStore((s) => s.direction);
  const locale = useUIStore((s) => s.locale);

  // Load the saved preference once, client-side only.
  useEffect(() => {
    useUIStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return null;
}
