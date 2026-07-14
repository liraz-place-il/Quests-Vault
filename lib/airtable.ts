import Airtable from 'airtable';
import type { Quest, Asset, Category, QuestListParams } from '@/types';
import { computeQuestStatus, compareQuestNumbers } from '@/lib/utils';

function getBase() {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim();
  // Tolerate a pasted URL path like "app123.../tblXYZ..." — keep only the base id.
  const rawBaseId = process.env.AIRTABLE_BASE_ID?.trim();
  const baseId = rawBaseId?.match(/app[A-Za-z0-9]+/)?.[0] ?? rawBaseId;

  if (!apiKey) {
    throw new Error('AIRTABLE_API_KEY is not configured. Add it to .env.local');
  }
  if (!baseId) {
    throw new Error('AIRTABLE_BASE_ID is not configured. Add it to .env.local');
  }
  return new Airtable({ apiKey }).base(baseId);
}

const QuestsTable = () => getBase()('Quests');
const AssetsTable = () => getBase()('Assets');
const CategoriesTable = () => getBase()('Categories');

function parseQuest(record: Airtable.Record<Airtable.FieldSet>): Quest {
  const f = record.fields as Record<string, unknown>;
  const assetLinks = (f['Assets'] as string[]) ?? [];
  const rawStatus = ((f['status'] as string) ?? 'Draft') as Quest['status'];
  const endDate = (f['endDate'] as string) ?? undefined;
  return {
    id: record.id,
    questNumber: (f['questNumber'] as string) ?? record.id,
    title: (f['title'] as string) ?? '',
    titleHe: (f['titleHe'] as string) ?? undefined,
    description: (f['description'] as string) ?? '',
    descriptionHe: (f['descriptionHe'] as string) ?? undefined,
    // Auto-derive Expired when the end date has passed
    status: computeQuestStatus(rawStatus, endDate),
    startDate: (f['startDate'] as string) ?? undefined,
    endDate,
    creatorName: (f['creatorName'] as string) ?? 'Unknown',
    assetCount: assetLinks.length,
    categoryIds: (f['categories'] as string[]) ?? [],
    detailsUrl: (f['detailsUrl'] as string) ?? undefined,
    submissionUrl: (f['submissionUrl'] as string) ?? undefined,
    updatedAt: (f['updatedAt'] as string) ?? new Date().toISOString(),
    createdAt: (f['createdAt'] as string) ?? new Date().toISOString(),
  };
}

function parseAsset(record: Airtable.Record<Airtable.FieldSet>): Asset {
  const f = record.fields as Record<string, unknown>;
  const questLinks = (f['quest'] as string[]) ?? [];
  return {
    id: record.id,
    title: (f['title'] as string) ?? '',
    titleHe: (f['titleHe'] as string) ?? undefined,
    description: (f['description'] as string) ?? undefined,
    descriptionHe: (f['descriptionHe'] as string) ?? undefined,
    richContent: (f['richContent'] as string) ?? undefined,
    richContentHe: (f['richContentHe'] as string) ?? undefined,
    fileType: ((f['fileType'] as string) ?? 'OTHER') as Asset['fileType'],
    fileSize: (f['fileSize'] as number) ?? undefined,
    fileName: (f['fileName'] as string) ?? '',
    cloudinaryId: (f['cloudinaryId'] as string) ?? '',
    cloudinaryUrl: (f['cloudinaryUrl'] as string) ?? '',
    thumbnailUrl: (f['thumbnailUrl'] as string) ?? undefined,
    isPublic: (f['isPublic'] as boolean) ?? false,
    downloadCount: (f['downloadCount'] as number) ?? 0,
    creatorName: (f['creatorName'] as string) ?? 'Unknown',
    questId: questLinks[0] ?? '',
    createdAt: (f['createdAt'] as string) ?? new Date().toISOString(),
    updatedAt: (f['updatedAt'] as string) ?? new Date().toISOString(),
  };
}

function parseCategory(record: Airtable.Record<Airtable.FieldSet>): Category {
  const f = record.fields as Record<string, unknown>;
  return {
    id: record.id,
    name: (f['name'] as string) ?? '',
    nameHe: (f['nameHe'] as string) ?? undefined,
    color: (f['color'] as string) ?? undefined,
  };
}

export async function getQuests(params: QuestListParams = {}): Promise<{
  quests: Quest[];
  total: number;
}> {
  const {
    search = '',
    status = 'all',
    sortBy = 'questNumber',
    sortDir = 'asc',
  } = params;

  // Search filters on text fields (safe in Airtable formula).
  // Status is filtered in JS below because the effective status is
  // derived (auto-Expired), which Airtable can't compute.
  let filterFormula = '';
  if (search.trim()) {
    const s = search.replace(/'/g, "\\'");
    filterFormula = `OR(FIND(LOWER('${s}'), LOWER({title})), FIND(LOWER('${s}'), LOWER({questNumber})), FIND(LOWER('${s}'), LOWER({description})))`;
  }

  const records = await QuestsTable().select({
    ...(filterFormula ? { filterByFormula: filterFormula } : {}),
    // Sort by title in Airtable only (safe field); date/updatedAt sorts handled in JS below
    ...(sortBy === 'title' ? { sort: [{ field: 'title', direction: sortDir }] } : {}),
  }).all();

  let quests = records.map(parseQuest);

  // Filter by derived status in JS
  if (status && status !== 'all') {
    quests = quests.filter(
      (q) => q.status.toLowerCase() === status.toLowerCase()
    );
  }

  // JS-level sort (Airtable formula sort only handled 'title' above;
  // auto-timestamp field names vary per base, and questNumber needs
  // numeric-aware comparison since IDs are inconsistently zero-padded).
  if (sortBy !== 'title') {
    quests = quests.sort((a, b) => {
      let cmp: number;
      if (sortBy === 'questNumber') {
        cmp = compareQuestNumbers(a.questNumber, b.questNumber);
      } else if (sortBy === 'status') {
        cmp = a.status.localeCompare(b.status);
      } else if (sortBy === 'updatedAt') {
        cmp = (a.updatedAt ?? '').localeCompare(b.updatedAt ?? '');
      } else {
        cmp = (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  return { quests, total: quests.length };
}

export async function getQuestById(id: string): Promise<Quest | null> {
  try {
    const record = await QuestsTable().find(id);
    return parseQuest(record);
  } catch {
    return null;
  }
}

export async function getAssetsByQuestId(questId: string): Promise<Asset[]> {
  const records = await AssetsTable().select({
    filterByFormula: `FIND('${questId}', ARRAYJOIN({quest}))`,
    sort: [{ field: 'createdAt', direction: 'asc' }],
  }).all();

  return records.map(parseAsset);
}

export async function getAssetById(id: string): Promise<Asset | null> {
  try {
    const record = await AssetsTable().find(id);
    return parseAsset(record);
  } catch {
    return null;
  }
}

export async function incrementDownloadCount(assetId: string): Promise<void> {
  const table = AssetsTable();
  const record = await table.find(assetId);
  const current = (record.fields['downloadCount'] as number) ?? 0;
  await table.update(assetId, { downloadCount: current + 1 });
}

export async function getCategories(): Promise<Category[]> {
  const records = await CategoriesTable().select({
    sort: [{ field: 'name', direction: 'asc' }],
  }).all();
  return records.map(parseCategory);
}

export async function createQuest(data: Partial<Quest>): Promise<Quest> {
  const record = await QuestsTable().create({
    questNumber: data.questNumber,
    title: data.title,
    titleHe: data.titleHe,
    description: data.description,
    descriptionHe: data.descriptionHe,
    status: data.status ?? 'Draft',
    startDate: data.startDate,
    endDate: data.endDate,
    creatorName: data.creatorName,
  });
  return parseQuest(record);
}

export async function updateQuest(id: string, data: Partial<Quest>): Promise<Quest> {
  const record = await QuestsTable().update(id, {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.titleHe !== undefined && { titleHe: data.titleHe }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.descriptionHe !== undefined && { descriptionHe: data.descriptionHe }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.startDate !== undefined && { startDate: data.startDate }),
    ...(data.endDate !== undefined && { endDate: data.endDate }),
    ...(data.creatorName !== undefined && { creatorName: data.creatorName }),
    ...(data.questNumber !== undefined && { questNumber: data.questNumber }),
  });
  return parseQuest(record);
}

export async function deleteQuest(id: string): Promise<void> {
  await QuestsTable().destroy(id);
}

export async function createAsset(data: Partial<Asset>): Promise<Asset> {
  const record = await AssetsTable().create({
    title: data.title,
    titleHe: data.titleHe,
    description: data.description,
    descriptionHe: data.descriptionHe,
    richContent: data.richContent,
    richContentHe: data.richContentHe,
    fileType: data.fileType,
    fileSize: data.fileSize,
    fileName: data.fileName,
    cloudinaryId: data.cloudinaryId,
    cloudinaryUrl: data.cloudinaryUrl,
    thumbnailUrl: data.thumbnailUrl,
    isPublic: data.isPublic ?? false,
    downloadCount: 0,
    creatorName: data.creatorName,
    quest: data.questId ? [data.questId] : [],
  });
  return parseAsset(record);
}

export async function updateAsset(id: string, data: Partial<Asset>): Promise<Asset> {
  const updateData: Airtable.FieldSet = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.titleHe !== undefined) updateData.titleHe = data.titleHe;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.descriptionHe !== undefined) updateData.descriptionHe = data.descriptionHe;
  if (data.richContent !== undefined) updateData.richContent = data.richContent;
  if (data.richContentHe !== undefined) updateData.richContentHe = data.richContentHe;
  if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
  if (data.fileSize !== undefined) updateData.fileSize = data.fileSize;
  if (data.creatorName !== undefined) updateData.creatorName = data.creatorName;
  const record = await AssetsTable().update(id, updateData);
  return parseAsset(record);
}

export async function deleteAsset(id: string): Promise<void> {
  await AssetsTable().destroy(id);
}

// ---------------------------------------------------------------------------
// Monday.com -> Airtable sync
// ---------------------------------------------------------------------------

export interface SyncQuestRow {
  mondayId: string;
  questNumber?: string;
  title: string;
  titleHe?: string;
  description?: string;
  descriptionHe?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  creatorName?: string;
  detailsUrl?: string;
  submissionUrl?: string;
}

function isUnknownFieldError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { error?: string }).error === 'UNKNOWN_FIELD_NAME'
  );
}

/**
 * Upsert quests coming from Monday into the Airtable Quests table.
 * Match order: mondayId field -> questNumber -> exact title.
 * Uses typecast so new single-select status options are auto-created.
 * If the optional `mondayId` field doesn't exist in Airtable, the sync
 * retries without it (matching then falls back to questNumber/title).
 */
export async function upsertQuestsFromMonday(rows: SyncQuestRow[]): Promise<{
  created: number;
  updated: number;
  mondayIdFieldMissing: boolean;
}> {
  const table = QuestsTable();
  const existing = await table.select().all();

  const byMondayId = new Map<string, string>();
  const byQuestNumber = new Map<string, string>();
  const byTitle = new Map<string, string>();
  for (const rec of existing) {
    const f = rec.fields as Record<string, unknown>;
    if (f['mondayId']) byMondayId.set(String(f['mondayId']), rec.id);
    if (f['questNumber']) byQuestNumber.set(String(f['questNumber']), rec.id);
    if (f['title']) byTitle.set(String(f['title']).trim().toLowerCase(), rec.id);
  }

  let created = 0;
  let updated = 0;
  let mondayIdFieldMissing = false;

  const buildFields = (row: SyncQuestRow, includeMondayId: boolean): Airtable.FieldSet => {
    const fields: Airtable.FieldSet = { title: row.title };
    if (includeMondayId) fields.mondayId = row.mondayId;
    if (row.questNumber) fields.questNumber = row.questNumber;
    if (row.titleHe) fields.titleHe = row.titleHe;
    if (row.description) fields.description = row.description;
    if (row.descriptionHe) fields.descriptionHe = row.descriptionHe;
    if (row.status) fields.status = row.status;
    if (row.startDate) fields.startDate = row.startDate;
    if (row.endDate) fields.endDate = row.endDate;
    if (row.creatorName) fields.creatorName = row.creatorName;
    if (row.detailsUrl) fields.detailsUrl = row.detailsUrl;
    if (row.submissionUrl) fields.submissionUrl = row.submissionUrl;
    return fields;
  };

  for (const row of rows) {
    const matchId =
      byMondayId.get(row.mondayId) ??
      (row.questNumber ? byQuestNumber.get(row.questNumber) : undefined) ??
      byTitle.get(row.title.trim().toLowerCase());

    const doWrite = async (includeMondayId: boolean) => {
      if (matchId) {
        await table.update(matchId, buildFields(row, includeMondayId), { typecast: true });
        updated++;
      } else {
        await table.create(buildFields(row, includeMondayId), { typecast: true });
        created++;
      }
    };

    try {
      await doWrite(!mondayIdFieldMissing);
    } catch (err) {
      if (!mondayIdFieldMissing && isUnknownFieldError(err)) {
        mondayIdFieldMissing = true;
        await doWrite(false);
      } else {
        throw err;
      }
    }
  }

  return { created, updated, mondayIdFieldMissing };
}
