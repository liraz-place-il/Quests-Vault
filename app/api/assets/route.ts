import { NextRequest, NextResponse } from 'next/server';
import { createAsset } from '@/lib/airtable';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const asset = await createAsset(body);
    return NextResponse.json({ data: asset }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/assets]', err);
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}
