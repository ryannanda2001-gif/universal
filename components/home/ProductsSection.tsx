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
  onSelectCategory: (category: string) => void;
  onViewProduct: (product: Product) => void;
};

export function ProductsSection({
  products,
  filteredProducts,
  isLoadingProducts,
  productsError,
  selectedCategory,
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
    <section id="beli" className="py-12 md:py-16 px-4 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Produk & Paket Kami
          </h2>
          <p className="text-gray-600 text-lg">Pilih kategori untuk melihat produk yang tersedia</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {HOMEPAGE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-sm text-gray-500">Tampilan homepage dibatasi 2 baris agar lebih rapi di mobile dan desktop.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollProducts('left')}
              className="h-10 w-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              aria-label="Geser produk ke kiri"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollProducts('right')}
              className="h-10 w-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              aria-label="Geser produk ke kanan"
            >
              ›
            </button>
            <Link
              href="/products"
              className="px-4 py-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all"
            >
              Lihat Semua
            </Link>
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Sedang memuat produk...</p>
          </div>
        ) : productsError ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg mb-2">Produk belum bisa dimuat</p>
            <p className="text-gray-500">{productsError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">Belum ada produk ditambahkan</p>
            <p className="text-gray-500">Hubungi admin untuk informasi produk terbaru</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Tidak ada produk di kategori ini</p>
          </div>
        ) : (
          <div
            ref={scrollerRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-[minmax(165px,1fr)] md:auto-cols-[220px] gap-4 overflow-x-auto pb-4 scrollbar-hide"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetail={onViewProduct} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
