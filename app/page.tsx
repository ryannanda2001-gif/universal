'use client';

import { useEffect, useState } from 'react';

import type { Product } from '@/lib/product-schema';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['Semua', 'Laptop', 'PC', 'Printer', 'Storage', 'RAM & CPU', 'Aksesoris'];

  const filteredProducts = selectedCategory === 'Semua' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handlePrevImage = () => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  // Helper function to calculate discount price (discount is now fixed amount, not percentage)
  const calculateDiscountedPrice = (price: string, discount: number): string => {
    const numPrice = parseInt(price.replace(/\D/g, ''));
    const discountedPrice = Math.max(0, numPrice - discount);
    return formatPrice(discountedPrice);
  };

  // Helper function to format price with Rupiah
  const formatPrice = (num: number): string => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Helper function to get stock status
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Kosong', color: 'bg-red-500' };
    if (stock === 1) return { text: 'Terbatas', color: 'bg-orange-500' };
    if (stock <= 3) return { text: 'Terbatas', color: 'bg-orange-500' };
    return { text: 'Ready Stock', color: 'bg-green-500' };
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        if (!response.ok) {
          const errorData = (await response.json()) as { message?: string };
          throw new Error(errorData.message || 'Gagal memuat produk');
        }
        const data = (await response.json()) as Product[];

        if (data.length === 0 && typeof window !== 'undefined') {
          const legacyProducts = localStorage.getItem('products');
          if (legacyProducts) {
            const migrateResponse = await fetch('/api/products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: legacyProducts,
            });

            if (migrateResponse.ok) {
              const migratedProducts = (await migrateResponse.json()) as Product[];
              setProducts(migratedProducts);
              return;
            }
          }
        }

        setProducts(data);
        setProductsError('');
      } catch (error) {
        console.error(error);
        setProducts([]);
        setProductsError(error instanceof Error ? error.message : 'Gagal memuat produk.');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">Universal Komputer</h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="hover:underline">Home</a>
            <a href="#beli" className="hover:underline">Beli Sekarang</a>
            <a href="#hubungi" className="hover:underline">Hubungi Kami</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-linear-to-b from-blue-700 to-blue-600 px-4 py-4">
            <nav className="flex flex-col space-y-3">
              <a href="#home" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#beli" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Beli Sekarang</a>
              <a href="#hubungi" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Hubungi Kami</a>
            </nav>
          </div>
        )}
      </header>

      {/* Banner Section */}
      <section id="home" className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src="/store-1.jpg"
          alt="Banner Universal Komputer"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Products & Packages Section */}
      <section id="beli" className="py-12 md:py-16 px-4 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
  <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Produk & Paket Kami</h2>
            <p className="text-gray-600 text-lg">Pilih kategori untuk melihat produk yang tersedia</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
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
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left group flex flex-col h-full"
                >
                  {/* Product Image Container */}
                  <div className="relative w-full h-32 sm:h-40 bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={product.images[0] || '/store-1.jpg'}
                      alt={product.name}
                      className="relative z-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/store-1.jpg';
                      }}
                    />
                    
                      {/* Stock Status Badge */}
                    <div className="absolute top-2 left-2 z-20">
                      {(() => {
                        const status = getStockStatus(product.stock);
                        return (
                          <span className={`${status.color} text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md`}>
                            {status.text}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Discount Badge */}
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                        -Rp {product.discount.toLocaleString('id-ID')}
                      </div>
                    )}

                    {/* Multiple Images Indicator */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 z-20 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {product.images.length} 📷
                      </div>
                    )}

                  </div>

                  {/* Product Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Price Section */}
                    <div className="mb-3 flex-1">
                      {product.discount && product.discount > 0 ? (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 line-through">
                            {formatPrice(parseInt(product.price.replace(/\D/g, '')))}
                          </p>
                          <p className="text-sm sm:text-base font-bold text-red-600">
                            {formatPrice(parseInt(calculateDiscountedPrice(product.price, product.discount).replace(/\D/g, '')))}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base font-bold text-blue-600">
                          {formatPrice(parseInt(product.price.replace(/\D/g, '')))}
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-linear-to-r from-green-500 to-green-600 text-white text-xs sm:text-sm py-2.5 rounded-lg font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:from-green-600 group-hover:to-green-700"
                      disabled={product.stock === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/6281289689799?text=Halo%20admin%2C%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.price)})`, '_blank');
                      }}
                    >
                      {product.stock === 0 ? '❌ Habis' : <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 01 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>}
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal - Side by Side Layout */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[95vh] overflow-hidden flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 hover:bg-gray-100 z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Side: Image Gallery */}
            <div className="w-full md:w-1/2 bg-gray-100 flex flex-col">
              <div className="relative flex-1 min-h-80 md:min-h-96 overflow-hidden">
                {selectedProduct.images && selectedProduct.images.length > 0 && selectedProduct.images[currentImageIndex] ? (
                  <img src={selectedProduct.images[currentImageIndex]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center"><span className="text-gray-500">Tidak ada gambar</span></div>
                )}
                
                {/* Stock & Discount Badges */}
                <div className="absolute top-4 left-4">
                  {(() => {
                    const status = getStockStatus(selectedProduct.stock);
                    return <span className={`${status.color} text-white px-3 py-1.5 rounded-full text-sm font-bold`}>{status.text}</span>;
                  })()}
                </div>
                
                {selectedProduct.discount && selectedProduct.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                    -Rp {selectedProduct.discount.toLocaleString('id-ID')}
                  </div>
                )}

                {/* Navigation Arrows */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <>
                    <button onClick={handlePrevImage} className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all shadow-lg">
                      <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={handleNextImage} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all shadow-lg">
                      <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="bg-gray-50 p-3 flex gap-2 overflow-x-auto border-t border-gray-200">
                  {selectedProduct.images.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'}`}>
                      {img ? <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-300"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Product Info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto space-y-4 flex flex-col">
              {/* Category */}
              <div>
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{selectedProduct.category}</span>
              </div>

              {/* Name */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">{selectedProduct.name}</h2>

              {/* Price */}
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                {selectedProduct.discount && selectedProduct.discount > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 text-sm font-semibold">Harga Normal:</p>
                      <p className="text-base line-through text-gray-500 font-semibold">{formatPrice(parseInt(selectedProduct.price.replace(/\D/g, '')))}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-800 font-bold">Harga Diskon:</p>
                      <p className="text-2xl font-bold text-red-600">{formatPrice(parseInt(calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount).replace(/\D/g, '')))}</p>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-sm text-green-700 font-semibold">💰 Hemat: {formatPrice(selectedProduct.discount)}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 text-sm font-semibold mb-1">Harga:</p>
                    <p className="text-2xl font-bold text-blue-700">{formatPrice(parseInt(selectedProduct.price.replace(/\D/g, '')))}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-2 uppercase tracking-wide">Deskripsi Produk</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">{selectedProduct.description}</p>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={() => setSelectedProduct(null)} className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm">
                  Tutup
                </button>
                <a 
                  href={`https://wa.me/6281289689799?text=Halo%20admin%2C%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(selectedProduct.name)}%20(${encodeURIComponent(selectedProduct.price)})`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`px-4 py-3 text-white rounded-lg font-bold inline-flex items-center justify-center gap-2 text-sm transition-all ${selectedProduct.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-green-500 to-green-600 hover:shadow-lg'}`}
                  onClick={(e) => { if (selectedProduct.stock === 0) e.preventDefault(); }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
{selectedProduct.stock === 0 ? 'Stok Habis' : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="py-12 md:py-16 px-4 bg-linear-to-b from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Tentang Toko Universal Komputer</h2>
              <p className="text-gray-700 mb-4 text-center md:text-left leading-relaxed">
                Kami adalah toko spesialis dalam penjualan dan perbaikan komputer, laptop, dan printer.
                Dengan pengalaman bertahun-tahun, kami berkomitmen memberikan layanan terbaik untuk semua kebutuhan teknologi Anda.
              </p>
              <p className="text-gray-700 text-center md:text-left leading-relaxed">
                Lokasi strategis di pusat kota membuat kami mudah dijangkau oleh pelanggan dari berbagai daerah.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/store-photo.jpg"
                alt="Toko Universal Komputer"
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

{/* Statistics */}
<section className="py-12 md:py-16 px-4 bg-white">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-2xl md:text-3xl font-bold mb-12 md:mb-16 bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
      Pencapaian Kami
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

      <div className="bg-linear-to-br from-blue-500 to-blue-700 text-white p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="text-3xl md:text-4xl font-bold mb-3">1000+</div>
        <div className="text-sm md:text-base font-medium">Service Berhasil</div>
      </div>

      <div className="bg-linear-to-br from-cyan-500 to-blue-600 text-white p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="text-3xl md:text-4xl font-bold mb-3">500+</div>
        <div className="text-sm md:text-base font-medium">Pelanggan Puas</div>
      </div>

      <div className="bg-linear-to-br from-blue-600 to-cyan-600 text-white p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="text-3xl md:text-4xl font-bold mb-3">98%</div>
        <div className="text-sm md:text-base font-medium">Rate Keberhasilan</div>
      </div>

    </div>
  </div>
</section>

      {/* Services Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Layanan Perbaikan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-blue-100">
              <img src="/store-photo.jpg" alt="Perbaikan Laptop" className="w-full h-40 md:h-48 object-cover" />
              <div className="p-6 md:p-6">
                <h3 className="text-base font-semibold mb-2 text-gray-800">Perbaikan Laptop</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">Perbaikan hardware dan software laptop berbagai merek.</p>
              </div>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-blue-100">
              <img src="/store-photo.jpg" alt="Perbaikan Komputer" className="w-full h-40 md:h-48 object-cover" />
              <div className="p-6 md:p-6">
                <h3 className="text-base font-semibold mb-2 text-gray-800">Perbaikan Komputer</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">Service komputer desktop untuk rumah dan kantor.</p>
              </div>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-blue-100 md:col-span-2 lg:col-span-1">
              <img src="/store-photo.jpg" alt="Perbaikan Printer" className="w-full h-40 md:h-48 object-cover" />
              <div className="p-6 md:p-6">
                <h3 className="text-base font-semibold mb-2 text-gray-800">Perbaikan Printer</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">Perbaikan dan maintenance printer semua jenis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-r from-gray-900 via-blue-900 to-gray-900 text-gray-300 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Universal Komputer</h4>
              <p className="text-sm leading-relaxed text-gray-400">
                Toko komputer terpercaya untuk kebutuhan teknologi Anda. Menyediakan produk berkualitas dengan harga terjangkau.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Menu</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#beli" className="text-gray-400 hover:text-white transition-colors">Produk</a></li>
                <li><a href="#hubungi" className="text-gray-400 hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">• Service Laptop</li>
                <li className="text-gray-400">• Service Komputer</li>
                <li className="text-gray-400">• Service Printer</li>
                <li className="text-gray-400">• Konsultasi Teknis</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Hubungi Kami</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span>📱</span>
                  <div>
                    <p className="text-gray-400">0812 8968 9799</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>📧</span>
                  <div>
                    <p className="text-gray-400">info@universalcomputer.id</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <div>
                    <p className="text-gray-400">Jl. Ciledug Raya No.3</p>
                    <p className="text-gray-400">Tangerang, Banten</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 Universal Komputer. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="https://wa.me/6281289689799" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                WhatsApp
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/6281289689799"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi via WhatsApp"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </a>
    </div>
  );
}
