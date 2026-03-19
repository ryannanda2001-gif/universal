export function AboutSection() {
  return (
    <section className="py-12 md:py-16 px-4 bg-linear-to-b from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Tentang Toko Universal Komputer
            </h2>
            <p className="text-gray-700 mb-4 text-center md:text-left leading-relaxed">
              Kami adalah toko spesialis dalam penjualan dan perbaikan komputer, laptop, dan printer.
              Dengan pengalaman bertahun-tahun, kami berkomitmen memberikan layanan terbaik untuk semua kebutuhan teknologi Anda.
            </p>
            <p className="text-gray-700 text-center md:text-left leading-relaxed">
              Lokasi strategis di pusat kota membuat kami mudah dijangkau oleh pelanggan dari berbagai daerah.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/store-photo.jpg"
              alt="Toko Universal Komputer"
              className="w-full h-48 md:h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
