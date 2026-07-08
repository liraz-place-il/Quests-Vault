'use client';

import { useState } from 'react';
import { Download, ChevronRight, User, Calendar, HardDrive } from 'lucide-react';
import { AssetFileTypeBadge } from './AssetFileTypeBadge';
import { AssetDetailModal } from './AssetDetailModal';
import { useDownloadAsset } from '@/hooks/useAssets';
import { useUIStore } from '@/store/ui.store';
import { formatDate, formatFileSize, truncate } from '@/lib/utils';
import type { Asset } from '@/types';

interface Props {
  asset: Asset;
}

export function AssetCard({ asset }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { locale } = useUIStore();
  const { mutate: download, isPending } = useDownloadAsset();

  const title = (locale === 'he' && asset.titleHe) ? asset.titleHe : asset.title;
  const description = (locale === 'he' && asset.descriptionHe) ? asset.descriptionHe : asset.description;

  return (
    <>
      <div
        className="rounded-xl border border-[rgba(243,239,248,0.07)] bg-[#0d1638] p-4 card-hover flex flex-col gap-3"
        style={{ minHeight: 160 }}
      >
        {/* Top: file type + visibility */}
        <div className="flex items-center gap-2">
          <AssetFileTypeBadge fileType={asset.fileType} />
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              background: asset.isPublic ? 'rgba(0,214,143,0.08)' : 'rgba(255,176,32,0.08)',
              color: asset.isPublic ? '#00D68F' : '#FFB020',
            }}
          >
            {asset.isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        {/* Title + description */}
        <div className="flex-1">
          <p className="text-[#f3eff8] font-semibold text-sm leading-snug mb-1">{title}</p>
          {description && (
            <p className="text-[#6B7280] text-xs leading-relaxed">{truncate(description, 100)}</p>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1">
            <User className="h-2.5 w-2.5" />
            {asset.creatorName}
          </span>
          {asset.fileSize && (
            <span className="flex items-center gap-1">
              <HardDrive className="h-2.5 w-2.5" />
              {formatFileSize(asset.fileSize)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Download className="h-2.5 w-2.5" />
            {asset.downloadCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" />
            {formatDate(asset.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => download(asset.id)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,48,194,0.15), rgba(48,145,255,0.15))',
              color: '#ff30c2',
              border: '1px solid rgba(255,48,194,0.25)',
            }}
            aria-label={`Download ${title}`}
          >
            <Download className="h-3 w-3" />
            {isPending ? 'Loading…' : 'Download'}
          </button>

          <button
            onClick={() => setDetailOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[#9CA3AF] hover:text-[#f3eff8] transition-colors duration-150"
            style={{
              background: 'rgba(243,239,248,0.04)',
              border: '1px solid rgba(243,239,248,0.06)',
            }}
            aria-label={`More details for ${title}`}
          >
            Details
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <AssetDetailModal
        asset={asset}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
