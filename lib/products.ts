'use server';

import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { normalizeStoredProducts, type Product } from '@/lib/product-schema';

const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

export const readProducts = async () => {
  try {
    const raw = await readFile(productsFilePath, 'utf8');
    return normalizeStoredProducts(JSON.parse(raw));
  } catch {
    return [];
  }
};

export const writeProducts = async (products: Product[]) => {
  const normalizedProducts = normalizeStoredProducts(products);
  await mkdir(path.dirname(productsFilePath), { recursive: true });
  await writeFile(productsFilePath, JSON.stringify(normalizedProducts, null, 2), 'utf8');
  return normalizedProducts;
};
