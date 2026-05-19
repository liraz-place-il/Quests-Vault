import { NextRequest, NextResponse } from 'next/server';
import { generateUploadSignature } from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
  try {
    const folder = req.nextUrl.searchParams.get('folder') ?? 'quest-vault/assets';
    const sig = generateUploadSignature(folder);
    return NextResponse.json({ data: sig });
  } catch (err) {
    console.error('[GET /api/upload]', err);
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 });
  }
}
