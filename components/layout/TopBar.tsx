'use client';

import Image from 'next/image';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useT } from '@/hooks/useT';

export function TopBar() {
  const t = useT();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-background">
      {/* Logo — official on-dark lockup with the "אנו באנו" tag */}
      <div className="flex items-center gap-3">
        <Image
          src="/brand/place-il-with-tag-on-dark.svg"
          alt="PLACE.IL"
          width={125}
          height={36}
          className="h-9 w-auto"
          priority
        />
      </div>

      {/* End side */}
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <a
          href="/admin"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-line-strong transition-colors"
        >
          {t('nav.admin')}
        </a>
      </div>
    </header>
  );
}
