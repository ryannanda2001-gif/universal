import type { Product } from '@/lib/product-schema';

export const WHATSAPP_NUMBER = '6281289689799';

export const PRODUCT_CATEGORIES = [
  'Laptop',
  'PC',
  'Printer',
  'Storage',
  'RAM',
  'CPU',
  'Power Supply',
  'Monitor',
  'Motherboard',
  'Aksesoris',
] as const;

export const PRODUCT_CONDITIONS = ['Baru', 'Second'] as const;

export const HOMEPAGE_CATEGORIES = ['Semua', ...PRODUCT_CATEGORIES];

export const STORE_STATS = [
  { value: 1000, suffix: '+', label: 'Service Berhasil' },
  { value: 500, suffix: '+', label: 'Pelanggan Puas' },
  { value: 98, suffix: '%', label: 'Rate Keberhasilan' },
];

export const STORE_SERVICES = [
  {
    title: 'Perbaikan Laptop',
    description: 'Perbaikan hardware dan software laptop berbagai merek.',
    image: '/store-photo.jpg',
  },
  {
    title: 'Perbaikan Komputer',
    description: 'Service komputer desktop untuk rumah dan kantor.',
    image: '/store-photo.jpg',
  },
  {
    title: 'Perbaikan Printer',
    description: 'Perbaikan dan maintenance printer semua jenis.',
    image: '/store-photo.jpg',
  },
];

export const formatPrice = (num: number): string => `Rp ${num.toLocaleString('id-ID')}`;

export const extractNumericPrice = (price: string) => parseInt(price.replace(/\D/g, ''), 10) || 0;

export const calculateDiscountedPrice = (price: string, discount: number): string => {
  const discountedPrice = Math.max(0, extractNumericPrice(price) - discount);
  return formatPrice(discountedPrice);
};

export const getStockStatus = (stock: number) => {
  if (stock === 0) return { text: 'Kosong', color: 'bg-red-500' };
  if (stock <= 3) return { text: 'Terbatas', color: 'bg-orange-500' };
  return { text: 'Ready Stock', color: 'bg-green-500' };
};

export const getConditionLabel = (condition: Product['condition']) =>
  condition === 'Second' ? 'Second' : 'Baru';

export const buildWhatsAppProductUrl = (product: Pick<Product, 'name' | 'price'>) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20admin%2C%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.price)})`;

export const filterProductsByCategory = (products: Product[], selectedCategory: string) =>
  selectedCategory === 'Semua'
    ? products
    : products.filter((product) => product.category === selectedCategory);
