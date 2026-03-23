type AboutSectionProps = {
  badge: string;
  title: string;
  paragraphOne: string;
  paragraphTwo: string;
  imageSrc: string;
};

export function AboutSection({
  badge,
  title,
  paragraphOne,
  paragraphTwo,
  imageSrc,
}: AboutSectionProps) {
  return (
    <section id="tentang" className="bg-linear-to-b from-slate-50 to-blue-50 px-5 py-16 sm:px-6 lg:px-8 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid items-center gap-8 rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-[1.05fr_1fr] md:gap-12 md:p-10">
          <div className="animate-fade-in-up">
            <img
              src={imageSrc || '/store-photo.jpg'}
              alt="Toko Universal Komputer"
              className="h-64 w-full rounded-[28px] object-cover shadow-lg md:h-[420px]"
              onError={(event) => {
                event.currentTarget.src = '/store-photo.jpg';
              }}
            />
          </div>

          <div className="animate-fade-in-up animation-delay-200">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">{badge}</p>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              {title}
            </h2>
            <p className="mb-4 text-base leading-8 text-slate-600">
              {paragraphOne}
            </p>
            <p className="mb-6 text-base leading-8 text-slate-600">
              {paragraphTwo}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
