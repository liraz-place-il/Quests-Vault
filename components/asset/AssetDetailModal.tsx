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
        className="max-w-2xl border-border bg-card p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-3">
              <AssetFileTypeBadge fileType={asset.fileType} />
              <span
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                  asset.isPublic ? 'border-transparent bg-foreground/10 text-foreground' : 'border-border text-subtle'
                }`}
              >
                <Eye className="h-2.5 w-2.5" />
                {asset.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            <DialogTitle className="font-heading text-foreground text-xl font-bold leading-tight">
              {title}
            </DialogTitle>
            {description && (
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{description}</p>
            )}
          </DialogHeader>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-subtle">
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
          <div className="p-6 text-subtle text-sm italic">
            No additional details available.
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={() => download(asset.id)}
            disabled={isPending}
            className={`inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary-hover ${
              isPending ? 'opacity-70' : ''
            }`}
          >
            <Download className="h-4 w-4" />
            {isPending ? 'Preparing…' : 'Download'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
