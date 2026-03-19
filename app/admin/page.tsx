'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '@/lib/homepage';
import type { Product } from '@/lib/product-schema';
import { normalizeStoredProducts } from '@/lib/product-schema';
import { createClient as createSupabaseBrowserClient } from '@/lib/supabase/client';

const MAX_IMAGES = 5;

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    description: '',
    category: 'Laptop',
    condition: 'Baru' as Product['condition'],
    images: Array(MAX_IMAGES).fill(''),
    stock: ''
  });

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
            const normalizedLegacyProducts = normalizeStoredProducts(JSON.parse(legacyProducts));
            await saveProducts(normalizedLegacyProducts);
            return;
          }
        }

        setProducts(normalizeStoredProducts(data));
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

  // Helper function to format price with Rupiah
  const formatPriceInput = (value: string): string => {
    const numStr = value.replace(/\D/g, '');
    if (!numStr) return '';
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatDiscountInput = (value: string): string => {
    const numStr = value.replace(/\D/g, '');
    if (!numStr) return '';
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const saveProducts = async (updatedProducts: Product[]) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProducts),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      throw new Error(errorData.message || 'Gagal menyimpan produk');
    }

    const savedProducts = (await response.json()) as Product[];
    setProducts(savedProducts);
    setProductsError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        price: formatPriceInput(value)
      }));
    } else if (name === 'discount') {
      setFormData(prev => ({
        ...prev,
        discount: formatDiscountInput(value)
      }));
    } else if (name === 'stock') {
      const numValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...formData.images];
        newImages[index] = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: newImages
        }));
      };
      reader.readAsDataURL(file);
    }
  };



  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((image, currentIndex) => (currentIndex === index ? '' : image))
    }));
  };

  const validateForm = (): boolean => {
    const parsedDiscount = formData.discount ? parseInt(formData.discount.replace(/\./g, ''), 10) : 0;

    if (!formData.name.trim()) {
      alert('Nama produk harus diisi!');
      return false;
    }
    if (!formData.price.trim()) {
      alert('Harga harus diisi!');
      return false;
    }
    if (!formData.description.trim()) {
      alert('Deskripsi harus diisi!');
      return false;
    }
    if (formData.images.length === 0 || !formData.images[0]) {
      alert('Minimal 1 foto harus diunggah!');
      return false;
    }
    if (formData.stock && parseInt(formData.stock as string) < 0) {
      alert('Stok tidak boleh negatif!');
      return false;
    }
    if (formData.discount && (parsedDiscount < 0 || parsedDiscount > 99999999)) {
      alert('Diskon tidak valid!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Generate a unique ID: use the maximum ID + 1, or 1 if empty
    const newId = products.length > 0 
      ? Math.max(...products.map(p => p.id)) + 1 
      : 1;

    // Convert price back to plain number format for storage
    const plainPrice = formData.price.replace(/\./g, '');
    const discountValue = formData.discount ? parseInt(formData.discount.replace(/\./g, ''), 10) : 0;
    const stockValue = formData.stock ? parseInt(formData.stock as string) : 0;

    const productData: Product = {
      id: editingId || newId,
      name: formData.name,
      price: plainPrice,
      discount: discountValue,
      description: formData.description,
      category: formData.category,
      condition: formData.condition,
      images: formData.images.filter(img => img),
      stock: stockValue
    };

    try {
      if (editingId) {
        const updated = products.map(p => p.id === editingId ? productData : p);
        await saveProducts(updated);
        setEditingId(null);
      } else {
        await saveProducts([...products, productData]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan produk. Silakan coba lagi.');
    }
  };

  const handleEdit = (product: Product) => {
    const formattedPrice = formatPriceInput(product.price);
    setFormData({
      name: product.name,
      price: formattedPrice,
      discount: product.discount ? formatDiscountInput(product.discount.toString()) : '',
      description: product.description,
      category: product.category,
      condition: product.condition,
      images: [...product.images, ...Array(MAX_IMAGES).fill('')].slice(0, MAX_IMAGES),
      stock: product.stock ? product.stock.toString() : ''
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await saveProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error(error);
        alert('Gagal menghapus produk. Silakan coba lagi.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      discount: '',
      description: '',
      category: 'Laptop',
      condition: 'Baru',
      images: Array(MAX_IMAGES).fill(''),
      stock: ''
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Gagal logout. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-cyan-500 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold font-brand">Admin Dashboard</h1>
              <p className="text-blue-100 mt-2">Kelola produk Universal Komputer</p>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-950"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-linear-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Produk Baru
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Nama */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nama Produk <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Laptop HP Pavilion"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Harga */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Harga <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-semibold">Rp</span>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="1500000"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Otomatis di format (Rp 1.500.000)</p>
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kategori <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kondisi Barang <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    {PRODUCT_CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Stock & Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stok */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Jumlah Stok (pcs) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="5"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Kosongkan jika stok habis</p>
                </div>

                {/* Diskon */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Diskon Custom (Rp) <span className="text-gray-500 font-normal">(Opsional)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-semibold">Rp</span>
                    <input
                      type="text"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="50.000"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ada diskon</p>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Deskripsi Produk <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan detail, spesifikasi, dan keunggulan produk..."
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Images Section */}
              <div className="border-t-2 border-gray-200 pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Foto Produk <span className="text-red-600">*</span>
                  <p className="text-xs font-normal text-gray-500 mt-1">Maksimal 5 foto, minimal 1 foto (foto pertama akan menjadi foto utama)</p>
                </label>

                {/* Photo Upload Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, idx)}
                        className="hidden"
                        id={`photo-input-${idx}`}
                      />
                      <label
                        htmlFor={`photo-input-${idx}`}
                        className={`w-full aspect-square rounded-lg border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center overflow-hidden ${
                          image ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {image ? (
                          <div className="relative w-full h-full overflow-hidden">
                            <img src={image} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs font-bold text-center py-0.5">UTAMA</div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-600">{idx === 0 ? 'Utama' : `${idx + 1}`}</span>
                          </div>
                        )}
                      </label>
                      {image && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-200"
                >
                  {editingId ? 'Update Produk' : 'Simpan Produk'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-linear-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Daftar Produk ({products.length})
            </h2>
          </div>

          {isLoadingProducts ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">Sedang memuat produk...</p>
            </div>
          ) : productsError ? (
            <div className="p-12 text-center">
              <p className="text-lg text-red-600 mb-2">Admin belum bisa memuat produk</p>
              <p className="text-gray-500">{productsError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">Belum ada produk. Klik tombol &quot;Tambah Produk Baru&quot; untuk memulai.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Foto</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Nama Produk</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Kategori</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Kondisi</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Harga</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Stok</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Diskon</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Foto</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={product.id} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                      <td className="px-4 py-4">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-800 max-w-xs truncate">{product.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          product.condition === 'Second'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {product.condition}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-800">{product.price}</td>
                      <td className="px-4 py-4 text-center">
                        {product.stock === 0 ? (
                          <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                            Habis
                          </span>
                        ) : product.stock < 5 ? (
                          <span className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                            {product.stock} pcs
                          </span>
                        ) : (
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                            {product.stock} pcs
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {product.discount && product.discount > 0 ? (
                          <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                            -Rp {product.discount.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                          {product.images && product.images.length ? product.images.length : 0}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
