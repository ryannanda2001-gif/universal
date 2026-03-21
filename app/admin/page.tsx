'use client';

import { LandingPageSettings } from '@/components/admin/LandingPageSettings';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '@/lib/homepage';
import { normalizeStoredProducts, type Product } from '@/lib/product-schema';
import { DEFAULT_SITE_CONTENT, type SiteContent } from '@/lib/site-content';
import { createClient as createSupabaseBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const MAX_IMAGES = 5;

type AdminMenu = 'landing' | 'products';

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminPage() {
  const router = useRouter();
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [activeMenu, setActiveMenu] = useState<AdminMenu>('landing');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [isSavingProducts, setIsSavingProducts] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoadingSiteContent, setIsLoadingSiteContent] = useState(true);
  const [siteContentError, setSiteContentError] = useState('');
  const [isSavingSiteContent, setIsSavingSiteContent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    description: '',
    category: 'Laptop',
    condition: 'Baru' as Product['condition'],
    images: Array(MAX_IMAGES).fill(''),
    stock: '',
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
            await replaceAllProducts(normalizedLegacyProducts);
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

    const loadSiteContent = async () => {
      try {
        const response = await fetch('/api/site-content', { cache: 'no-store' });
        if (!response.ok) {
          const errorData = (await response.json()) as { message?: string };
          throw new Error(errorData.message || 'Gagal memuat konten landing page');
        }

        const data = (await response.json()) as SiteContent;
        setSiteContent({ ...DEFAULT_SITE_CONTENT, ...data });
        setSiteContentError('');
      } catch (error) {
        console.error(error);
        setSiteContent(DEFAULT_SITE_CONTENT);
        setSiteContentError(error instanceof Error ? error.message : 'Gagal memuat konten landing page.');
      } finally {
        setIsLoadingSiteContent(false);
      }
    };

    void loadProducts();
    void loadSiteContent();
  }, []);

  const formatPriceInput = (value: string) => {
    const numStr = value.replace(/\D/g, '');
    if (!numStr) return '';
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatDiscountInput = (value: string) => {
    const numStr = value.replace(/\D/g, '');
    if (!numStr) return '';
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const replaceAllProducts = async (updatedProducts: Product[]) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'replace_all', products: updatedProducts }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      throw new Error(errorData.message || 'Gagal mengganti data produk');
    }

    const savedProducts = (await response.json()) as Product[];
    setProducts(savedProducts);
    setProductsError('');
  };

  const saveSingleProduct = async (product: Product) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upsert', product }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      throw new Error(errorData.message || 'Gagal menyimpan produk');
    }

    const savedProducts = (await response.json()) as Product[];
    setProducts(savedProducts);
    setProductsError('');
  };

  const deleteSingleProduct = async (id: number) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      throw new Error(errorData.message || 'Gagal menghapus produk');
    }

    const savedProducts = (await response.json()) as Product[];
    setProducts(savedProducts);
    setProductsError('');
  };

  const saveSiteContent = async () => {
    setIsSavingSiteContent(true);
    try {
      const response = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteContent),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message || 'Gagal menyimpan landing page');
      }

      const savedContent = (await response.json()) as SiteContent;
      setSiteContent({ ...DEFAULT_SITE_CONTENT, ...savedContent });
      setSiteContentError('');
      alert('Kustomisasi landing page berhasil disimpan.');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Gagal menyimpan landing page.');
    } finally {
      setIsSavingSiteContent(false);
    }
  };

  const downloadBackup = () => {
    const backupPayload = JSON.stringify(products, null, 2);
    const blob = new Blob([backupPayload], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `universal-products-backup-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const parsed = JSON.parse(fileContent);
      const normalizedProducts = normalizeStoredProducts(parsed);

      if (normalizedProducts.length === 0) {
        alert('File backup kosong atau formatnya tidak valid.');
        return;
      }

      const isConfirmed = confirm(
        `Import backup akan mengganti seluruh data produk saat ini dengan ${normalizedProducts.length} produk dari file. Lanjutkan?`
      );

      if (!isConfirmed) return;

      setIsSavingProducts(true);
      await replaceAllProducts(normalizedProducts);
      alert('Backup berhasil diimport.');
    } catch (error) {
      console.error(error);
      alert('File backup gagal dibaca. Pastikan format JSON valid.');
    } finally {
      setIsSavingProducts(false);
      event.target.value = '';
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'price') {
      setFormData((prev) => ({ ...prev, price: formatPriceInput(value) }));
      return;
    }
    if (name === 'discount') {
      setFormData((prev) => ({ ...prev, discount: formatDiscountInput(value) }));
      return;
    }
    if (name === 'stock') {
      setFormData((prev) => ({ ...prev, stock: value.replace(/\D/g, '') }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const nextImages = [...formData.images];
      nextImages[index] = reader.result as string;
      setFormData((prev) => ({ ...prev, images: nextImages }));
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSiteContentChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setSiteContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleLandingImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'heroImage' | 'aboutImage' | 'serviceOneImage' | 'serviceTwoImage' | 'serviceThreeImage'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSiteContent((prev) => ({ ...prev, [field]: dataUrl }));
    } catch (error) {
      console.error(error);
      alert('Gagal membaca gambar. Silakan coba lagi.');
    } finally {
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((image, currentIndex) => (currentIndex === index ? '' : image)),
    }));
  };

  const validateForm = () => {
    const parsedDiscount = formData.discount ? parseInt(formData.discount.replace(/\./g, ''), 10) : 0;
    if (!formData.name.trim()) return alert('Nama produk harus diisi!'), false;
    if (!formData.price.trim()) return alert('Harga harus diisi!'), false;
    if (!formData.description.trim()) return alert('Deskripsi harus diisi!'), false;
    if (formData.images.length === 0 || !formData.images[0]) return alert('Minimal 1 foto harus diunggah!'), false;
    if (formData.stock && parseInt(formData.stock, 10) < 0) return alert('Stok tidak boleh negatif!'), false;
    if (formData.discount && (parsedDiscount < 0 || parsedDiscount > 99999999)) return alert('Diskon tidak valid!'), false;
    return true;
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
      stock: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    const newId = products.length > 0 ? Math.max(...products.map((product) => product.id)) + 1 : 1;
    const discountValue = formData.discount ? parseInt(formData.discount.replace(/\./g, ''), 10) : 0;
    const stockValue = formData.stock ? parseInt(formData.stock, 10) : 0;
    const productData: Product = {
      id: editingId || newId,
      name: formData.name,
      price: formData.price.replace(/\./g, ''),
      discount: discountValue,
      description: formData.description,
      category: formData.category,
      condition: formData.condition,
      images: formData.images.filter(Boolean),
      stock: stockValue,
    };

    try {
      setIsSavingProducts(true);
      await saveSingleProduct(productData);
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setIsSavingProducts(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: formatPriceInput(product.price),
      discount: product.discount ? formatDiscountInput(product.discount.toString()) : '',
      description: product.description,
      category: product.category,
      condition: product.condition,
      images: [...product.images, ...Array(MAX_IMAGES).fill('')].slice(0, MAX_IMAGES),
      stock: product.stock ? product.stock.toString() : '',
    });
    setEditingId(product.id);
    setActiveMenu('products');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      setIsSavingProducts(true);
      await deleteSingleProduct(id);
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus produk. Silakan coba lagi.');
    } finally {
      setIsSavingProducts(false);
    }
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
      <div className="bg-linear-to-r from-slate-950 via-blue-900 to-cyan-700 px-4 py-6 text-white shadow-lg">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-brand text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-2 text-blue-100">Kelola landing page dan produk Universal Komputer dalam satu dashboard.</p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <Link
                href="/"
                className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Home
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-950"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 rounded-2xl bg-linear-to-br from-slate-950 via-blue-900 to-cyan-700 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">Menu Admin</p>
              <h2 className="mt-2 font-brand text-2xl font-bold">Kelola website dengan lebih rapi</h2>
              <p className="mt-2 text-sm leading-6 text-blue-100">Pilih menu di bawah untuk mengubah landing page atau mengatur katalog produk.</p>
            </div>

            <nav className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveMenu('landing');
                  setShowForm(false);
                }}
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                  activeMenu === 'landing'
                    ? 'bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`h-9 w-1.5 rounded-full transition-all ${activeMenu === 'landing' ? 'bg-cyan-500' : 'bg-slate-200 group-hover:bg-slate-300'}`} />
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 ring-1 ring-slate-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">Kustomisasi Landing Page</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">Edit banner, judul, foto, footer, layanan, dan kontak website.</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('products')}
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                  activeMenu === 'products'
                    ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`h-9 w-1.5 rounded-full transition-all ${activeMenu === 'products' ? 'bg-blue-500' : 'bg-slate-200 group-hover:bg-slate-300'}`} />
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 ring-1 ring-slate-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.25 7.5H3.75m16.5 0-1.5 9.75a2.25 2.25 0 0 1-2.22 1.95H7.47a2.25 2.25 0 0 1-2.22-1.95L3.75 7.5m5.25 0V5.625A2.625 2.625 0 0 1 11.625 3h.75A2.625 2.625 0 0 1 15 5.625V7.5" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">Kelola Produk</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">Tambah, edit, hapus, backup, dan import data produk toko.</span>
                </span>
              </button>
            </nav>
          </aside>

          <div className="min-w-0">
            {activeMenu === 'landing' ? (
              <LandingPageSettings
                siteContent={siteContent}
                isLoading={isLoadingSiteContent}
                isSaving={isSavingSiteContent}
                error={siteContentError}
                onChange={handleSiteContentChange}
                onImageUpload={handleLandingImageUpload}
                onSave={saveSiteContent}
              />
            ) : (
              <div className="space-y-8">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Backup Data Produk</p>
                      <p className="text-sm text-slate-500">Simpan cadangan JSON secara berkala sebelum update besar atau import data.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={downloadBackup}
                        disabled={products.length === 0}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Export Backup
                      </button>
                      <button
                        type="button"
                        onClick={() => importInputRef.current?.click()}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        Import Backup
                      </button>
                      <input
                        ref={importInputRef}
                        type="file"
                        accept=".json,application/json"
                        className="hidden"
                        onChange={handleImportBackup}
                      />
                    </div>
                  </div>

                  {!showForm ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setShowForm(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-green-500 to-green-600 px-8 py-3 font-bold text-white transition-all duration-200 hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Tambah Produk Baru
                    </button>
                  ) : null}
                </div>

                {showForm ? (
                  <div className="rounded-xl border-2 border-blue-200 bg-white p-6 shadow-lg md:p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">
                      {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Nama Produk <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Contoh: Laptop HP Pavilion"
                            className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Harga <span className="text-red-600">*</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Rp</span>
                            <input
                              type="text"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              placeholder="1500000"
                              className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Otomatis di format (Rp 1.500.000)</p>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Kategori <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none"
                          >
                            {PRODUCT_CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Kondisi Barang <span className="text-red-600">*</span>
                          </label>
                          <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none"
                          >
                            {PRODUCT_CONDITIONS.map((condition) => (
                              <option key={condition} value={condition}>
                                {condition}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Jumlah Stok (pcs) <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="5"
                            className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none"
                          />
                          <p className="mt-1 text-xs text-gray-500">Kosongkan jika stok habis</p>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Diskon Custom (Rp) <span className="font-normal text-gray-500">(Opsional)</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Rp</span>
                            <input
                              type="text"
                              name="discount"
                              value={formData.discount}
                              onChange={handleInputChange}
                              placeholder="50.000"
                              className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Kosongkan jika tidak ada diskon</p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                          Deskripsi Produk <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Jelaskan detail, spesifikasi, dan keunggulan produk..."
                          rows={4}
                          className="w-full resize-none rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="border-t-2 border-gray-200 pt-6">
                        <label className="mb-3 block text-sm font-bold text-gray-700">
                          Foto Produk <span className="text-red-600">*</span>
                          <p className="mt-1 text-xs font-normal text-gray-500">Maksimal 5 foto, minimal 1 foto (foto pertama akan menjadi foto utama)</p>
                        </label>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                          {formData.images.map((image, idx) => (
                            <div key={idx} className="group relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleImageUpload(event, idx)}
                                className="hidden"
                                id={`photo-input-${idx}`}
                              />
                              <label
                                htmlFor={`photo-input-${idx}`}
                                className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all ${
                                  image ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                }`}
                              >
                                {image ? (
                                  <div className="relative h-full w-full overflow-hidden">
                                    <img src={image} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" />
                                    {idx === 0 ? (
                                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600 py-0.5 text-center text-xs font-bold text-white">UTAMA</div>
                                    ) : null}
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-xs font-semibold text-gray-600">{idx === 0 ? 'Utama' : `${idx + 1}`}</span>
                                  </div>
                                )}
                              </label>
                              {image ? (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                                >
                                  ×
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 border-t-2 border-gray-200 pt-4">
                        <button
                          type="submit"
                          disabled={isSavingProducts}
                          className="flex-1 rounded-lg bg-linear-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSavingProducts ? 'Menyimpan...' : editingId ? 'Update Produk' : 'Simpan Produk'}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 rounded-lg bg-gray-300 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-400"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                ) : null}

                <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                  <div className="border-b-2 border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 p-6">
                    <h2 className="text-2xl font-bold text-gray-800">Daftar Produk ({products.length})</h2>
                  </div>

                  {isLoadingProducts ? (
                    <div className="p-12 text-center text-gray-500">
                      <p className="text-lg">Sedang memuat produk...</p>
                    </div>
                  ) : productsError ? (
                    <div className="p-12 text-center">
                      <p className="mb-2 text-lg text-red-600">Admin belum bisa memuat produk</p>
                      <p className="text-gray-500">{productsError}</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <p className="text-lg">Belum ada produk. Klik tombol &quot;Tambah Produk Baru&quot; untuk memulai.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b-2 border-gray-200 bg-gray-50">
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
                            <tr key={product.id} className={`border-b transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="px-4 py-4">
                                {product.images && product.images.length > 0 ? (
                                  <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded object-cover" />
                                ) : null}
                              </td>
                              <td className="px-4 py-4">
                                <p className="max-w-xs truncate font-semibold text-gray-800">{product.name}</p>
                              </td>
                              <td className="px-4 py-4">
                                <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{product.category}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                                  product.condition === 'Second' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {product.condition}
                                </span>
                              </td>
                              <td className="px-4 py-4 font-semibold text-gray-800">{product.price}</td>
                              <td className="px-4 py-4 text-center">
                                {product.stock === 0 ? (
                                  <span className="inline-block rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-700">Habis</span>
                                ) : product.stock < 5 ? (
                                  <span className="inline-block rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">{product.stock} pcs</span>
                                ) : (
                                  <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">{product.stock} pcs</span>
                                )}
                              </td>
                              <td className="px-4 py-4 text-center">
                                {product.discount && product.discount > 0 ? (
                                  <span className="inline-block rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                                    -Rp {product.discount.toLocaleString('id-ID')}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span className="inline-block rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
                                  {product.images && product.images.length ? product.images.length : 0}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(product)}
                                    className="rounded bg-blue-500 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-blue-600"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(product.id)}
                                    disabled={isSavingProducts}
                                    className="rounded bg-red-500 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
