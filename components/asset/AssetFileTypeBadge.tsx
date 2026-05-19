import { getFileTypeBadgeStyle } from '@/lib/utils';
import type { FileType } from '@/types';

interface Props {
  fileType: FileType;
}

export function AssetFileTypeBadge({ fileType }: Props) {
  const style = getFileTypeBadgeStyle(fileType);

  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
    >
      {fileType}
    </span>
  );
}
