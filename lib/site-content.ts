import { randomUUID } from 'crypto';

import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase-admin';

const SITE_CONTENT_BUCKET = 'products';
const SITE_CONTENT_PATH = 'config/site-content.json';
export const MAX_SERVICE_ITEMS = 6;
export const MAX_SERVICE_IMAGES = 5;

export type ServiceContentItem = {
  title: string;
  description: string;
  images: string[];
};

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
  tiktokUrl: string;
  tiktokLabel: string;
  mapsEmbedUrl: string;
  mapsLabel: string;
  servicesBadge: string;
  servicesTitle: string;
  services: ServiceContentItem[];
};

const DEFAULT_SERVICE_ITEMS: ServiceContentItem[] = [
  {
    title: 'Perbaikan Laptop',
    description: 'Perbaikan hardware dan software laptop berbagai merek.',
    images: ['/store-photo.jpg'],
  },
  {
    title: 'Perbaikan Komputer',
    description: 'Service komputer desktop untuk rumah dan kantor.',
    images: ['/store-photo.jpg'],
  },
  {
    title: 'Perbaikan Printer',
    description: 'Perbaikan dan maintenance printer semua jenis.',
    images: ['/store-photo.jpg'],
  },
  {
    title: 'Upgrade SSD & RAM',
    description: 'Upgrade performa perangkat agar lebih cepat untuk kerja, sekolah, dan usaha.',
    images: ['/store-photo.jpg'],
  },
  {
    title: 'Instalasi Software',
    description: 'Bantu instal aplikasi penting, driver, dan optimasi sistem agar siap dipakai.',
    images: ['/store-photo.jpg'],
  },
  {
    title: 'Cleaning & Maintenance',
    description: 'Pembersihan perangkat, pengecekan suhu, dan perawatan rutin agar tetap awet.',
    images: ['/store-photo.jpg'],
  },
];

export const createDefaultServices = (): ServiceContentItem[] =>
  DEFAULT_SERVICE_ITEMS.map((service) => ({
    ...service,
    images: [...service.images],
  }));

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
  footerDescription: 'Untuk tanya stok, service, harga, atau kebutuhan perangkat, Anda bisa langsung hubungi kami lewat WhatsApp, Instagram, atau TikTok.',
  contactPhone: '0812 8968 9799',
  contactEmail: 'info@universalcomputer.id',
  contactAddressLine1: 'Jl. Ciledug Raya No.3',
  contactAddressLine2: 'Tangerang, Banten',
  instagramUrl: 'https://www.instagram.com/universalcomputer',
  instagramLabel: '@universalcomputer',
  tiktokUrl: 'https://www.tiktok.com/@universalcomputer',
  tiktokLabel: '@universalcomputer',
  mapsEmbedUrl: 'https://www.google.com/maps?q=Jl.%20Ciledug%20Raya%20No.3%20Tangerang&z=15&output=embed',
  mapsLabel: 'Lokasi Universal Komputer',
  servicesBadge: 'Layanan',
  servicesTitle: 'Layanan Perbaikan Kami',
  services: createDefaultServices(),
};

type LegacySiteContent = Partial<SiteContent> & {
  facebookUrl?: string;
  facebookLabel?: string;
  serviceOneTitle?: string;
  serviceOneDescription?: string;
  serviceOneImage?: string;
  serviceTwoTitle?: string;
  serviceTwoDescription?: string;
  serviceTwoImage?: string;
  serviceThreeTitle?: string;
  serviceThreeDescription?: string;
  serviceThreeImage?: string;
};

const normalizeImageList = (images: unknown, fallbackImages: string[]) => {
  if (!Array.isArray(images)) {
    return [...fallbackImages];
  }

  const cleaned = images
    .map((image) => (typeof image === "string" ? image.trim() : ""))
    .filter(Boolean)
    .slice(0, MAX_SERVICE_IMAGES);

  return cleaned.length > 0 ? cleaned : [...fallbackImages];
};

const buildLegacyServices = (incoming: LegacySiteContent) => {
  const legacyServices = [
    {
      title: incoming.serviceOneTitle,
      description: incoming.serviceOneDescription,
      image: incoming.serviceOneImage,
    },
    {
      title: incoming.serviceTwoTitle,
      description: incoming.serviceTwoDescription,
      image: incoming.serviceTwoImage,
    },
    {
      title: incoming.serviceThreeTitle,
      description: incoming.serviceThreeDescription,
      image: incoming.serviceThreeImage,
    },
  ];

  return createDefaultServices().map((defaultService, index) => {
    const legacyService = legacyServices[index];

    if (!legacyService) {
      return defaultService;
    }

    return {
      title: legacyService.title?.trim() || defaultService.title,
      description: legacyService.description?.trim() || defaultService.description,
      images: legacyService.image?.trim() ? [legacyService.image.trim()] : [...defaultService.images],
    };
  });
};

const normalizeServices = (incoming: LegacySiteContent) => {
  const sourceServices = Array.isArray(incoming.services) ? incoming.services : buildLegacyServices(incoming);

  return createDefaultServices().map((defaultService, index) => {
    const service = sourceServices[index];

    if (!service || typeof service !== 'object') {
      return defaultService;
    }

    return {
      title: typeof service.title === 'string' && service.title.trim() ? service.title.trim() : defaultService.title,
      description:
        typeof service.description === 'string' && service.description.trim()
          ? service.description.trim()
          : defaultService.description,
      images: normalizeImageList(service.images, defaultService.images),
    };
  });
};

const normalizeSiteContent = (value: unknown): SiteContent => {
  const incoming = (value && typeof value === 'object' ? value : {}) as LegacySiteContent;

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
    tiktokUrl: incoming.tiktokUrl?.trim() || DEFAULT_SITE_CONTENT.tiktokUrl,
    tiktokLabel: incoming.tiktokLabel?.trim() || DEFAULT_SITE_CONTENT.tiktokLabel,
    mapsEmbedUrl: incoming.mapsEmbedUrl?.trim() || DEFAULT_SITE_CONTENT.mapsEmbedUrl,
    mapsLabel: incoming.mapsLabel?.trim() || DEFAULT_SITE_CONTENT.mapsLabel,
    servicesBadge: incoming.servicesBadge?.trim() || DEFAULT_SITE_CONTENT.servicesBadge,
    servicesTitle: incoming.servicesTitle?.trim() || DEFAULT_SITE_CONTENT.servicesTitle,
    services: normalizeServices(incoming),
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

const prepareServicesForStorage = async (services: ServiceContentItem[]) => {
  return Promise.all(
    services.map(async (service, serviceIndex) => ({
      ...service,
      images: await Promise.all(
        service.images.map((image, imageIndex) =>
          uploadSiteImageIfNeeded(`service-${serviceIndex + 1}-image-${imageIndex + 1}`, image)
        )
      ),
    }))
  );
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
    services: await prepareServicesForStorage(normalized.services),
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
