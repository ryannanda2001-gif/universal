import { STORE_SERVICES } from '@/lib/homepage';

export function ServicesSection() {
  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Layanan Perbaikan Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {STORE_SERVICES.map((service, index) => (
            <div
              key={service.title}
              className={`bg-linear-to-br from-blue-50 to-cyan-50 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-blue-100 ${
                index === STORE_SERVICES.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <img src={service.image} alt={service.title} className="w-full h-40 md:h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-base font-semibold mb-2 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
