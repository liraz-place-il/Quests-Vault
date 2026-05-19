import { NextRequest, NextResponse } from 'next/server';
import { getAssetsByQuestId } from '@/lib/airtable';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const assets = await getAssetsByQuestId(id);
    return NextResponse.json({ data: assets });
  } catch (err) {
    console.error('[GET /api/quests/:id/assets]', err);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}
