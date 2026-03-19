import { STORE_SERVICES } from '@/lib/homepage';

export function ServicesSection() {
  return (
    <section className="bg-white px-4 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">Layanan</p>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Layanan Perbaikan Kami</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {STORE_SERVICES.map((service, index) => (
            <div
              key={service.title}
              className={`overflow-hidden rounded-[28px] border border-blue-100 bg-linear-to-br from-blue-50 via-white to-cyan-50 shadow-[0_18px_48px_-36px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(37,99,235,0.35)] ${
                index === STORE_SERVICES.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''
              } ${index === 1 ? 'animation-delay-200 animate-fade-in-up' : index === 2 ? 'animation-delay-400 animate-fade-in-up' : 'animate-fade-in-up'}`}
            >
              <img src={service.image} alt={service.title} className="h-44 w-full object-cover md:h-48" />
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{service.title}</h3>
                <p className="text-sm leading-7 text-slate-600 md:text-base">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
