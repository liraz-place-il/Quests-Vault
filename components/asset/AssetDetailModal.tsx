'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { AssetFileTypeBadge } from './AssetFileTypeBadge';
import { formatDate, formatFileSize } from '@/lib/utils';
import { useDownloadAsset } from '@/hooks/useAssets';
import { useUIStore } from '@/store/ui.store';
import { Download, User, Calendar, HardDrive, Eye } from 'lucide-react';
import type { Asset } from '@/types';

interface Props {
  asset: Asset;
  open: boolean;
  onClose: () => void;
}

export function AssetDetailModal({ asset, open, onClose }: Props) {
  const { locale } = useUIStore();
  const { mutate: download, isPending } = useDownloadAsset();

  const title = (locale === 'he' && asset.titleHe) ? asset.titleHe : asset.title;
  const description = (locale === 'he' && asset.descriptionHe) ? asset.descriptionHe : asset.description;
  const richContent = (locale === 'he' && asset.richContentHe) ? asset.richContentHe : asset.richContent;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl border-[rgba(243,239,248,0.08)] bg-[#0d1638] p-0 overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(48,145,255,0.15)' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[rgba(243,239,248,0.06)]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-3">
              <AssetFileTypeBadge fileType={asset.fileType} />
              <span
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  background: asset.isPublic ? 'rgba(0, 214, 143, 0.1)' : 'rgba(255,176,32,0.1)',
                  color: asset.isPublic ? '#00D68F' : '#FFB020',
                  border: `1px solid ${asset.isPublic ? 'rgba(0,214,143,0.25)' : 'rgba(255,176,32,0.25)'}`,
                }}
              >
                <Eye className="h-2.5 w-2.5" />
                {asset.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            <DialogTitle className="text-[#f3eff8] text-xl font-semibold leading-tight">
              {title}
            </DialogTitle>
            {description && (
              <p className="text-[#9CA3AF] text-sm mt-2 leading-relaxed">{description}</p>
            )}
          </DialogHeader>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <User className="h-3 w-3" />
              {asset.creatorName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {formatDate(asset.createdAt)}
            </span>
            {asset.fileSize && (
              <span className="flex items-center gap-1.5">
                <HardDrive className="h-3 w-3" />
                {formatFileSize(asset.fileSize)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Download className="h-3 w-3" />
              {asset.downloadCount.toLocaleString()} downloads
            </span>
          </div>
        </div>

        {/* Rich content */}
        {richContent && (
          <div className="p-6 max-h-[50vh] overflow-y-auto scrollbar-thin">
            <MarkdownRenderer content={richContent} />
          </div>
        )}

        {!richContent && (
          <div className="p-6 text-[#6B7280] text-sm italic">
            No additional details available.
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(243,239,248,0.06)] flex justify-end">
          <button
            onClick={() => download(asset.id)}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150"
            style={{
              background: 'linear-gradient(135deg, #ff30c2, #3091ff)',
              color: '#fff',
              boxShadow: isPending ? 'none' : '0 0 16px rgba(255,48,194,0.3)',
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <Download className="h-4 w-4" />
            {isPending ? 'Preparing…' : 'Download'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
