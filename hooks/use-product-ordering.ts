'use client';

import { useMemo, useState } from 'react';

import type { Product } from '@/lib/product-schema';
import { orderProductsForVisitor, readPreferredCategories } from '@/lib/product-preferences';

export const useProductOrdering = (products: Product[]) => {
  const [preferredCategories] = useState<string[]>(() => readPreferredCategories());
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000));

  const orderedProducts = useMemo(
    () => orderProductsForVisitor(products, preferredCategories, seed),
    [preferredCategories, products, seed]
  );

  return orderedProducts;
};
