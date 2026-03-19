'use client';

import { useState } from 'react';

import { AboutSection } from '@/components/home/AboutSection';
import { HeroBanner } from '@/components/home/HeroBanner';
import { HomeHeader } from '@/components/home/HomeHeader';
import { ProductDetailModal } from '@/components/home/ProductDetailModal';
import { ProductsSection } from '@/components/home/ProductsSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StatsSection } from '@/components/home/StatsSection';
import { WhatsAppFloatingButton } from '@/components/home/WhatsAppFloatingButton';
import { useProducts } from '@/hooks/use-products';
import { filterProductsByCategory } from '@/lib/homepage';
import type { Product } from '@/lib/product-schema';

export default function Home() {
  const { products, isLoadingProducts, productsError } = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProducts = filterProductsByCategory(products, selectedCategory);

  const handleViewProduct = (product: Product) => {
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

      <HeroBanner />

      <ProductsSection
        products={products}
        filteredProducts={filteredProducts}
        isLoadingProducts={isLoadingProducts}
        productsError={productsError}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onViewProduct={handleViewProduct}
      />

      <ProductDetailModal
        product={selectedProduct}
        currentImageIndex={currentImageIndex}
        onClose={() => setSelectedProduct(null)}
        onPrevImage={handlePrevImage}
        onNextImage={handleNextImage}
        onSelectImage={setCurrentImageIndex}
      />

      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <SiteFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}
