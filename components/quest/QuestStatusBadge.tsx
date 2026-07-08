import { getStatusColor, LIVE_STATUSES } from '@/lib/utils';
import type { QuestStatus } from '@/types';

interface Props {
  status: QuestStatus;
  size?: 'sm' | 'md';
}

export function QuestStatusBadge({ status, size = 'md' }: Props) {
  const colors = getStatusColor(status);
  const isSmall = size === 'sm';

  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.glow !== 'transparent' ? `0 0 8px ${colors.glow}` : 'none',
      }}
      className={`inline-flex items-center rounded-full font-medium tracking-wide ${
        isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {status && LIVE_STATUSES.has(status.toLowerCase()) && (
        <span
          className="me-1.5 inline-block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: colors.text }}
        />
      )}
      {status}
    </span>
  );
}
