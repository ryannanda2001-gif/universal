'use client';

import { useEffect, useRef, useState } from 'react';

import type { ServiceContentItem } from '@/lib/site-content';

type ServicesSectionProps = {
  badge: string;
  title: string;
  services: ServiceContentItem[];
};

export function ServicesSection({ badge, title, services }: ServicesSectionProps) {
  const [imageIndexes, setImageIndexes] = useState<number[]>(() => services.map(() => 0));
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setImageIndexes((prev) =>
        services.map((service, serviceIndex) => {
          const imageCount = service.images.length;
          if (imageCount <= 1) {
            return 0;
          }

          const currentIndex = prev[serviceIndex] ?? 0;
          return (currentIndex + 1) % imageCount;
        })
      );
    }, 2600);

    return () => window.clearInterval(interval);
  }, [services]);

  const scrollServices = (direction: 'left' | 'right') => {
    if (!scrollerRef.current) return;

    const offset = scrollerRef.current.clientWidth * 0.82;
    scrollerRef.current.scrollBy({
      left: direction === 'right' ? offset : -offset,
      behavior: 'smooth',
    });
  };

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_36%,#eef6ff_100%)] px-5 py-16 sm:px-6 lg:px-8 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">{badge}</p>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{title}</h2>
          </div>
          <div className="flex items-center gap-2 self-start md:hidden">
            <button
              type="button"
              onClick={() => scrollServices('left')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-500 hover:text-cyan-700"
              aria-label="Geser layanan ke kiri"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => scrollServices('right')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-500 hover:text-cyan-700"
              aria-label="Geser layanan ke kanan"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollServices('left')}
            className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow-[0_16px_35px_-18px_rgba(15,23,42,0.35)] transition hover:border-cyan-500 hover:text-cyan-700 md:flex"
            aria-label="Geser layanan ke kiri"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => scrollServices('right')}
            className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow-[0_16px_35px_-18px_rgba(15,23,42,0.35)] transition hover:border-cyan-500 hover:text-cyan-700 md:flex"
            aria-label="Geser layanan ke kanan"
          >
            &gt;
          </button>

          <div ref={scrollerRef} className="scrollbar-hide overflow-x-auto pb-3">
            <div className="flex min-w-max gap-5 md:gap-6">
              {services.map((service, index) => {
                const activeImage = service.images[imageIndexes[index] ?? 0] || service.images[0] || '/store-photo.jpg';

                return (
                  <article
                    key={`${service.title}-${index}`}
                    className="animate-fade-in-up flex w-[285px] shrink-0 flex-col overflow-hidden rounded-[30px] border border-blue-100/80 bg-white shadow-[0_20px_55px_-38px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-40px_rgba(14,116,144,0.35)] md:w-[340px]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={activeImage}
                        alt={service.title}
                        className="h-full w-full object-cover transition-opacity duration-700"
                        onError={(event) => {
                          event.currentTarget.src = '/store-photo.jpg';
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/75 via-slate-900/20 to-transparent px-5 pb-4 pt-10 text-white">
                        <span className="rounded-full bg-white/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                          Layanan {index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {service.images.slice(0, 5).map((_, imageIndex) => {
                          const isActive = imageIndex === (imageIndexes[index] ?? 0);

                          return (
                            <span
                              key={`${service.title}-dot-${imageIndex}`}
                              className={`h-2.5 rounded-full transition-all ${
                                isActive ? 'w-8 bg-cyan-500' : 'w-2.5 bg-slate-300'
                              }`}
                              aria-hidden="true"
                            />
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
