export interface Product {
  id: number;
  name: string;
  price: string;
  discount?: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
}

type LegacyProduct = Partial<Product> & {
  image?: string;
  images?: string[] | string;
};

const parseNumericValue = (value: unknown, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value.replace(/\D/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const normalizeImageValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

export const normalizeStoredProducts = (rawProducts: unknown): Product[] => {
  if (!Array.isArray(rawProducts)) return [];

  return rawProducts.map((item, index) => {
    const product = item as LegacyProduct;
    const normalizedImages = Array.isArray(product.images)
      ? product.images.map(normalizeImageValue).filter(Boolean)
      : typeof product.images === 'string'
        ? [normalizeImageValue(product.images)].filter(Boolean)
        : [normalizeImageValue(product.image)].filter(Boolean);

    return {
      id: typeof product.id === 'number' ? product.id : index + 1,
      name: product.name ?? '',
      price: product.price ?? '0',
      discount: parseNumericValue(product.discount),
      description: product.description ?? '',
      category: product.category ?? 'Laptop',
      images: normalizedImages,
      stock: parseNumericValue(product.stock),
    };
  });
};
