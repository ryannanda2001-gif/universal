import { NextResponse } from 'next/server';

import { isAdminEmail } from '@/lib/auth';
import { readSiteContent, writeSiteContent } from '@/lib/site-content';
import { isSupabaseConfigured } from '@/lib/supabase-admin';
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const content = await readSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal memuat konten landing page.' }, { status: 500 });
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
    const saved = await writeSiteContent(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal menyimpan konten landing page.' }, { status: 400 });
  }
}
