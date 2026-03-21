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
    <article className="group flex h-full min-h-[355px] flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_45px_-34px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-36px_rgba(37,99,235,0.4)] animate-fade-in-up">
      <button type="button" onClick={() => onViewDetail(product)} className="flex h-full flex-col text-left">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-white">
          <img
            src={product.images[0] || '/store-1.jpg'}
            alt={product.name}
            className="h-full w-full object-contain object-center"
            onError={(e) => {
              e.currentTarget.src = '/store-1.jpg';
            }}
          />

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

        <div className="flex flex-1 flex-col p-3 sm:p-3.5">
          <h3 className="mb-2 min-h-[2.5rem] line-clamp-2 text-[13px] font-bold leading-5 text-slate-900 transition-colors group-hover:text-blue-700 sm:text-sm">
            {product.name}
          </h3>

          <div className="mb-2 min-h-[3rem]">
            {product.discount && product.discount > 0 ? (
              <div className="space-y-1">
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(extractNumericPrice(product.price))}
                </p>
                <p className="text-base font-bold text-rose-600 sm:text-lg">
                  {formatPrice(extractNumericPrice(calculateDiscountedPrice(product.price, product.discount)))}
                </p>
              </div>
            ) : (
              <p className="text-base font-bold text-blue-700 sm:text-lg">
                {formatPrice(extractNumericPrice(product.price))}
              </p>
            )}
          </div>

          <p className="mb-2.5 min-h-[3.25rem] line-clamp-2 text-[12px] leading-5 text-slate-500">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="truncate">Stock tersedia: {product.stock} pcs</span>
            <span className="font-semibold text-slate-700">
              {getConditionLabel(product.condition)}
            </span>
          </div>
        </div>
      </button>

      <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5">
        <button
          type="button"
          className="w-full rounded-2xl bg-linear-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:shadow-lg hover:from-emerald-600 hover:to-green-700 disabled:cursor-not-allowed disabled:opacity-50"
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
