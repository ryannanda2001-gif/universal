import type { Product } from '@/lib/product-schema';
import {
  buildWhatsAppProductUrl,
  calculateDiscountedPrice,
  extractNumericPrice,
  formatPrice,
  getConditionLabel,
  getStockStatus,
} from '@/lib/homepage';

type ProductCardProps = {
  product: Product;
  onViewDetail: (product: Product) => void;
};

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const stockStatus = getStockStatus(product.stock);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(37,99,235,0.45)] animate-fade-in-up">
      <button type="button" onClick={() => onViewDetail(product)} className="flex h-full flex-col text-left">
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-48">
          <img
            src={product.images[0] || '/store-1.jpg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = '/store-1.jpg';
            }}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-slate-950/55 to-transparent" />

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className={`${stockStatus.color} rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-md`}>
              {stockStatus.text}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
              {product.category}
            </span>
          </div>

          {product.discount && product.discount > 0 ? (
            <div className="absolute right-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
              Hemat Rp {product.discount.toLocaleString('id-ID')}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-blue-700 sm:text-[15px]">
            {product.name}
          </h3>

          <div className="mb-3 rounded-2xl bg-slate-50 p-3">
            {product.discount && product.discount > 0 ? (
              <div className="space-y-1.5">
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(extractNumericPrice(product.price))}
                </p>
                <p className="text-lg font-bold text-rose-600">
                  {formatPrice(extractNumericPrice(calculateDiscountedPrice(product.price, product.discount)))}
                </p>
              </div>
            ) : (
              <p className="text-lg font-bold text-blue-700">
                {formatPrice(extractNumericPrice(product.price))}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500 sm:text-xs">
              <span className="truncate">Stock tersedia: {product.stock} pcs</span>
              <span className="rounded-full bg-slate-200 px-2.5 py-1 font-semibold text-slate-700">
                {getConditionLabel(product.condition)}
              </span>
            </div>
          </div>

          <p className="mb-4 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
            {product.description}
          </p>
        </div>
      </button>

      <div className="px-4 pb-4">
        <button
          type="button"
          className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 px-4 py-3 text-xs font-bold text-white transition-all duration-200 hover:shadow-lg hover:from-emerald-600 hover:to-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          disabled={product.stock === 0}
          onClick={() => {
            window.open(buildWhatsAppProductUrl(product), '_blank');
          }}
        >
          {product.stock === 0 ? 'Stok Habis' : 'Chat via WhatsApp'}
        </button>
      </div>
    </article>
  );
}
