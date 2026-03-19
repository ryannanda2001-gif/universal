'use client';

import { useEffect, useState } from 'react';

import type { Product } from '@/lib/product-schema';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        if (!response.ok) {
          const errorData = (await response.json()) as { message?: string };
          throw new Error(errorData.message || 'Gagal memuat produk');
        }

        const data = (await response.json()) as Product[];

        if (data.length === 0 && typeof window !== 'undefined') {
          const legacyProducts = localStorage.getItem('products');
          if (legacyProducts) {
            const migrateResponse = await fetch('/api/products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: legacyProducts,
            });

            if (migrateResponse.ok) {
              const migratedProducts = (await migrateResponse.json()) as Product[];
              setProducts(migratedProducts);
              setProductsError('');
              return;
            }
          }
        }

        setProducts(data);
        setProductsError('');
      } catch (error) {
        console.error(error);
        setProducts([]);
        setProductsError(error instanceof Error ? error.message : 'Gagal memuat produk.');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  return {
    products,
    isLoadingProducts,
    productsError,
  };
};
