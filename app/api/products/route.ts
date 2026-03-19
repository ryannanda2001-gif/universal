import { NextResponse } from 'next/server';

import { isAdminEmail } from '@/lib/auth';
import { normalizeStoredProducts } from '@/lib/product-schema';
import { deleteProductById, readProducts, replaceAllProducts, upsertProduct } from '@/lib/products';
import { isSupabaseConfigured } from '@/lib/supabase-admin';
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';

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
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let savedProducts;

    if (body?.action === 'replace_all') {
      const normalizedProducts = normalizeStoredProducts(body.products);
      savedProducts = await replaceAllProducts(normalizedProducts);
    } else if (body?.action === 'upsert') {
      const normalizedProduct = normalizeStoredProducts([body.product])[0];
      savedProducts = await upsertProduct(normalizedProduct);
    } else if (body?.action === 'delete') {
      const productId = Number(body.id);
      if (!Number.isFinite(productId)) {
        return NextResponse.json({ message: 'ID produk tidak valid.' }, { status: 400 });
      }

      savedProducts = await deleteProductById(productId);
    } else {
      return NextResponse.json({ message: 'Payload produk tidak dikenali.' }, { status: 400 });
    }

    return NextResponse.json(savedProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal menyimpan data produk.' }, { status: 400 });
  }
}
