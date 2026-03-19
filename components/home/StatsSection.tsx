import { STORE_STATS } from '@/lib/homepage';

export function StatsSection() {
  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 md:mb-16 bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Pencapaian Kami
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {STORE_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-white p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${
                index === 0
                  ? 'bg-linear-to-br from-blue-500 to-blue-700'
                  : index === 1
                    ? 'bg-linear-to-br from-cyan-500 to-blue-600'
                    : 'bg-linear-to-br from-blue-600 to-cyan-600'
              }`}
            >
              <div className="text-3xl md:text-4xl font-bold mb-3">{stat.value}</div>
              <div className="text-sm md:text-base font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
