'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useQuests } from '@/hooks/useQuests';
import { useUpdateQuest, useDeleteQuest } from '@/hooks/useQuests';
import { QuestStatusBadge } from '@/components/quest/QuestStatusBadge';
import { formatDate } from '@/lib/utils';
import { Trash2, Pencil, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import type { AcademyType, Quest, QuestStatus } from '@/types';

const STATUSES: QuestStatus[] = ['Active', 'Pending', 'Completed', 'Draft', 'Archived'];

const TYPE_FILTERS: { value: AcademyType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Quest', label: 'Quest' },
  { value: 'Academy Quest', label: 'Academy Quest' },
];

function AcademyTypeBadge({ type }: { type: AcademyType }) {
  const academy = type === 'Academy Quest';
  return (
    <span
      // Quest = accent fill, Academy Quest = white outline — one brand hue,
      // told apart by fill vs outline (and the label itself).
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${
        academy ? 'border-line-strong text-foreground' : 'border-brand bg-brand text-on-brand'
      }`}
    >
      {type}
    </span>
  );
}

export function AdminPageClient() {
  const { data, isLoading } = useQuests({ pageSize: 100, sortBy: 'questNumber', sortDir: 'asc' });
  const { mutate: updateQuest, isPending: updating } = useUpdateQuest();
  const { mutate: deleteQuest, isPending: deleting } = useDeleteQuest();
  const queryClient = useQueryClient();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<AcademyType | 'all'>('all');

  const allQuests = data?.data ?? [];
  const quests = typeFilter === 'all' ? allQuests : allQuests.filter((q) => q.academyType === typeFilter);

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl font-bold text-foreground m-0"
          >
            Admin{' '}
            <span className="text-brand">Dashboard</span>
          </motion.h1>
          <p className="text-sm text-muted-foreground mt-1">Manage quests</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync from Monday'}
          </button>
          <a
            href="/quests"
            className="text-sm text-muted-foreground underline decoration-brand underline-offset-4 hover:text-foreground transition-colors"
          >
            /quests ↗
          </a>
          <a
            href="/academy"
            className="text-sm text-muted-foreground underline decoration-brand underline-offset-4 hover:text-foreground transition-colors"
          >
            /academy ↗
          </a>
        </div>
      </div>

      {/* Sync result */}
      {syncMessage && (
        <div
          className={`rounded-xl border bg-card px-4 py-3 text-sm ${
            syncMessage.startsWith('Sync failed')
              ? 'border-danger/40 text-danger'
              : 'border-border text-foreground'
          }`}
        >
          {syncMessage}
        </div>
      )}

      {/* Notice */}
      <div
        className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm"
      >
        <AlertCircle className="h-4 w-4 text-brand shrink-0 mt-0.5" />
        <div>
          <p className="text-foreground font-medium">Admin panel is open during development</p>
          <p className="text-muted-foreground mt-0.5">
            Authentication will be added in Phase 3. To manage quests and assets, you can also edit them directly in your{' '}
            <span className="text-foreground">Airtable base</span>.
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
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="font-heading text-3xl font-medium text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quest list */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider m-0">
              Quests
            </h2>
            <div className="flex items-center gap-1" role="group" aria-label="Filter by type">
              {TYPE_FILTERS.map((f) => {
                const active = typeFilter === f.value;
                const count = f.value === 'all' ? allQuests.length : allQuests.filter((q) => q.academyType === f.value).length;
                return (
                  <button
                    key={f.value}
                    onClick={() => setTypeFilter(f.value)}
                    aria-pressed={active}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      active
                        ? 'border-brand bg-brand text-on-brand'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-line-strong'
                    }`}
                  >
                    {f.label} <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => window.alert('Quest creation form coming in Phase 2.\nFor now, add quests directly in Airtable.')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            <Plus className="h-3.5 w-3.5" />
            New Quest
          </button>
        </div>

        {isLoading ? (
          <div className="text-sm text-subtle py-4">Loading quests…</div>
        ) : quests.length === 0 ? (
          <div className="text-sm text-subtle py-4">
            No quests found. Add your Airtable credentials to .env.local to see data.
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-x-auto scrollbar-thin">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr
                  className="border-b border-border bg-card"
                >
                  {['ID', 'Title', 'Type', 'Status', 'Start', 'End', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-start text-[11px] font-medium uppercase tracking-wider text-subtle whitespace-nowrap"
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
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-subtle">{quest.questNumber}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-foreground text-xs font-medium">{quest.title}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <AcademyTypeBadge type={quest.academyType} />
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={quest.status}
                        onChange={(e) => handleStatusChange(quest, e.target.value as QuestStatus)}
                        disabled={updating}
                        className="text-xs rounded-lg border border-input bg-popover px-2 py-1 text-foreground outline-none cursor-pointer focus:border-brand"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(quest.startDate)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(quest.endDate)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.alert('Quest edit form coming in Phase 2.\nEdit directly in Airtable for now.')}
                          className="p-1 rounded text-subtle hover:text-foreground transition-colors"
                          title="Edit quest"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(quest)}
                          disabled={deleting}
                          className="p-1 rounded text-subtle hover:text-danger transition-colors"
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
