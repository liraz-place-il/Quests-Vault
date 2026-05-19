import { NextRequest, NextResponse } from 'next/server';
import { getQuests, createQuest } from '@/lib/airtable';
import type { QuestListParams } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const params: QuestListParams = {
      page: Number(searchParams.get('page') ?? 1),
      pageSize: Number(searchParams.get('pageSize') ?? 20),
      search: searchParams.get('search') ?? '',
      status: (searchParams.get('status') as QuestListParams['status']) ?? 'all',
      sortBy: (searchParams.get('sortBy') as QuestListParams['sortBy']) ?? 'updatedAt',
      sortDir: (searchParams.get('sortDir') as QuestListParams['sortDir']) ?? 'desc',
    };

    const { quests, total } = await getQuests(params);

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    const paginated = quests.slice(start, start + pageSize);

    return NextResponse.json({
      data: paginated,
      meta: { total, page, pageSize },
    });
  } catch (err) {
    console.error('[GET /api/quests]', err);
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const quest = await createQuest(body);
    return NextResponse.json({ data: quest }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/quests]', err);
    return NextResponse.json({ error: 'Failed to create quest' }, { status: 500 });
  }
}
