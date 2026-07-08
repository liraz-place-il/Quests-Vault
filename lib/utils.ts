import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FileType, QuestStatus } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return '—';
  if (!end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/**
 * A quest's end date has passed (end of that calendar day is behind us).
 */
export function isPastEndDate(endDate?: string): boolean {
  if (!endDate) return false;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return false;
  // Treat the whole end day as still-valid: expire the day after.
  end.setHours(23, 59, 59, 999);
  return end.getTime() < Date.now();
}

/**
 * Derive the effective status. If the end date has passed and the quest
 * isn't already finalized (Completed/Archived), it is shown as Expired.
 */
export function computeQuestStatus(
  rawStatus: QuestStatus,
  endDate?: string
): QuestStatus {
  const finalized = rawStatus === 'Completed' || rawStatus === 'Archived';
  if (!finalized && isPastEndDate(endDate)) return 'Expired';
  return rawStatus;
}

export function isExpiredStatus(status: QuestStatus): boolean {
  return typeof status === 'string' && status.toLowerCase() === 'expired';
}

export const LATE_SUBMISSION_HINT =
  'Oh, you missed the date of this quest, however, you can still complete the quest and submit it to get a personal feedback.';

type StatusStyle = { bg: string; text: string; border: string; glow: string };

const STATUS_STYLES: Record<string, StatusStyle> = {
  // Neon magenta — live / in-progress states
  active: {
    bg: 'rgba(255, 0, 212, 0.1)',
    text: '#FF00D4',
    border: 'rgba(255, 0, 212, 0.3)',
    glow: 'rgba(255, 0, 212, 0.2)',
  },
  // Amber — awaiting action
  pending: {
    bg: 'rgba(255, 176, 32, 0.1)',
    text: '#FFB020',
    border: 'rgba(255, 176, 32, 0.3)',
    glow: 'rgba(255, 176, 32, 0.2)',
  },
  // Green — done successfully
  completed: {
    bg: 'rgba(0, 214, 143, 0.1)',
    text: '#00D68F',
    border: 'rgba(0, 214, 143, 0.3)',
    glow: 'rgba(0, 214, 143, 0.2)',
  },
  // Soft blue — time-lapsed
  expired: {
    bg: 'rgba(91, 140, 255, 0.1)',
    text: '#5B8CFF',
    border: 'rgba(91, 140, 255, 0.3)',
    glow: 'rgba(91, 140, 255, 0.2)',
  },
  draft: {
    bg: 'rgba(107, 114, 128, 0.1)',
    text: '#9CA3AF',
    border: 'rgba(107, 114, 128, 0.3)',
    glow: 'transparent',
  },
  archived: {
    bg: 'rgba(107, 114, 128, 0.08)',
    text: '#6B7280',
    border: 'rgba(107, 114, 128, 0.2)',
    glow: 'transparent',
  },
};

const DEFAULT_STATUS_STYLE: StatusStyle = {
  bg: 'rgba(156, 163, 175, 0.1)',
  text: '#9CA3AF',
  border: 'rgba(156, 163, 175, 0.3)',
  glow: 'transparent',
};

export function getStatusColor(status: QuestStatus): StatusStyle {
  if (!status) return DEFAULT_STATUS_STYLE;
  return STATUS_STYLES[status.toLowerCase()] ?? DEFAULT_STATUS_STYLE;
}

// Which statuses render the pulsing "live" dot
export const LIVE_STATUSES = new Set(['active', 'pending']);

export function getFileTypeBadgeStyle(fileType: FileType): {
  bg: string;
  text: string;
  border: string;
} {
  switch (fileType) {
    case 'PDF':
      return { bg: 'rgba(255, 90, 95, 0.1)', text: '#FF5A5F', border: 'rgba(255, 90, 95, 0.3)' };
    case 'PNG':
    case 'JPG':
    case 'JPEG':
      return { bg: 'rgba(0, 214, 143, 0.1)', text: '#00D68F', border: 'rgba(0, 214, 143, 0.3)' };
    case 'ZIP':
      return { bg: 'rgba(255, 176, 32, 0.1)', text: '#FFB020', border: 'rgba(255, 176, 32, 0.3)' };
    case 'MD':
      return { bg: 'rgba(161, 0, 255, 0.1)', text: '#A100FF', border: 'rgba(161, 0, 255, 0.3)' };
    case 'DOCX':
      return { bg: 'rgba(91, 140, 255, 0.1)', text: '#5B8CFF', border: 'rgba(91, 140, 255, 0.3)' };
    case 'TXT':
      return { bg: 'rgba(156, 163, 175, 0.1)', text: '#9CA3AF', border: 'rgba(156, 163, 175, 0.3)' };
    default:
      return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280', border: 'rgba(107, 114, 128, 0.3)' };
  }
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

export function detectDirection(text: string): 'rtl' | 'ltr' {
  const hebrewRange = /[א-׿]/;
  return hebrewRange.test(text) ? 'rtl' : 'ltr';
}
