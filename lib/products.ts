import { normalizeStoredProducts, type Product } from '@/lib/product-schema';
import { uploadProductImages } from '@/lib/product-images';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-admin';

const PRODUCT_COLUMNS_WITH_CONDITION = 'id, name, price, discount, description, category, condition, images, stock';
const PRODUCT_COLUMNS_LEGACY = 'id, name, price, discount, description, category, images, stock';

const isMissingConditionColumnError = (message: string) => {
  const normalizedMessage = message.toLowerCase();
  return normalizedMessage.includes('condition') && normalizedMessage.includes('column');
};

const loadProductsInternal = async () => {
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

    return {
      products: normalizeStoredProducts(legacyQuery.data),
      hasConditionColumn: false,
    };
  }

  return {
    products: normalizeStoredProducts(primaryQuery.data),
    hasConditionColumn: true,
  };
};

const prepareUploadedProduct = async (product: Product): Promise<Product> => {
  const normalizedProduct = normalizeStoredProducts([product])[0];
  const uploadedImages = await uploadProductImages(normalizedProduct.id, normalizedProduct.images);

  return {
    ...normalizedProduct,
    images: uploadedImages,
  };
};

const upsertProductsInternal = async (products: Product[], hasConditionColumn: boolean) => {
  const supabase = getSupabaseAdmin();

  if (hasConditionColumn) {
    const { error } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'id' });

    if (!error) return;

    if (!isMissingConditionColumnError(error.message)) {
      throw new Error(`Failed to save products to Supabase: ${error.message}`);
    }
  }

  const legacyProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    discount: product.discount,
    description: product.description,
    category: product.category,
    images: product.images,
    stock: product.stock,
  }));

  const { error } = await supabase
    .from('products')
    .upsert(legacyProducts, { onConflict: 'id' });

  if (error) {
    throw new Error(`Failed to save products to Supabase: ${error.message}`);
  }
};

export const readProducts = async () => {
  if (!isSupabaseConfigured) {
    return [];
  }

  const { products } = await loadProductsInternal();
  return products;
};

export const upsertProduct = async (product: Product) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const uploadedProduct = await prepareUploadedProduct(product);
  const { hasConditionColumn } = await loadProductsInternal();
  await upsertProductsInternal([uploadedProduct], hasConditionColumn);

  return readProducts();
};

export const deleteProductById = async (id: number) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete product from Supabase: ${error.message}`);
  }

  return readProducts();
};

export const replaceAllProducts = async (products: Product[]) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const normalizedProducts = normalizeStoredProducts(products);
  const uploadedProducts: Product[] = [];

  for (const product of normalizedProducts) {
    uploadedProducts.push(await prepareUploadedProduct(product));
  }

  const { products: existingProducts, hasConditionColumn } = await loadProductsInternal();
  const incomingIds = uploadedProducts.map((product) => product.id);
  const idsToDelete = existingProducts
    .map((product) => product.id)
    .filter((existingId) => !incomingIds.includes(existingId));

  const supabase = getSupabaseAdmin();

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) {
      throw new Error(`Failed to delete removed products from Supabase: ${deleteError.message}`);
    }
  }

  if (uploadedProducts.length > 0) {
    await upsertProductsInternal(uploadedProducts, hasConditionColumn);
  }

  return readProducts();
};
