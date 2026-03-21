import { randomUUID } from 'crypto';

import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-admin';

const SITE_CONTENT_BUCKET = 'products';
const SITE_CONTENT_PATH = 'config/site-content.json';

export type SiteContent = {
  heroImage: string;
  productsBadge: string;
  productsTitle: string;
  productsDescription: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutParagraphOne: string;
  aboutParagraphTwo: string;
  aboutImage: string;
  footerBadge: string;
  footerTitle: string;
  footerDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddressLine1: string;
  contactAddressLine2: string;
  instagramUrl: string;
  instagramLabel: string;
  facebookUrl: string;
  facebookLabel: string;
  mapsEmbedUrl: string;
  mapsLabel: string;
  servicesBadge: string;
  servicesTitle: string;
  serviceOneTitle: string;
  serviceOneDescription: string;
  serviceOneImage: string;
  serviceTwoTitle: string;
  serviceTwoDescription: string;
  serviceTwoImage: string;
  serviceThreeTitle: string;
  serviceThreeDescription: string;
  serviceThreeImage: string;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroImage: '/store-1.jpg',
  productsBadge: 'Pilihan Produk',
  productsTitle: 'Produk & Paket Universal Komputer',
  productsDescription: 'Jelajahi perangkat, komponen, dan paket rakitan dengan tampilan yang lebih rapi seperti katalog komersial.',
  aboutBadge: 'Tentang Kami',
  aboutTitle: 'Toko Universal Komputer yang fokus pada solusi cepat, rapi, dan terpercaya',
  aboutParagraphOne: 'Kami melayani penjualan dan perbaikan komputer, laptop, printer, serta komponen penting untuk kebutuhan rumah, kantor, dan usaha.',
  aboutParagraphTwo: 'Dengan pengalaman bertahun-tahun, kami berusaha menghadirkan pelayanan yang ramah, stok yang jelas, serta rekomendasi produk yang sesuai kebutuhan pelanggan.',
  aboutImage: '/store-photo.jpg',
  footerBadge: 'Universal Komputer',
  footerTitle: 'Kontak toko lebih jelas, respon lebih cepat, dan tetap terlihat profesional.',
  footerDescription: 'Untuk tanya stok, service, harga, atau kebutuhan perangkat, Anda bisa langsung hubungi kami lewat WhatsApp, email, atau datang ke alamat toko.',
  contactPhone: '0812 8968 9799',
  contactEmail: 'info@universalcomputer.id',
  contactAddressLine1: 'Jl. Ciledug Raya No.3',
  contactAddressLine2: 'Tangerang, Banten',
  instagramUrl: '#',
  instagramLabel: '@universalcomputer',
  facebookUrl: '#',
  facebookLabel: 'Universal Komputer',
  mapsEmbedUrl: 'https://www.google.com/maps?q=Jl.%20Ciledug%20Raya%20No.3%20Tangerang&z=15&output=embed',
  mapsLabel: 'Lokasi Universal Komputer',
  servicesBadge: 'Layanan',
  servicesTitle: 'Layanan Perbaikan Kami',
  serviceOneTitle: 'Perbaikan Laptop',
  serviceOneDescription: 'Perbaikan hardware dan software laptop berbagai merek.',
  serviceOneImage: '/store-photo.jpg',
  serviceTwoTitle: 'Perbaikan Komputer',
  serviceTwoDescription: 'Service komputer desktop untuk rumah dan kantor.',
  serviceTwoImage: '/store-photo.jpg',
  serviceThreeTitle: 'Perbaikan Printer',
  serviceThreeDescription: 'Perbaikan dan maintenance printer semua jenis.',
  serviceThreeImage: '/store-photo.jpg',
};

const normalizeSiteContent = (value: unknown): SiteContent => {
  const incoming = (value && typeof value === 'object' ? value : {}) as Partial<SiteContent>;

  return {
    heroImage: incoming.heroImage?.trim() || DEFAULT_SITE_CONTENT.heroImage,
    productsBadge: incoming.productsBadge?.trim() || DEFAULT_SITE_CONTENT.productsBadge,
    productsTitle: incoming.productsTitle?.trim() || DEFAULT_SITE_CONTENT.productsTitle,
    productsDescription: incoming.productsDescription?.trim() || DEFAULT_SITE_CONTENT.productsDescription,
    aboutBadge: incoming.aboutBadge?.trim() || DEFAULT_SITE_CONTENT.aboutBadge,
    aboutTitle: incoming.aboutTitle?.trim() || DEFAULT_SITE_CONTENT.aboutTitle,
    aboutParagraphOne: incoming.aboutParagraphOne?.trim() || DEFAULT_SITE_CONTENT.aboutParagraphOne,
    aboutParagraphTwo: incoming.aboutParagraphTwo?.trim() || DEFAULT_SITE_CONTENT.aboutParagraphTwo,
    aboutImage: incoming.aboutImage?.trim() || DEFAULT_SITE_CONTENT.aboutImage,
    footerBadge: incoming.footerBadge?.trim() || DEFAULT_SITE_CONTENT.footerBadge,
    footerTitle: incoming.footerTitle?.trim() || DEFAULT_SITE_CONTENT.footerTitle,
    footerDescription: incoming.footerDescription?.trim() || DEFAULT_SITE_CONTENT.footerDescription,
    contactPhone: incoming.contactPhone?.trim() || DEFAULT_SITE_CONTENT.contactPhone,
    contactEmail: incoming.contactEmail?.trim() || DEFAULT_SITE_CONTENT.contactEmail,
    contactAddressLine1: incoming.contactAddressLine1?.trim() || DEFAULT_SITE_CONTENT.contactAddressLine1,
    contactAddressLine2: incoming.contactAddressLine2?.trim() || DEFAULT_SITE_CONTENT.contactAddressLine2,
    instagramUrl: incoming.instagramUrl?.trim() || DEFAULT_SITE_CONTENT.instagramUrl,
    instagramLabel: incoming.instagramLabel?.trim() || DEFAULT_SITE_CONTENT.instagramLabel,
    facebookUrl: incoming.facebookUrl?.trim() || DEFAULT_SITE_CONTENT.facebookUrl,
    facebookLabel: incoming.facebookLabel?.trim() || DEFAULT_SITE_CONTENT.facebookLabel,
    mapsEmbedUrl: incoming.mapsEmbedUrl?.trim() || DEFAULT_SITE_CONTENT.mapsEmbedUrl,
    mapsLabel: incoming.mapsLabel?.trim() || DEFAULT_SITE_CONTENT.mapsLabel,
    servicesBadge: incoming.servicesBadge?.trim() || DEFAULT_SITE_CONTENT.servicesBadge,
    servicesTitle: incoming.servicesTitle?.trim() || DEFAULT_SITE_CONTENT.servicesTitle,
    serviceOneTitle: incoming.serviceOneTitle?.trim() || DEFAULT_SITE_CONTENT.serviceOneTitle,
    serviceOneDescription: incoming.serviceOneDescription?.trim() || DEFAULT_SITE_CONTENT.serviceOneDescription,
    serviceOneImage: incoming.serviceOneImage?.trim() || DEFAULT_SITE_CONTENT.serviceOneImage,
    serviceTwoTitle: incoming.serviceTwoTitle?.trim() || DEFAULT_SITE_CONTENT.serviceTwoTitle,
    serviceTwoDescription: incoming.serviceTwoDescription?.trim() || DEFAULT_SITE_CONTENT.serviceTwoDescription,
    serviceTwoImage: incoming.serviceTwoImage?.trim() || DEFAULT_SITE_CONTENT.serviceTwoImage,
    serviceThreeTitle: incoming.serviceThreeTitle?.trim() || DEFAULT_SITE_CONTENT.serviceThreeTitle,
    serviceThreeDescription: incoming.serviceThreeDescription?.trim() || DEFAULT_SITE_CONTENT.serviceThreeDescription,
    serviceThreeImage: incoming.serviceThreeImage?.trim() || DEFAULT_SITE_CONTENT.serviceThreeImage,
  };
};

const isPublicAsset = (value: string) => value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');

const parseDataUrl = (value: string) => {
  const match = value.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;

  const [, mimeType, base64Data] = match;

  return {
    mimeType,
    buffer: Buffer.from(base64Data, 'base64'),
  };
};

const guessExtension = (mimeType: string) => {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    default:
      return 'bin';
  }
};

const uploadSiteImageIfNeeded = async (name: string, value: string) => {
  if (!value || isPublicAsset(value)) {
    return value;
  }

  const parsed = parseDataUrl(value);
  if (!parsed) {
    return value;
  }

  const supabase = getSupabaseAdmin();
  const extension = guessExtension(parsed.mimeType);
  const filePath = `site-content/${name}-${Date.now()}-${randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .upload(filePath, parsed.buffer, {
      contentType: parsed.mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload site image: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const readSiteContent = async () => {
  if (!isSupabaseConfigured) {
    return DEFAULT_SITE_CONTENT;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .download(SITE_CONTENT_PATH);

  if (error) {
    return DEFAULT_SITE_CONTENT;
  }

  const text = await data.text();
  return normalizeSiteContent(JSON.parse(text));
};

export const writeSiteContent = async (value: SiteContent) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const normalized = normalizeSiteContent(value);
  const prepared: SiteContent = {
    ...normalized,
    heroImage: await uploadSiteImageIfNeeded('hero-image', normalized.heroImage),
    aboutImage: await uploadSiteImageIfNeeded('about-image', normalized.aboutImage),
    serviceOneImage: await uploadSiteImageIfNeeded('service-one-image', normalized.serviceOneImage),
    serviceTwoImage: await uploadSiteImageIfNeeded('service-two-image', normalized.serviceTwoImage),
    serviceThreeImage: await uploadSiteImageIfNeeded('service-three-image', normalized.serviceThreeImage),
  };

  const supabase = getSupabaseAdmin();
  const body = Buffer.from(JSON.stringify(prepared, null, 2), 'utf8');

  const { error } = await supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .upload(SITE_CONTENT_PATH, body, {
      contentType: 'application/json',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to save site content: ${error.message}`);
  }

  return prepared;
};
