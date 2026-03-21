type ServicesSectionProps = {
  badge: string;
  title: string;
  services: Array<{
    title: string;
    description: string;
    image: string;
  }>;
};

export function ServicesSection({ badge, title, services }: ServicesSectionProps) {
  return (
    <section className="bg-white px-4 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">{badge}</p>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`overflow-hidden rounded-[28px] border border-blue-100 bg-linear-to-br from-blue-50 via-white to-cyan-50 shadow-[0_18px_48px_-36px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(37,99,235,0.35)] ${
                index === services.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''
              } ${index === 1 ? 'animation-delay-200 animate-fade-in-up' : index === 2 ? 'animation-delay-400 animate-fade-in-up' : 'animate-fade-in-up'}`}
            >
              <img
                src={service.image || '/store-photo.jpg'}
                alt={service.title}
                className="h-44 w-full object-cover md:h-48"
                onError={(event) => {
                  event.currentTarget.src = '/store-photo.jpg';
                }}
              />
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
