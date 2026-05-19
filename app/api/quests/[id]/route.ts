import { NextRequest, NextResponse } from 'next/server';
import { getQuestById, updateQuest, deleteQuest } from '@/lib/airtable';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quest = await getQuestById(id);
    if (!quest) return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    return NextResponse.json({ data: quest });
  } catch (err) {
    console.error('[GET /api/quests/:id]', err);
    return NextResponse.json({ error: 'Failed to fetch quest' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const quest = await updateQuest(id, body);
    return NextResponse.json({ data: quest });
  } catch (err) {
    console.error('[PATCH /api/quests/:id]', err);
    return NextResponse.json({ error: 'Failed to update quest' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteQuest(id);
    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error('[DELETE /api/quests/:id]', err);
    return NextResponse.json({ error: 'Failed to delete quest' }, { status: 500 });
  }
}
