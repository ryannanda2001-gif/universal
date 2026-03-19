import { randomUUID } from 'crypto';

import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-admin';

const PRODUCTS_BUCKET = 'products';

const guessExtension = (mimeType: string) => {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    default:
      return 'bin';
  }
};

const isPublicImageUrl = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://');

const parseDataUrl = (value: string) => {
  const match = value.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;

  const [, mimeType, base64Data] = match;

  return {
    mimeType,
    buffer: Buffer.from(base64Data, 'base64'),
  };
};

export const uploadProductImages = async (productId: number, images: string[]) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const supabase = getSupabaseAdmin();
  const uploadedImages: string[] = [];

  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];

    if (!image) continue;

    if (isPublicImageUrl(image)) {
      uploadedImages.push(image);
      continue;
    }

    const parsed = parseDataUrl(image);

    if (!parsed) {
      uploadedImages.push(image);
      continue;
    }

    const extension = guessExtension(parsed.mimeType);
    const filePath = `product-${productId}/${Date.now()}-${index}-${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(PRODUCTS_BUCKET)
      .upload(filePath, parsed.buffer, {
        contentType: parsed.mimeType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload product image: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(PRODUCTS_BUCKET)
      .getPublicUrl(filePath);

    uploadedImages.push(publicUrlData.publicUrl);
  }

  return uploadedImages;
};
