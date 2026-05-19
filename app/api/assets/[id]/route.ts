import { NextRequest, NextResponse } from 'next/server';
import { getAssetById, updateAsset, deleteAsset } from '@/lib/airtable';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const asset = await getAssetById(id);
    if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    return NextResponse.json({ data: asset });
  } catch (err) {
    console.error('[GET /api/assets/:id]', err);
    return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const asset = await updateAsset(id, body);
    return NextResponse.json({ data: asset });
  } catch (err) {
    console.error('[PATCH /api/assets/:id]', err);
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteAsset(id);
    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error('[DELETE /api/assets/:id]', err);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
