'use client';

import { LocaleSwitcher } from './LocaleSwitcher';

export function TopBar() {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3 border-b border-[rgba(243,239,248,0.06)]"
      style={{
        background: 'rgba(11,16,32,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #ff30c2, #3091ff)' }}
          aria-hidden
        >
          QV
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
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#9CA3AF] hover:text-[#f3eff8] transition-colors"
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
