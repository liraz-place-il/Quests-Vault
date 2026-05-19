'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuests } from '@/hooks/useQuests';
import { useUpdateQuest, useDeleteQuest } from '@/hooks/useQuests';
import { QuestStatusBadge } from '@/components/quest/QuestStatusBadge';
import { formatDate } from '@/lib/utils';
import { Trash2, Pencil, Plus, AlertCircle } from 'lucide-react';
import type { Quest, QuestStatus } from '@/types';

const STATUSES: QuestStatus[] = ['Active', 'Expired', 'Draft', 'Archived'];

export function AdminPageClient() {
  const { data, isLoading } = useQuests({ pageSize: 100, sortBy: 'updatedAt', sortDir: 'desc' });
  const { mutate: updateQuest, isPending: updating } = useUpdateQuest();
  const { mutate: deleteQuest, isPending: deleting } = useDeleteQuest();

  const quests = data?.data ?? [];

  const handleStatusChange = (quest: Quest, status: QuestStatus) => {
    updateQuest({ id: quest.id, data: { status } });
  };

  const handleDelete = (quest: Quest) => {
    if (window.confirm(`Delete quest "${quest.title}"? This cannot be undone.`)) {
      deleteQuest(quest.id);
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
            className="text-2xl font-bold text-[#F3F4F6]"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Admin{' '}
            <span className="gradient-text">Dashboard</span>
          </motion.h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage quests and assets</p>
        </div>
        <a
          href="/quests"
          className="text-sm text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors"
        >
          ← Back to Vault
        </a>
      </div>

      {/* Notice */}
      <div
        className="flex items-start gap-3 rounded-xl p-4 text-sm"
        style={{
          background: 'rgba(60, 242, 255, 0.05)',
          border: '1px solid rgba(60, 242, 255, 0.15)',
        }}
      >
        <AlertCircle className="h-4 w-4 text-[#3CF2FF] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#3CF2FF] font-medium">Admin panel is open during development</p>
          <p className="text-[#6B7280] mt-0.5">
            Authentication will be added in Phase 3. To manage quests and assets, you can also edit them directly in your{' '}
            <span className="text-[#9CA3AF]">Airtable base</span>.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Quests', value: quests.length },
          { label: 'Active', value: quests.filter((q) => q.status === 'Active').length },
          { label: 'Expired', value: quests.filter((q) => q.status === 'Expired').length },
          { label: 'Draft', value: quests.filter((q) => q.status === 'Draft').length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#121826] p-4"
          >
            <p className="text-2xl font-bold text-[#F3F4F6]">{stat.value}</p>
            <p className="text-xs text-[#6B7280] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quest list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Quests
          </h2>
          <button
            onClick={() => window.alert('Quest creation form coming in Phase 2.\nFor now, add quests directly in Airtable.')}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: 'linear-gradient(135deg, rgba(255,0,212,0.15), rgba(161,0,255,0.15))',
              color: '#FF00D4',
              border: '1px solid rgba(255,0,212,0.25)',
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            New Quest
          </button>
        </div>

        {isLoading ? (
          <div className="text-sm text-[#6B7280] py-4">Loading quests…</div>
        ) : quests.length === 0 ? (
          <div className="text-sm text-[#6B7280] py-4">
            No quests found. Add your Airtable credentials to .env.local to see data.
          </div>
        ) : (
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr
                  className="border-b border-[rgba(255,255,255,0.06)]"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  {['ID', 'Title', 'Status', 'Start', 'End', 'Assets', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-start text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]"
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
                    className="border-b border-[rgba(255,255,255,0.03)]"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-[#6B7280]">{quest.questNumber}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[#F3F4F6] text-xs font-medium">{quest.title}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={quest.status}
                        onChange={(e) => handleStatusChange(quest, e.target.value as QuestStatus)}
                        disabled={updating}
                        className="text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
                        style={{
                          background: '#1a2235',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#9CA3AF',
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-[#6B7280]">{formatDate(quest.startDate)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-[#6B7280]">{formatDate(quest.endDate)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-[#9CA3AF]">{quest.assetCount}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.alert('Quest edit form coming in Phase 2.\nEdit directly in Airtable for now.')}
                          className="p-1 rounded text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
                          title="Edit quest"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(quest)}
                          disabled={deleting}
                          className="p-1 rounded text-[#6B7280] hover:text-[#FF5A5F] transition-colors"
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
