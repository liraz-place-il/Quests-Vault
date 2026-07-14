'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.replace('/admin');
      router.refresh();
      return;
    }

    const body = await res.json().catch(() => ({}));
    setError(body.error ?? 'Incorrect password');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl p-8 space-y-5"
        style={{
          background: '#0d1638',
          border: '1px solid rgba(243,239,248,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center h-9 w-9 rounded-xl shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,48,194,0.15), rgba(48,145,255,0.15))' }}
          >
            <Lock className="h-4 w-4 text-[#ff30c2]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#f3eff8] leading-tight">Admin access</h1>
            <p className="text-xs text-[#a9a4b8]">Enter the admin password to continue</p>
          </div>
        </div>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl px-4 py-2.5 text-sm text-[#f3eff8] placeholder:text-[#8b88a0] outline-none transition-colors"
          style={{ background: 'rgba(243,239,248,0.05)', border: '1px solid rgba(243,239,248,0.1)' }}
        />

        {error && <p className="text-sm text-[#FF5A5F]">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #ff30c2, #3091ff)' }}
        >
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
