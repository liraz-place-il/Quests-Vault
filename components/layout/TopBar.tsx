'use client';

import Image from 'next/image';
import { LocaleSwitcher } from './LocaleSwitcher';

export function TopBar() {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-[rgba(243,239,248,0.06)]"
      style={{
        background: 'rgba(8,14,44,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        {/* Light chip so the navy logo text stays readable on dark bg */}
        <div className="flex items-center rounded-xl bg-[#f3eff8] px-2.5 py-1.5">
          <Image
            src="/place-il-logo.png"
            alt="Place-IL"
            width={96}
            height={24}
            className="h-5 w-auto"
            priority
          />
        </div>
        <span className="font-semibold text-[#f3eff8] text-sm tracking-tight hidden sm:block">
          Quest Vault
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <a
          href="/admin"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#c9c5d4] hover:text-[#f3eff8] transition-colors"
          style={{
            background: 'rgba(243,239,248,0.04)',
            border: '1px solid rgba(243,239,248,0.06)',
          }}
        >
          Admin
        </a>
      </div>
    </header>
  );
}
