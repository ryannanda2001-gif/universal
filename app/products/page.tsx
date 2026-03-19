'use client';

import { useState } from 'react';

import { HomeHeader } from '@/components/home/HomeHeader';
import { ProductDetailModal } from '@/components/home/ProductDetailModal';
import { ProductCard } from '@/components/home/ProductCard';
import { SiteFooter } from '@/components/home/SiteFooter';
import { WhatsAppFloatingButton } from '@/components/home/WhatsAppFloatingButton';
import { useProductOrdering } from '@/hooks/use-product-ordering';
import { useProducts } from '@/hooks/use-products';
import { HOMEPAGE_CATEGORIES, filterProductsByCategory } from '@/lib/homepage';
import { rememberPreferredCategory } from '@/lib/product-preferences';
import type { Product } from '@/lib/product-schema';

export default function ProductsPage() {
  const { products, isLoadingProducts, productsError } = useProducts();
  const orderedProducts = useProductOrdering(products);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProducts = filterProductsByCategory(orderedProducts, selectedCategory);

  const handleViewProduct = (product: Product) => {
    rememberPreferredCategory(product.category);
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (!selectedProduct || selectedProduct.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!selectedProduct || selectedProduct.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        onCloseMenu={() => setIsMenuOpen(false)}
      />

      <section className="py-12 md:py-16 px-4 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold font-brand text-gray-900 mb-3">Semua Produk</h1>
            <p className="text-gray-600 text-lg">Tampilan lengkap semua produk dengan urutan yang menyesuaikan preferensi pengunjung.</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {HOMEPAGE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  rememberPreferredCategory(category);
                  setSelectedCategory(category);
                }}
                className={`px-5 py-2 rounded-full font-semibold transition-all ${
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
            <div className="text-center py-16 text-gray-600 text-lg">Sedang memuat produk...</div>
          ) : productsError ? (
            <div className="text-center py-16">
              <p className="text-red-600 text-lg mb-2">Produk belum bisa dimuat</p>
              <p className="text-gray-500">{productsError}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-600 text-lg">Belum ada produk yang cocok di kategori ini.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetail={handleViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        currentImageIndex={currentImageIndex}
        onClose={() => setSelectedProduct(null)}
        onPrevImage={handlePrevImage}
        onNextImage={handleNextImage}
        onSelectImage={setCurrentImageIndex}
      />

      <SiteFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}
