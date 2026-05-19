import { NextRequest, NextResponse } from 'next/server';
import { getAssetById, incrementDownloadCount } from '@/lib/airtable';
import { generateSignedDownloadUrl, getResourceTypeForFileType } from '@/lib/cloudinary';

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const asset = await getAssetById(id);

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const resourceType = getResourceTypeForFileType(asset.fileType);

    let signedUrl: string;
    if (asset.isPublic) {
      signedUrl = asset.cloudinaryUrl;
    } else {
      signedUrl = generateSignedDownloadUrl(asset.cloudinaryId, resourceType);
    }

    await incrementDownloadCount(id);

    return NextResponse.json({
      data: {
        url: signedUrl,
        fileName: asset.fileName,
        fileType: asset.fileType,
        expiresAt: asset.isPublic ? null : new Date(Date.now() + 300_000).toISOString(),
      },
    });
  } catch (err) {
    console.error('[POST /api/assets/:id/download]', err);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
