import { normalizeStoredProducts, type Product } from '@/lib/product-schema';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-admin';

export const readProducts = async () => {
  if (!isSupabaseConfigured) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, discount, description, category, images, stock')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`Failed to load products from Supabase: ${error.message}`);
  }

  return normalizeStoredProducts(data);
};

export const writeProducts = async (products: Product[]) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const normalizedProducts = normalizeStoredProducts(products);
  const supabase = getSupabaseAdmin();

  const incomingIds = normalizedProducts.map((product) => product.id);

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

  if (normalizedProducts.length > 0) {
    const { error: upsertError } = await supabase
      .from('products')
      .upsert(normalizedProducts, { onConflict: 'id' });

    if (upsertError) {
      throw new Error(`Failed to save products to Supabase: ${upsertError.message}`);
    }
  }

  return normalizedProducts;
};
