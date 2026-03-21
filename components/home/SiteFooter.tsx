import Link from 'next/link';

import { WHATSAPP_NUMBER } from '@/lib/homepage';

const PHONE_DISPLAY = '0812 8968 9799';
const EMAIL_ADDRESS = 'info@universalcomputer.id';
const STORE_ADDRESS = ['Jl. Ciledug Raya No.3', 'Tangerang, Banten'];
const QUICK_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
  { href: '/#beli', label: 'Etalase' },
  { href: '/#hubungi', label: 'Kontak' },
];
const SOCIAL_LINKS = [
  {
    label: 'WhatsApp',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    value: PHONE_DISPLAY,
  },
  {
    label: 'Instagram',
    href: '#',
    value: '@universalcomputer',
  },
  {
    label: 'Facebook',
    href: '#',
    value: 'Universal Komputer',
  },
  {
    label: 'TikTok',
    href: '#',
    value: '@universalcomputer',
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="hubungi"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#1e3a8a_0%,#0f172a_38%,#020617_100%)] px-4 py-14 text-slate-200 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/6 shadow-[0_30px_120px_-50px_rgba(15,23,42,0.8)] backdrop-blur">
          <div className="grid gap-10 px-6 py-8 md:grid-cols-[1.35fr_0.8fr_1fr] md:px-8 md:py-10 lg:px-10">
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/90">Universal Komputer</p>
                <h3 className="font-brand text-3xl font-bold text-white md:text-[2rem]">
                  Solusi komputer, service, dan produk teknologi untuk kebutuhan harian maupun bisnis.
                </h3>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Kami membantu pelanggan mendapatkan perangkat yang tepat, servis yang rapi, dan respon yang cepat dengan tampilan toko yang lebih profesional dan mudah dihubungi.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Telepon / WhatsApp</p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-white transition hover:text-cyan-200"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  <p className="mt-2 text-sm text-slate-400">Fast response untuk tanya stok, harga, dan service.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Email</p>
                  <a
                    href={`mailto:${EMAIL_ADDRESS}`}
                    className="break-all text-lg font-bold text-white transition hover:text-cyan-200"
                  >
                    {EMAIL_ADDRESS}
                  </a>
                  <p className="mt-2 text-sm text-slate-400">Cocok untuk kebutuhan penawaran dan komunikasi formal.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Alamat Toko</p>
                <div className="space-y-2 text-sm leading-7 text-slate-300">
                  {STORE_ADDRESS.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  Silakan hubungi terlebih dahulu untuk memastikan stok produk dan jadwal service.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Navigasi Cepat</p>
                <div className="grid gap-3 text-sm">
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-xl border border-transparent bg-white/5 px-4 py-3 text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Sosial Media</p>
                <div className="space-y-3">
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3 transition hover:border-cyan-300/35 hover:bg-white/10"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-sm text-slate-400">{item.value}</p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Visit</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-300/15 bg-linear-to-br from-cyan-400/10 to-blue-500/10 p-5">
                <p className="text-sm font-semibold text-white">Butuh rekomendasi produk?</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Tim kami siap bantu pilih laptop, PC, printer, dan komponen sesuai kebutuhan serta budget Anda.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-cyan-100"
                >
                  Hubungi Sekarang
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-5 md:px-8 lg:px-10">
            <div className="flex flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
              <p>&copy; {year} Universal Komputer. All rights reserved.</p>
              <p>Tampilan profesional untuk etalase produk, layanan, dan kontak bisnis.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
