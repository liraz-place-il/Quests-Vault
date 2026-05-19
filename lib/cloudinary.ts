import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function generateSignedDownloadUrl(
  publicId: string,
  resourceType: 'image' | 'raw' = 'raw',
  expiresInSeconds = 300
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return cloudinary.url(publicId, {
    sign_url: true,
    expires_at: expiresAt,
    resource_type: resourceType,
    type: 'authenticated',
    attachment: true,
  });
}

export function generatePublicUrl(publicId: string, resourceType: 'image' | 'raw' = 'raw'): string {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: 'upload',
    secure: true,
  });
}

export function generateUploadSignature(folder = 'quest-vault/assets'): {
  signature: string;
  timestamp: number;
  api_key: string;
  folder: string;
} {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, folder, upload_preset: undefined };
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  ) as Record<string, string | number>;

  const signature = cloudinary.utils.api_sign_request(
    cleanParams,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY!,
    folder,
  };
}

export function getResourceTypeForFileType(fileType: string): 'image' | 'raw' {
  const imageTypes = ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF'];
  return imageTypes.includes(fileType.toUpperCase()) ? 'image' : 'raw';
}

export { cloudinary };
