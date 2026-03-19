'use client';

import type { Product } from '@/lib/product-schema';

const CATEGORY_COOKIE_NAME = 'uk_pref_categories';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const readPreferredCategories = () => {
  if (typeof document === 'undefined') return [];

  const rawCookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CATEGORY_COOKIE_NAME}=`))
    ?.split('=')[1];

  if (!rawCookie) return [];

  return safeDecode(rawCookie)
    .split('|')
    .map((value) => value.trim())
    .filter(Boolean);
};

export const rememberPreferredCategory = (category: string) => {
  if (typeof document === 'undefined' || !category || category === 'Semua') return;

  const nextCategories = [category, ...readPreferredCategories().filter((item) => item !== category)].slice(0, 5);
  document.cookie = `${CATEGORY_COOKIE_NAME}=${encodeURIComponent(nextCategories.join('|'))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

const buildSeededValue = (seed: number, key: number) => {
  const value = Math.sin(seed * 999 + key * 37) * 10000;
  return value - Math.floor(value);
};

export const orderProductsForVisitor = (products: Product[], preferredCategories: string[], seed: number) => {
  return [...products].sort((left, right) => {
    const leftPriority = preferredCategories.includes(left.category) ? preferredCategories.indexOf(left.category) : Number.MAX_SAFE_INTEGER;
    const rightPriority = preferredCategories.includes(right.category) ? preferredCategories.indexOf(right.category) : Number.MAX_SAFE_INTEGER;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return buildSeededValue(seed, left.id) - buildSeededValue(seed, right.id);
  });
};
