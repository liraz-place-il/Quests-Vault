import { NextResponse } from 'next/server';
import { getMondayBoardInfo, getMondayItems, pick, type MondayItem } from '@/lib/monday';
import { upsertQuestsFromMonday, type SyncQuestRow } from '@/lib/airtable';

/** Map Monday status labels to the app's vocabulary. */
function normalizeStatus(raw?: string): string | undefined {
  if (!raw) return undefined;
  const s = raw.trim().toLowerCase();
  if (['done', 'completed', 'complete', 'finished'].includes(s)) return 'Completed';
  if (['active', 'working on it', 'in progress', 'live', 'open'].includes(s)) return 'Active';
  if (['pending', 'waiting', 'on hold', 'stuck', 'planned'].includes(s)) return 'Pending';
  if (['draft'].includes(s)) return 'Draft';
  if (['archived', 'archive'].includes(s)) return 'Archived';
  // Keep unknown labels as-is (badge falls back to neutral style)
  return raw.trim();
}

/** Parse a Monday timeline text like "2025-01-01 - 2025-02-01". */
function parseTimeline(text?: string): { start?: string; end?: string } {
  if (!text) return {};
  const parts = text.split(' - ').map((p) => p.trim());
  if (parts.length === 2) return { start: parts[0], end: parts[1] };
  return {};
}

function mapItemToQuestRow(item: MondayItem): SyncQuestRow {
  const timeline = parseTimeline(pick(item, 'timeline', 'dates'));

  return {
    mondayId: item.id,
    title: item.name,
    questNumber: pick(item, 'quest number', 'quest id', 'number', 'id'),
    titleHe: pick(item, 'title he', 'hebrew title', 'כותרת'),
    description: pick(item, 'description', 'short description', 'תיאור'),
    descriptionHe: pick(item, 'description he', 'hebrew description'),
    status: normalizeStatus(pick(item, 'status', 'סטטוס')),
    startDate: pick(item, 'start date', 'start') ?? timeline.start,
    endDate: pick(item, 'end date', 'end', 'due date', 'deadline') ?? timeline.end,
    creatorName: pick(item, 'creator', 'owner', 'person', 'people', 'אחראי'),
    detailsUrl: pick(item, 'details url', 'details link', 'details', 'more details'),
    submissionUrl: pick(
      item,
      'submission link',
      'submission url',
      'submission',
      'register link',
      'registration link'
    ),
  };
}

/**
 * GET — discovery: board name, its columns, and how the first items would map.
 * Use this to verify the column mapping before running a real sync.
 */
export async function GET() {
  try {
    const [board, items] = await Promise.all([getMondayBoardInfo(), getMondayItems()]);
    return NextResponse.json({
      data: {
        board: board.name,
        columns: board.columns,
        itemCount: items.length,
        sampleRaw: items.slice(0, 2),
        sampleMapped: items.slice(0, 2).map(mapItemToQuestRow),
      },
    });
  } catch (err) {
    console.error('[GET /api/sync/monday]', err);
    const message = err instanceof Error ? err.message : 'Discovery failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST — run the sync: pull all Monday items and upsert into Airtable. */
export async function POST() {
  try {
    const items = await getMondayItems();
    const rows = items.map(mapItemToQuestRow).filter((r) => r.title?.trim());
    const result = await upsertQuestsFromMonday(rows);

    return NextResponse.json({
      data: {
        pulled: items.length,
        created: result.created,
        updated: result.updated,
        ...(result.mondayIdFieldMissing && {
          warning:
            "Airtable has no 'mondayId' field — add a single-line-text field named mondayId to the Quests table for reliable re-sync matching.",
        }),
      },
    });
  } catch (err) {
    console.error('[POST /api/sync/monday]', err);
    const message = err instanceof Error ? err.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
