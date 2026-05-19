'use client';

import { useAssets } from '@/hooks/useAssets';
import { AssetCard } from './AssetCard';
import { SkeletonAssetCard } from '@/components/shared/SkeletonCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { FileX } from 'lucide-react';

interface Props {
  questId: string;
}

export function AssetGrid({ questId }: Props) {
  const { data, isLoading, isError } = useAssets(questId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonAssetCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load assets"
        description="Please try again later."
        icon={<FileX className="h-10 w-10" />}
      />
    );
  }

  const assets = data?.data ?? [];

  if (assets.length === 0) {
    return (
      <EmptyState
        title="No assets yet"
        description="This quest doesn't have any assets uploaded."
        icon={<FileX className="h-10 w-10" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
