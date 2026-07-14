'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useQuests } from '@/hooks/useQuests';
import { useUpdateQuest, useDeleteQuest } from '@/hooks/useQuests';
import { QuestStatusBadge } from '@/components/quest/QuestStatusBadge';
import { formatDate } from '@/lib/utils';
import { Trash2, Pencil, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import type { Quest, QuestStatus } from '@/types';

const STATUSES: QuestStatus[] = ['Active', 'Pending', 'Completed', 'Draft', 'Archived'];

export function AdminPageClient() {
  const { data, isLoading } = useQuests({ pageSize: 100, sortBy: 'questNumber', sortDir: 'asc' });
  const { mutate: updateQuest, isPending: updating } = useUpdateQuest();
  const { mutate: deleteQuest, isPending: deleting } = useDeleteQuest();
  const queryClient = useQueryClient();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const quests = data?.data ?? [];

  const handleStatusChange = (quest: Quest, status: QuestStatus) => {
    updateQuest({ id: quest.id, data: { status } });
  };

  const handleDelete = (quest: Quest) => {
    if (window.confirm(`Delete quest "${quest.title}"? This cannot be undone.`)) {
      deleteQuest(quest.id);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/sync/monday', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || json.error) {
        setSyncMessage(`Sync failed: ${json.error ?? res.statusText}`);
      } else {
        const { pulled, created, updated, warning } = json.data;
        setSyncMessage(
          `Synced ${pulled} items from Monday — ${created} created, ${updated} updated.` +
            (warning ? ` ⚠ ${warning}` : '')
        );
        queryClient.invalidateQueries({ queryKey: ['quests'] });
      }
    } catch (err) {
      setSyncMessage(`Sync failed: ${err instanceof Error ? err.message : 'network error'}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-[#f3eff8]"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Admin{' '}
            <span className="gradient-text">Dashboard</span>
          </motion.h1>
          <p className="text-sm text-[#a9a4b8] mt-1">Manage quests</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #ff30c2, #3091ff)',
              color: '#fff',
              boxShadow: syncing ? 'none' : '0 2px 14px rgba(255,48,194,0.25)',
            }}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync from Monday'}
          </button>
          <a
            href="/quests"
            className="text-sm text-[#c9c5d4] hover:text-[#f3eff8] transition-colors"
          >
            ← Back to Vault
          </a>
        </div>
      </div>

      {/* Sync result */}
      {syncMessage && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={
            syncMessage.startsWith('Sync failed')
              ? {
                  background: 'rgba(255, 90, 95, 0.08)',
                  border: '1px solid rgba(255, 90, 95, 0.25)',
                  color: '#FF5A5F',
                }
              : {
                  background: 'rgba(0, 214, 143, 0.08)',
                  border: '1px solid rgba(0, 214, 143, 0.25)',
                  color: '#00D68F',
                }
          }
        >
          {syncMessage}
        </div>
      )}

      {/* Notice */}
      <div
        className="flex items-start gap-3 rounded-xl p-4 text-sm"
        style={{
          background: 'rgba(48, 145, 255, 0.05)',
          border: '1px solid rgba(48, 145, 255, 0.15)',
        }}
      >
        <AlertCircle className="h-4 w-4 text-[#3091ff] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#3091ff] font-medium">Admin panel is open during development</p>
          <p className="text-[#a9a4b8] mt-0.5">
            Authentication will be added in Phase 3. To manage quests and assets, you can also edit them directly in your{' '}
            <span className="text-[#c9c5d4]">Airtable base</span>.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Quests', value: quests.length },
          { label: 'Active', value: quests.filter((q) => q.status === 'Active').length },
          { label: 'Pending', value: quests.filter((q) => q.status === 'Pending').length },
          { label: 'Completed', value: quests.filter((q) => q.status === 'Completed').length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[rgba(243,239,248,0.07)] bg-[#0d1638] p-4"
          >
            <p className="text-2xl font-bold text-[#f3eff8]">{stat.value}</p>
            <p className="text-xs text-[#a9a4b8] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quest list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#c9c5d4] uppercase tracking-wider">
            Quests
          </h2>
          <button
            onClick={() => window.alert('Quest creation form coming in Phase 2.\nFor now, add quests directly in Airtable.')}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: 'linear-gradient(135deg, rgba(255,48,194,0.15), rgba(48,145,255,0.15))',
              color: '#ff30c2',
              border: '1px solid rgba(255,48,194,0.25)',
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            New Quest
          </button>
        </div>

        {isLoading ? (
          <div className="text-sm text-[#a9a4b8] py-4">Loading quests…</div>
        ) : quests.length === 0 ? (
          <div className="text-sm text-[#a9a4b8] py-4">
            No quests found. Add your Airtable credentials to .env.local to see data.
          </div>
        ) : (
          <div className="rounded-xl border border-[rgba(243,239,248,0.06)] overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr
                  className="border-b border-[rgba(243,239,248,0.06)]"
                  style={{ background: 'rgba(243,239,248,0.02)' }}
                >
                  {['ID', 'Title', 'Status', 'Start', 'End', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-start text-[10px] font-semibold uppercase tracking-wider text-[#a9a4b8]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quests.map((quest) => (
                  <tr
                    key={quest.id}
                    className="border-b border-[rgba(243,239,248,0.03)]"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-[#a9a4b8]">{quest.questNumber}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[#f3eff8] text-xs font-medium">{quest.title}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={quest.status}
                        onChange={(e) => handleStatusChange(quest, e.target.value as QuestStatus)}
                        disabled={updating}
                        className="text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
                        style={{
                          background: '#141e47',
                          border: '1px solid rgba(243,239,248,0.08)',
                          color: '#c9c5d4',
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-[#a9a4b8]">{formatDate(quest.startDate)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-[#a9a4b8]">{formatDate(quest.endDate)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.alert('Quest edit form coming in Phase 2.\nEdit directly in Airtable for now.')}
                          className="p-1 rounded text-[#a9a4b8] hover:text-[#c9c5d4] transition-colors"
                          title="Edit quest"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(quest)}
                          disabled={deleting}
                          className="p-1 rounded text-[#a9a4b8] hover:text-[#FF5A5F] transition-colors"
                          title="Delete quest"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
