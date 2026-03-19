export function AboutSection() {
  return (
    <section id="tentang" className="bg-linear-to-b from-slate-50 to-blue-50 px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[1.05fr_1fr] md:gap-12 md:p-10">
          <div className="animate-fade-in-up">
            <img
              src="/store-photo.jpg"
              alt="Toko Universal Komputer"
              className="h-64 w-full rounded-[28px] object-cover shadow-lg md:h-[420px]"
            />
          </div>

          <div className="animate-fade-in-up animation-delay-200">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">Tentang Kami</p>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Toko Universal Komputer yang fokus pada solusi cepat, rapi, dan terpercaya
            </h2>
            <p className="mb-4 text-base leading-8 text-slate-600">
              Kami melayani penjualan dan perbaikan komputer, laptop, printer, serta komponen penting untuk kebutuhan rumah, kantor, dan usaha.
            </p>
            <p className="mb-6 text-base leading-8 text-slate-600">
              Dengan pengalaman bertahun-tahun, kami berusaha menghadirkan pelayanan yang ramah, stok yang jelas, serta rekomendasi produk yang sesuai kebutuhan pelanggan.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-900">Lokasi Strategis</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Mudah dijangkau pelanggan dari berbagai area sekitar kota.</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-900">Konsultasi Ramah</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Kami bantu pilih produk berdasarkan kebutuhan dan budget.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
