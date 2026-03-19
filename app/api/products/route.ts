import { NextResponse } from 'next/server';

import { normalizeStoredProducts } from '@/lib/product-schema';
import { readProducts, writeProducts } from '@/lib/products';

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const normalizedProducts = normalizeStoredProducts(body);
    const savedProducts = await writeProducts(normalizedProducts);
    return NextResponse.json(savedProducts);
  } catch {
    return NextResponse.json({ message: 'Data produk tidak valid.' }, { status: 400 });
  }
}
