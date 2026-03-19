import Link from 'next/link';

export function HeroBanner() {
  return (
    <section id="home" className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white md:py-20">
      <div className="absolute inset-0">
        <img src="/store-1.jpg" alt="Banner Universal Komputer" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 to-blue-950/70" />
      </div>

      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl animate-float-slow" />
      <div className="absolute right-0 top-1/3 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl animate-float-medium" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <div className="animate-fade-in-up">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Universal Komputer</p>
          <h1 className="mb-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Solusi komputer, laptop, printer, dan komponen dengan tampilan katalog yang lebih profesional.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
            Temukan produk baru maupun second, cek stok yang tersedia, lalu konsultasikan kebutuhan Anda langsung dengan admin toko.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              Jelajahi Produk
            </Link>
            <a
              href="#tentang"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Tentang Toko
            </a>
          </div>
        </div>

        <div className="animate-fade-in-up animation-delay-200">
          <div className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm text-cyan-200">Kondisi Barang</p>
                <p className="mt-2 text-2xl font-bold">Baru & Second</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm text-cyan-200">Kategori Lengkap</p>
                <p className="mt-2 text-2xl font-bold">Laptop sampai PSU</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 sm:col-span-2">
                <p className="text-sm text-cyan-200">Pelayanan Cepat</p>
                <p className="mt-2 text-base leading-7 text-slate-100">
                  Admin dapat bantu Anda cek stok, konsultasi kebutuhan, dan proses order langsung lewat WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
