'use client';

import { useEffect, useState } from 'react';

import { STORE_STATS } from '@/lib/homepage';

const useAnimatedNumber = (target: number, duration = 1400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const startedAt = performance.now();

    const update = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    frameId = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frameId);
  }, [duration, target]);

  return value;
};

function StatCard({
  label,
  suffix,
  target,
  palette,
}: {
  label: string;
  suffix: string;
  target: number;
  palette: string;
}) {
  const animatedValue = useAnimatedNumber(target);

  return (
    <div className={`rounded-[28px] p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${palette}`}>
      <div className="mb-3 text-4xl font-bold md:text-5xl">
        {animatedValue.toLocaleString('id-ID')}
        {suffix}
      </div>
      <div className="text-sm font-medium md:text-base">{label}</div>
    </div>
  );
}

export function StatsSection() {
  const palettes = [
    'bg-linear-to-br from-blue-600 via-blue-700 to-cyan-500',
    'bg-linear-to-br from-slate-900 via-blue-900 to-cyan-600',
    'bg-linear-to-br from-cyan-500 via-blue-600 to-indigo-700',
  ];

  return (
    <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">Achievement</p>
          <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">Pencapaian Kami</h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
            Angka-angka ini mencerminkan pengalaman service dan kepercayaan pelanggan yang terus tumbuh.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {STORE_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={index === 1 ? 'animation-delay-200 animate-fade-in-up' : index === 2 ? 'animation-delay-400 animate-fade-in-up' : 'animate-fade-in-up'}
            >
              <StatCard
                label={stat.label}
                suffix={stat.suffix}
                target={stat.value}
                palette={palettes[index] ?? palettes[0]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
