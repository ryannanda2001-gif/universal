import type { Product } from '@/lib/product-schema';
import {
  buildWhatsAppProductUrl,
  calculateDiscountedPrice,
  extractNumericPrice,
  formatPrice,
  getStockStatus,
} from '@/lib/homepage';

type ProductCardProps = {
  product: Product;
  onViewDetail: (product: Product) => void;
};

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const stockStatus = getStockStatus(product.stock);

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
      <button type="button" onClick={() => onViewDetail(product)} className="text-left group flex flex-col h-full">
        <div className="relative w-full h-32 sm:h-40 bg-gray-100 overflow-hidden shrink-0">
          <img
            src={product.images[0] || '/store-1.jpg'}
            alt={product.name}
            className="relative z-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/store-1.jpg';
            }}
          />

          <div className="absolute top-2 left-2 z-20">
            <span className={`${stockStatus.color} text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md`}>
              {stockStatus.text}
            </span>
          </div>

          {product.discount && product.discount > 0 ? (
            <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
              -Rp {product.discount.toLocaleString('id-ID')}
            </div>
          ) : null}

          {product.images.length > 1 ? (
            <div className="absolute bottom-2 right-2 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {product.images.length} foto
            </div>
          ) : null}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <div className="mb-3 flex-1">
            {product.discount && product.discount > 0 ? (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 line-through">
                  {formatPrice(extractNumericPrice(product.price))}
                </p>
                <p className="text-sm sm:text-base font-bold text-red-600">
                  {formatPrice(extractNumericPrice(calculateDiscountedPrice(product.price, product.discount)))}
                </p>
              </div>
            ) : (
              <p className="text-sm sm:text-base font-bold text-blue-600">
                {formatPrice(extractNumericPrice(product.price))}
              </p>
            )}
          </div>
        </div>
      </button>

      <div className="px-3 pb-3">
        <button
          type="button"
          className="w-full bg-linear-to-r from-green-500 to-green-600 text-white text-xs sm:text-sm py-2.5 rounded-lg font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700"
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
