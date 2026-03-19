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
  return (
    <section id="beli" className="py-12 md:py-16 px-4 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Produk & Paket Kami
          </h2>
          <p className="text-gray-600 text-lg">Pilih kategori untuk melihat produk yang tersedia</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12 justify-center">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetail={onViewProduct} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
