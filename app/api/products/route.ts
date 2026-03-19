import { NextResponse } from 'next/server';

import { normalizeStoredProducts } from '@/lib/product-schema';
import { readProducts, writeProducts } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { message: 'Supabase belum dikonfigurasi. Tambahkan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 500 }
    );
  }

  try {
    const products = await readProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal memuat data produk.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { message: 'Supabase belum dikonfigurasi. Tambahkan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const normalizedProducts = normalizeStoredProducts(body);
    const savedProducts = await writeProducts(normalizedProducts);
    return NextResponse.json(savedProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal menyimpan data produk.' }, { status: 400 });
  }
}
