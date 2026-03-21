import Link from 'next/link';
import { useRef } from 'react';

import type { Product } from '@/lib/product-schema';
import { HOMEPAGE_CATEGORIES } from '@/lib/homepage';

import { ProductCard } from './ProductCard';

type ProductsSectionProps = {
  products: Product[];
  filteredProducts: Product[];
  isLoadingProducts: boolean;
  productsError: string;
  selectedCategory: string;
  badge: string;
  title: string;
  description: string;
  onSelectCategory: (category: string) => void;
  onViewProduct: (product: Product) => void;
};

export function ProductsSection({
  products,
  filteredProducts,
  isLoadingProducts,
  productsError,
  selectedCategory,
  badge,
  title,
  description,
  onSelectCategory,
  onViewProduct,
}: ProductsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollProducts = (direction: 'left' | 'right') => {
    if (!scrollerRef.current) return;
    const offset = scrollerRef.current.clientWidth * 0.9;
    scrollerRef.current.scrollBy({
      left: direction === 'right' ? offset : -offset,
      behavior: 'smooth',
    });
  };

  return (
    <section id="beli" className="bg-linear-to-b from-white via-slate-50 to-white px-4 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl animate-fade-in-up">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">{badge}</p>
              <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">{title}</h2>
              <p className="text-base leading-7 text-slate-600">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => scrollProducts('left')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600"
                aria-label="Geser produk ke kiri"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={() => scrollProducts('right')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600"
                aria-label="Geser produk ke kanan"
              >
                &gt;
              </button>
              <Link
                href="/products"
                className="rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Lihat Semua Produk
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {HOMEPAGE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>*Harga dapat berubah sewaktu-waktu mengikuti stok dan kondisi barang.</p>
            <p>{filteredProducts.length} produk tampil di etalase ini</p>
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="py-16 text-center">
            <p className="text-lg text-slate-600">Sedang memuat produk...</p>
          </div>
        ) : productsError ? (
          <div className="py-16 text-center">
            <p className="mb-2 text-lg text-red-600">Produk belum bisa dimuat</p>
            <p className="text-slate-500">{productsError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-4 text-lg text-slate-600">Belum ada produk ditambahkan</p>
            <p className="text-slate-500">Hubungi admin untuk informasi produk terbaru</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-slate-600">Tidak ada produk di kategori ini</p>
          </div>
        ) : (
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-4 scrollbar-hide"
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`w-[220px] shrink-0 snap-start sm:w-[240px] md:w-[280px] ${
                  index % 4 === 1 ? 'animation-delay-200' : index % 4 === 2 ? 'animation-delay-400' : ''
                }`}
              >
                <ProductCard product={product} onViewDetail={onViewProduct} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
