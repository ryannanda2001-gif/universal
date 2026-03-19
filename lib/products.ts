import { normalizeStoredProducts, type Product } from '@/lib/product-schema';
import { uploadProductImages } from '@/lib/product-images';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-admin';

const PRODUCT_COLUMNS_WITH_CONDITION = 'id, name, price, discount, description, category, condition, images, stock';
const PRODUCT_COLUMNS_LEGACY = 'id, name, price, discount, description, category, images, stock';

const isMissingConditionColumnError = (message: string) => {
  const normalizedMessage = message.toLowerCase();
  return normalizedMessage.includes('condition') && normalizedMessage.includes('column');
};

export const readProducts = async () => {
  if (!isSupabaseConfigured) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const primaryQuery = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS_WITH_CONDITION)
    .order('id', { ascending: true });

  if (primaryQuery.error) {
    if (!isMissingConditionColumnError(primaryQuery.error.message)) {
      throw new Error(`Failed to load products from Supabase: ${primaryQuery.error.message}`);
    }

    const legacyQuery = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS_LEGACY)
      .order('id', { ascending: true });

    if (legacyQuery.error) {
      throw new Error(`Failed to load products from Supabase: ${legacyQuery.error.message}`);
    }

    return normalizeStoredProducts(legacyQuery.data);
  }

  return normalizeStoredProducts(primaryQuery.data);
};

export const writeProducts = async (products: Product[]) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const normalizedProducts = normalizeStoredProducts(products);
  const productsWithUploadedImages: Product[] = [];

  for (const product of normalizedProducts) {
    const uploadedImages = await uploadProductImages(product.id, product.images);
    productsWithUploadedImages.push({
      ...product,
      images: uploadedImages,
    });
  }

  const supabase = getSupabaseAdmin();
  const incomingIds = productsWithUploadedImages.map((product) => product.id);

  const { data: existingProducts, error: existingError } = await supabase
    .from('products')
    .select('id');

  if (existingError) {
    throw new Error(`Failed to read existing products from Supabase: ${existingError.message}`);
  }

  const idsToDelete = (existingProducts ?? [])
    .map((product) => product.id)
    .filter((id) => !incomingIds.includes(id));

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) {
      throw new Error(`Failed to delete removed products from Supabase: ${deleteError.message}`);
    }
  }

  if (productsWithUploadedImages.length > 0) {
    const withConditionUpsert = await supabase
      .from('products')
      .upsert(productsWithUploadedImages, { onConflict: 'id' });

    if (withConditionUpsert.error) {
      if (!isMissingConditionColumnError(withConditionUpsert.error.message)) {
        throw new Error(`Failed to save products to Supabase: ${withConditionUpsert.error.message}`);
      }

      const legacyProducts = productsWithUploadedImages.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        description: product.description,
        category: product.category,
        images: product.images,
        stock: product.stock,
      }));
      const legacyUpsert = await supabase
        .from('products')
        .upsert(legacyProducts, { onConflict: 'id' });

      if (legacyUpsert.error) {
        throw new Error(`Failed to save products to Supabase: ${legacyUpsert.error.message}`);
      }
    }
  }

  return productsWithUploadedImages;
};
