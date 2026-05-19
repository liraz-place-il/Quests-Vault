'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Asset, ApiResponse } from '@/types';

async function fetchAssets(questId: string): Promise<ApiResponse<Asset[]>> {
  const res = await fetch(`/api/quests/${questId}/assets`);
  if (!res.ok) throw new Error('Failed to fetch assets');
  return res.json();
}

export function useAssets(questId: string) {
  return useQuery({
    queryKey: ['assets', questId],
    queryFn: () => fetchAssets(questId),
    enabled: !!questId,
    staleTime: 60_000,
  });
}

export function useDownloadAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (assetId: string) => {
      const res = await fetch(`/api/assets/${assetId}/download`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate download URL');
      const { data } = await res.json();
      return data as { url: string; fileName: string; fileType: string; expiresAt: string | null };
    },
    onSuccess: (data, assetId) => {
      const link = document.createElement('a');
      link.href = data.url;
      link.setAttribute('download', data.fileName);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        qc.invalidateQueries({ queryKey: ['assets'] });
      }, 1000);
    },
  });
}
