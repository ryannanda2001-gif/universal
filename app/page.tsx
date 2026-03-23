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
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { useProductOrdering } from '@/hooks/use-product-ordering';
import { useProducts } from '@/hooks/use-products';
import { useSiteContent } from '@/hooks/use-site-content';
import { filterProductsByCategory } from '@/lib/homepage';
import { rememberPreferredCategory } from '@/lib/product-preferences';
import type { Product } from '@/lib/product-schema';

export default function Home() {
  const { products, isLoadingProducts, productsError } = useProducts();
  const { siteContent } = useSiteContent();
  const orderedProducts = useProductOrdering(products);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProducts = filterProductsByCategory(orderedProducts, selectedCategory);
  const services = siteContent.services;

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

      <HeroBanner imageSrc={siteContent.heroImage} />

      <RevealOnScroll>
        <ProductsSection
          products={products}
          filteredProducts={filteredProducts}
          isLoadingProducts={isLoadingProducts}
          productsError={productsError}
          selectedCategory={selectedCategory}
          badge={siteContent.productsBadge}
          title={siteContent.productsTitle}
          description={siteContent.productsDescription}
          onSelectCategory={(category) => {
            rememberPreferredCategory(category);
            setSelectedCategory(category);
          }}
          onViewProduct={handleViewProduct}
        />
      </RevealOnScroll>

      <ProductDetailModal
        product={selectedProduct}
        currentImageIndex={currentImageIndex}
        onClose={() => setSelectedProduct(null)}
        onPrevImage={handlePrevImage}
        onNextImage={handleNextImage}
        onSelectImage={setCurrentImageIndex}
      />

      <RevealOnScroll>
        <AboutSection
          badge={siteContent.aboutBadge}
          title={siteContent.aboutTitle}
          paragraphOne={siteContent.aboutParagraphOne}
          paragraphTwo={siteContent.aboutParagraphTwo}
          imageSrc={siteContent.aboutImage}
        />
      </RevealOnScroll>
      <RevealOnScroll delayClassName="delay-75">
        <StatsSection />
      </RevealOnScroll>
      <RevealOnScroll delayClassName="delay-100">
        <ServicesSection
          badge={siteContent.servicesBadge}
          title={siteContent.servicesTitle}
          services={services}
        />
      </RevealOnScroll>
      <RevealOnScroll delayClassName="delay-150">
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
          tiktokUrl={siteContent.tiktokUrl}
          tiktokLabel={siteContent.tiktokLabel}
          mapsEmbedUrl={siteContent.mapsEmbedUrl}
          mapsLabel={siteContent.mapsLabel}
        />
      </RevealOnScroll>
      <WhatsAppFloatingButton />
    </div>
  );
}
