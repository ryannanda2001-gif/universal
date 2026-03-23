import { WHATSAPP_NUMBER } from '@/lib/homepage';

type SiteFooterProps = {
  badge: string;
  title: string;
  description: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  instagramUrl: string;
  instagramLabel: string;
  tiktokUrl: string;
  tiktokLabel: string;
  mapsEmbedUrl: string;
  mapsLabel: string;
};

const buildWhatsAppLink = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return `https://wa.me/${digits.startsWith('62') ? digits : `62${digits.replace(/^0/, '')}`}`;
};

const isExternalUrl = (value: string) => /^https?:\/\//.test(value);

export function SiteFooter({
  badge,
  title,
  description,
  phone,
  email,
  addressLine1,
  addressLine2,
  instagramUrl,
  instagramLabel,
  tiktokUrl,
  tiktokLabel,
  mapsEmbedUrl,
  mapsLabel,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const phoneLink = phone ? buildWhatsAppLink(phone) : `https://wa.me/${WHATSAPP_NUMBER}`;

  const socialLinks = [
    {
      label: 'WhatsApp',
      href: phoneLink,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.05 4.94A9.86 9.86 0 0 0 12.02 2C6.58 2 2.15 6.42 2.15 11.87c0 1.74.45 3.44 1.32 4.95L2 22l5.33-1.4a9.8 9.8 0 0 0 4.69 1.19h.01c5.44 0 9.87-4.43 9.87-9.87 0-2.64-1.03-5.12-2.85-6.98ZM12.03 20.1h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.16.83.84-3.08-.2-.31a8.1 8.1 0 0 1-1.25-4.35c0-4.49 3.66-8.15 8.17-8.15 2.18 0 4.22.84 5.76 2.39a8.08 8.08 0 0 1 2.38 5.76c0 4.5-3.66 8.16-8.15 8.16Zm4.47-6.1c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.61.77-.75.92-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.18-1.39-1.32-1.62-.14-.24-.01-.36.11-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.29-.74-1.77-.2-.47-.41-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 1.99s.86 2.3.98 2.46c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.39 1.37.49.57.18 1.09.15 1.5.09.46-.07 1.4-.57 1.6-1.11.2-.54.2-1.01.14-1.11-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: instagramUrl,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.7A4.05 4.05 0 0 0 3.7 7.75v8.5a4.05 4.05 0 0 0 4.05 4.05h8.5a4.05 4.05 0 0 0 4.05-4.05v-8.5a4.05 4.05 0 0 0-4.05-4.05h-8.5ZM17.5 6.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.7A3.3 3.3 0 1 0 12 15.3 3.3 3.3 0 0 0 12 8.7Z" />
        </svg>
      ),
    },
    {
      label: 'TikTok',
      href: tiktokUrl,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.5 3c.35 1.87 1.45 3.47 3 4.42V10a8.65 8.65 0 0 1-3-.92v5.65c0 3.49-2.83 6.32-6.32 6.32a6.32 6.32 0 1 1 0-12.65c.37 0 .73.03 1.08.1v3.05a3.41 3.41 0 1 0 2.31 3.23V3h2.93Z" />
        </svg>
      ),
    },
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-16 text-slate-700 sm:px-6 lg:px-8 md:py-20">
      <div className="mx-auto grid max-w-[1180px] gap-8 rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] md:grid-cols-[1.05fr_0.95fr] md:p-8">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">{badge}</p>
            <h3 className="max-w-xl text-3xl font-bold leading-tight text-slate-900">{title}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={isExternalUrl(item.href) ? '_blank' : undefined}
                rel={isExternalUrl(item.href) ? 'noopener noreferrer' : undefined}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700"
                aria-label={item.label}
                title={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>

          <div className="grid gap-4 pt-1 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.4)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Kontak</p>
              <a href={phoneLink} target="_blank" rel="noopener noreferrer" className="mt-3 block text-base font-semibold text-slate-900 transition hover:text-cyan-700">
                {phone || 'WhatsApp'}
              </a>
              <a href={`mailto:${email}`} className="mt-2 block text-sm text-slate-600 transition hover:text-cyan-700">
                {email}
              </a>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.4)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Alamat</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {[addressLine1, addressLine2].filter(Boolean).join(', ')}
              </p>
              {instagramLabel || tiktokLabel ? (
                <p className="mt-3 text-sm text-slate-500">
                  {instagramLabel}
                  {instagramLabel && tiktokLabel ? ' • ' : ''}
                  {tiktokLabel}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {mapsEmbedUrl ? (
            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.4)]">
              <div className="border-b border-slate-200 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{mapsLabel}</p>
              </div>
              <iframe
                src={mapsEmbedUrl}
                title={mapsLabel}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0"
              />
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center rounded-[30px] border border-dashed border-slate-300 bg-white p-6 text-center text-sm leading-7 text-slate-500">
              Tambahkan link Google Maps di dashboard admin jika ingin menampilkan lokasi toko di footer.
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1180px] text-sm text-slate-500">
        <p>&copy; {year} Universal Komputer. All rights reserved.</p>
      </div>
    </footer>
  );
}
