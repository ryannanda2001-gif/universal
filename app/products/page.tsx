'use client';

import { useState } from 'react';

import { HomeHeader } from '@/components/home/HomeHeader';
import { ProductDetailModal } from '@/components/home/ProductDetailModal';
import { ProductCard } from '@/components/home/ProductCard';
import { SiteFooter } from '@/components/home/SiteFooter';
import { WhatsAppFloatingButton } from '@/components/home/WhatsAppFloatingButton';
import { useProductOrdering } from '@/hooks/use-product-ordering';
import { useProducts } from '@/hooks/use-products';
import { useSiteContent } from '@/hooks/use-site-content';
import { HOMEPAGE_CATEGORIES, filterProductsByCategory } from '@/lib/homepage';
import { rememberPreferredCategory } from '@/lib/product-preferences';
import type { Product } from '@/lib/product-schema';

export default function ProductsPage() {
  const { products, isLoadingProducts, productsError } = useProducts();
  const { siteContent } = useSiteContent();
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

      <section className="bg-linear-to-b from-white via-slate-50 to-white px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] backdrop-blur md:p-8">
            <h1 className="mb-3 text-3xl font-bold font-brand text-slate-900 md:text-4xl">Semua Produk</h1>
            <p className="text-lg text-slate-600">Tampilan lengkap semua produk dengan urutan yang menyesuaikan preferensi pengunjung.</p>
          </div>

          <div className="mb-10 flex flex-wrap gap-2">
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
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
            <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`${index % 4 === 1 ? 'animation-delay-200' : index % 4 === 2 ? 'animation-delay-400' : ''} h-full`}
                >
                  <ProductCard product={product} onViewDetail={handleViewProduct} />
                </div>
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

      <SiteFooter
        badge={siteContent.footerBadge}
        title={siteContent.footerTitle}
        description={siteContent.footerDescription}
        phone={siteContent.contactPhone}
        email={siteContent.contactEmail}
        addressLine1={siteContent.contactAddressLine1}
        addressLine2={siteContent.contactAddressLine2}
        instagramUrl={siteContent.instagramUrl}
        instagramLabel={siteContent.instagramLabel}
        facebookUrl={siteContent.facebookUrl}
        facebookLabel={siteContent.facebookLabel}
        mapsEmbedUrl={siteContent.mapsEmbedUrl}
        mapsLabel={siteContent.mapsLabel}
      />
      <WhatsAppFloatingButton />
    </div>
  );
}
