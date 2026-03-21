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
  facebookUrl: string;
  facebookLabel: string;
  mapsEmbedUrl: string;
  mapsLabel: string;
};

const buildWhatsAppLink = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return `https://wa.me/${digits.startsWith('62') ? digits : `62${digits.replace(/^0/, '')}`}`;
};

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
  facebookUrl,
  facebookLabel,
  mapsEmbedUrl,
  mapsLabel,
}: SiteFooterProps) {
  const year = new Date().getFullYear();
  const phoneLink = phone ? buildWhatsAppLink(phone) : `https://wa.me/${WHATSAPP_NUMBER}`;

  const socialLinks = [
    {
      label: 'WhatsApp',
      href: phoneLink,
      value: phone,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.05 4.94A9.86 9.86 0 0 0 12.02 2C6.58 2 2.15 6.42 2.15 11.87c0 1.74.45 3.44 1.32 4.95L2 22l5.33-1.4a9.8 9.8 0 0 0 4.69 1.19h.01c5.44 0 9.87-4.43 9.87-9.87 0-2.64-1.03-5.12-2.85-6.98ZM12.03 20.1h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.16.83.84-3.08-.2-.31a8.1 8.1 0 0 1-1.25-4.35c0-4.49 3.66-8.15 8.17-8.15 2.18 0 4.22.84 5.76 2.39a8.08 8.08 0 0 1 2.38 5.76c0 4.5-3.66 8.16-8.15 8.16Zm4.47-6.1c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.61.77-.75.92-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.18-1.39-1.32-1.62-.14-.24-.01-.36.11-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.29-.74-1.77-.2-.47-.41-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 1.99s.86 2.3.98 2.46c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.39 1.37.49.57.18 1.09.15 1.5.09.46-.07 1.4-.57 1.6-1.11.2-.54.2-1.01.14-1.11-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: instagramUrl,
      value: instagramLabel,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.7A4.05 4.05 0 0 0 3.7 7.75v8.5a4.05 4.05 0 0 0 4.05 4.05h8.5a4.05 4.05 0 0 0 4.05-4.05v-8.5a4.05 4.05 0 0 0-4.05-4.05h-8.5ZM17.5 6.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.7A3.3 3.3 0 1 0 12 15.3 3.3 3.3 0 0 0 12 8.7Z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: facebookUrl,
      value: facebookLabel,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.62 22v-8.03h2.7l.4-3.13h-3.1V8.84c0-.91.25-1.53 1.56-1.53h1.66V4.5c-.81-.08-1.63-.12-2.45-.11-2.42 0-4.08 1.47-4.08 4.18v2.27H7.6v3.13h2.71V22h3.31Z" />
        </svg>
      ),
    },
  ];

  const contactItems = [
    {
      label: 'Telepon / WhatsApp',
      value: phone,
      href: phoneLink,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h2.19c.8 0 1.49.54 1.69 1.32l.55 2.2a1.8 1.8 0 0 1-.42 1.66l-1.07 1.08a14.6 14.6 0 0 0 5.8 5.8l1.08-1.07a1.8 1.8 0 0 1 1.66-.42l2.2.55c.78.2 1.32.89 1.32 1.69v2.19a2.25 2.25 0 0 1-2.25 2.25h-.75C8.87 21.75 2.25 15.13 2.25 7.5v-.75Z" />
        </svg>
      ),
    },
    {
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0A2.25 2.25 0 0 0 19.5 5.25h-15A2.25 2.25 0 0 0 2.25 7.5m19.5 0-8.69 5.79a1.5 1.5 0 0 1-1.62 0L2.25 7.5" />
        </svg>
      ),
    },
    {
      label: 'Alamat Toko',
      value: [addressLine1, addressLine2].filter(Boolean).join(', '),
      href: undefined,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.25 6-11.25A6 6 0 1 0 6 9.75C6 15.75 12 21 12 21Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-slate-950 via-blue-950 to-slate-900 px-4 py-12 text-slate-200 md:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-r from-cyan-500/20 via-blue-500/15 to-white/5 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_-44px_rgba(37,99,235,0.28)] backdrop-blur md:p-6">
          <div className="mb-6 grid gap-5 rounded-[28px] bg-linear-to-r from-blue-700 via-cyan-600 to-blue-500 px-5 py-5 text-white lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">{badge}</p>
              <h3 className="font-brand text-2xl font-bold md:text-3xl">{title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50/90">{description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 rounded-2xl bg-white/18 px-4 py-3 transition hover:bg-white/25"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">{item.label}</span>
                    <span className="block truncate text-sm text-blue-50">{item.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Kontak Utama</p>
                <h4 className="font-brand text-2xl font-bold text-white md:text-[2rem]">Hubungi toko dengan cepat dan jelas</h4>
              </div>

              <div className="space-y-3">
                {contactItems.map((item) => {
                  const content = (
                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-400/20 to-blue-400/20 text-cyan-200">
                        {item.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-sm font-medium leading-6 text-white">
                          {item.value}
                        </span>
                      </span>
                    </div>
                  );

                  if (item.href) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block transition hover:-translate-y-0.5"
                      >
                        {content}
                      </a>
                    );
                  }

                  return <div key={item.label}>{content}</div>;
                })}
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/10 bg-linear-to-br from-white/8 via-blue-500/10 to-cyan-400/10 p-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Info Toko</p>
                <p className="text-sm leading-7 text-slate-300">
                  Kami siap membantu kebutuhan rakitan, service, upgrade, dan konsultasi perangkat sesuai kebutuhan Anda.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Respon Cepat</span>
                  <p className="mt-2 text-sm leading-7 text-slate-300">Tanya stok dan harga lebih cepat lewat WhatsApp atau media sosial toko.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Kunjungi Toko</span>
                  <p className="mt-2 text-sm leading-7 text-slate-300">Lokasi dan kebutuhan service bisa dikonfirmasi dulu sebelum datang agar lebih efisien.</p>
                </div>
              </div>

              {mapsEmbedUrl ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">{mapsLabel}</p>
                  </div>
                  <iframe
                    src={mapsEmbedUrl}
                    title={mapsLabel}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-48 w-full border-0"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-400">
            <p>&copy; {year} Universal Komputer. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
