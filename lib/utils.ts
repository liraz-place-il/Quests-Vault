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
 * isn't already finalized (Completed/Archived), it is shown as Completed.
 */
export function computeQuestStatus(
  rawStatus: QuestStatus,
  endDate?: string
): QuestStatus {
  const finalized = rawStatus === 'Completed' || rawStatus === 'Archived';
  if (!finalized && isPastEndDate(endDate)) return 'Completed';
  return rawStatus;
}

/** Completed quests accept late submissions (deadline passed). */
export function isLateStatus(status: QuestStatus): boolean {
  return typeof status === 'string' && status.toLowerCase() === 'completed';
}

export const LATE_SUBMISSION_HINT =
  'Oh, you missed the date of this quest, however, you can still complete the quest and submit it to get a personal feedback.';

type StatusStyle = { bg: string; text: string; border: string };

// Brand tokens (app/brand.css + app/globals.css). Flat, no glow: the brand
// allows one accent hue, so statuses are told apart by fill vs outline vs
// plain, plus the localized label — never by colour alone.
const tint = (token: string, pct: number) =>
  `color-mix(in oklab, var(${token}) ${pct}%, transparent)`;

const STATUS_STYLES: Record<string, StatusStyle> = {
  // Live — the only status that uses the accent: solid fill, navy text (6.2:1)
  active: {
    bg: 'var(--brand-accent)',
    text: 'var(--brand-on-accent)',
    border: 'var(--brand-accent)',
  },
  // Upcoming — white outline (+ live dot)
  pending: {
    bg: 'transparent',
    text: 'var(--color-text)',
    border: 'var(--qv-line-strong)',
  },
  // Done — quiet neutral fill
  completed: {
    bg: tint('--color-text', 10),
    text: 'var(--color-text-muted)',
    border: 'transparent',
  },
  expired: {
    bg: 'transparent',
    text: 'var(--color-text-muted)',
    border: 'var(--color-border)',
  },
  draft: {
    bg: 'transparent',
    text: 'var(--qv-text-subtle)',
    border: 'var(--color-border)',
  },
  archived: {
    bg: tint('--color-text', 5),
    text: 'var(--qv-text-subtle)',
    border: 'transparent',
  },
};

const DEFAULT_STATUS_STYLE: StatusStyle = {
  bg: 'transparent',
  text: 'var(--color-text-muted)',
  border: 'var(--color-border)',
};

export function getStatusColor(status: QuestStatus): StatusStyle {
  if (!status) return DEFAULT_STATUS_STYLE;
  return STATUS_STYLES[status.toLowerCase()] ?? DEFAULT_STATUS_STYLE;
}

// Which statuses render the pulsing "live" dot
export const LIVE_STATUSES = new Set(['active', 'pending']);

export function getFileTypeBadgeStyle(_fileType: FileType): {
  bg: string;
  text: string;
  border: string;
} {
  // One neutral chip for every file type — the label carries the meaning,
  // and the brand allows a single accent hue.
  return {
    bg: 'color-mix(in oklab, var(--color-text) 6%, transparent)',
    text: 'var(--color-text-muted)',
    border: 'var(--color-border)',
  };
}

/**
 * Compares quest numbers by their numeric portion first (so "Q1" < "Q2" < "Q012"
 * regardless of zero-padding), falling back to a plain string compare.
 */
export function compareQuestNumbers(a: string, b: string): number {
  const numA = a.match(/\d+/)?.[0];
  const numB = b.match(/\d+/)?.[0];
  if (numA && numB) {
    const diff = parseInt(numA, 10) - parseInt(numB, 10);
    if (diff !== 0) return diff;
  }
  return a.localeCompare(b);
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

export function detectDirection(text: string): 'rtl' | 'ltr' {
  const hebrewRange = /[א-׿]/;
  return hebrewRange.test(text) ? 'rtl' : 'ltr';
}
