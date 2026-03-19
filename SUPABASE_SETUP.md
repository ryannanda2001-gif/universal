# Supabase Setup

## 1. Buat tabel `products`

Jalankan SQL ini di Supabase SQL Editor:

```sql
create table if not exists public.products (
  id bigint primary key,
  name text not null,
  price text not null,
  discount integer not null default 0,
  description text not null default '',
  category text not null default 'Laptop',
  images jsonb not null default '[]'::jsonb,
  stock integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;

create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();
```

## 2. Ambil environment variables

Di Supabase Project Settings > API, salin:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3. Pasang di local / Vercel

Isi `.env.local` untuk local development:

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Di Vercel, tambahkan env yang sama pada project settings.

## 4. Buat storage bucket

Di Supabase Storage:

1. Buat bucket bernama `products`
2. Set bucket menjadi `public`

Bucket ini dipakai untuk menyimpan foto produk.

## 5. Deploy

Setelah env terpasang:

1. Redeploy project di Vercel.
2. Buka `/admin`.
3. Tambah atau edit produk.
4. Homepage `/` akan otomatis membaca data yang sama dari Supabase.

## Catatan

- `SERVICE_ROLE_KEY` hanya dipakai di server lewat API route, jangan dipakai langsung di client component.
- Gambar baru akan di-upload ke Supabase Storage bucket `products`.
- Produk lama yang masih menyimpan base64 akan ikut berubah menjadi URL storage saat produk tersebut disimpan ulang.
