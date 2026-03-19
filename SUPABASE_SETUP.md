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

## 2. Buat akun admin

Di Supabase Authentication:

1. Buka menu `Authentication`
2. Buka `Users`
3. Buat satu user admin dengan email Anda sendiri
4. Simpan email itu karena akan dipakai sebagai `ADMIN_EMAIL`

Disarankan:

- nonaktifkan public signups agar orang lain tidak bisa mendaftar bebas
- hanya gunakan akun admin Anda untuk login ke `/login`

## 3. Ambil environment variables

Di Supabase Project Settings > API, salin:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

`NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_URL` bisa memakai URL project yang sama.

## 4. Pasang di local / Vercel

Isi `.env.local` untuk local development:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=admin@emailanda.com
```

Di Vercel, tambahkan env yang sama pada project settings.

## 5. Buat storage bucket

Di Supabase Storage:

1. Buat bucket bernama `products`
2. Set bucket menjadi `public`

Bucket ini dipakai untuk menyimpan foto produk.

## 6. Deploy

Setelah env terpasang:

1. Redeploy project di Vercel.
2. Buka `/login`.
3. Login dengan akun admin Supabase Anda.
4. Buka `/admin`.
5. Tambah atau edit produk.
6. Homepage `/` akan otomatis membaca data yang sama dari Supabase.

## Catatan

- `SERVICE_ROLE_KEY` hanya dipakai di server lewat API route, jangan dipakai langsung di client component.
- Gambar baru akan di-upload ke Supabase Storage bucket `products`.
- Produk lama yang masih menyimpan base64 akan ikut berubah menjadi URL storage saat produk tersebut disimpan ulang.
- Route `/admin` dan API edit produk sekarang hanya bisa dipakai oleh email yang cocok dengan `ADMIN_EMAIL`.
