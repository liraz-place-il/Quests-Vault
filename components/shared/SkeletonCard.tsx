import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonAssetCard() {
  return (
    <div className="rounded-xl border border-[rgba(243,239,248,0.06)] bg-[#0d1638] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-10 rounded bg-[rgba(243,239,248,0.06)]" />
        <Skeleton className="h-5 w-14 rounded bg-[rgba(243,239,248,0.06)]" />
      </div>
      <Skeleton className="h-4 w-3/4 bg-[rgba(243,239,248,0.06)]" />
      <Skeleton className="h-3 w-full bg-[rgba(243,239,248,0.04)]" />
      <Skeleton className="h-3 w-2/3 bg-[rgba(243,239,248,0.04)]" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-24 bg-[rgba(243,239,248,0.04)]" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-lg bg-[rgba(243,239,248,0.06)]" />
          <Skeleton className="h-7 w-24 rounded-lg bg-[rgba(243,239,248,0.06)]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonQuestRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[rgba(243,239,248,0.04)]">
      <Skeleton className="h-4 w-16 bg-[rgba(243,239,248,0.06)]" />
      <Skeleton className="h-4 w-48 bg-[rgba(243,239,248,0.06)]" />
      <Skeleton className="h-5 w-16 rounded-full bg-[rgba(243,239,248,0.06)]" />
      <Skeleton className="h-4 w-24 bg-[rgba(243,239,248,0.04)]" />
      <Skeleton className="h-4 w-24 bg-[rgba(243,239,248,0.04)]" />
    </div>
  );
}

export function SkeletonQuestCard() {
  return (
    <div className="rounded-xl border border-[rgba(243,239,248,0.06)] bg-[#0d1638] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16 bg-[rgba(243,239,248,0.06)]" />
        <Skeleton className="h-5 w-16 rounded-full bg-[rgba(243,239,248,0.06)]" />
      </div>
      <Skeleton className="h-5 w-3/4 bg-[rgba(243,239,248,0.07)]" />
      <Skeleton className="h-3 w-full bg-[rgba(243,239,248,0.04)]" />
      <Skeleton className="h-3 w-2/3 bg-[rgba(243,239,248,0.04)]" />
      <div className="flex gap-4 pt-1">
        <Skeleton className="h-3 w-20 bg-[rgba(243,239,248,0.04)]" />
        <Skeleton className="h-3 w-20 bg-[rgba(243,239,248,0.04)]" />
      </div>
    </div>
  );
}
