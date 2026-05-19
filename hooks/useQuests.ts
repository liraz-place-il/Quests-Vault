'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Quest, ApiResponse, QuestListParams } from '@/types';

async function fetchQuests(params: QuestListParams): Promise<ApiResponse<Quest[]>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortDir) searchParams.set('sortDir', params.sortDir);

  const res = await fetch(`/api/quests?${searchParams}`);
  if (!res.ok) throw new Error('Failed to fetch quests');
  return res.json();
}

async function fetchQuest(id: string): Promise<ApiResponse<Quest>> {
  const res = await fetch(`/api/quests/${id}`);
  if (!res.ok) throw new Error('Failed to fetch quest');
  return res.json();
}

export function useQuests(params: QuestListParams) {
  return useQuery({
    queryKey: ['quests', params],
    queryFn: () => fetchQuests(params),
    staleTime: 60_000,
  });
}

export function useQuest(id: string) {
  return useQuery({
    queryKey: ['quest', id],
    queryFn: () => fetchQuest(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useDeleteQuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/quests/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete quest');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quests'] }),
  });
}

export function useUpdateQuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Quest> }) => {
      const res = await fetch(`/api/quests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update quest');
      return res.json();
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['quests'] });
      qc.invalidateQueries({ queryKey: ['quest', id] });
    },
  });
}
