import type { Product } from '@/lib/product-schema';
import {
  buildWhatsAppProductUrl,
  calculateDiscountedPrice,
  extractNumericPrice,
  formatPrice,
  getConditionLabel,
  getStockStatus,
} from '@/lib/homepage';

type ProductDetailModalProps = {
  product: Product | null;
  currentImageIndex: number;
  onClose: () => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
};

export function ProductDetailModal({
  product,
  currentImageIndex,
  onClose,
  onPrevImage,
  onNextImage,
  onSelectImage,
}: ProductDetailModalProps) {
  if (!product) return null;

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative my-8 flex w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl md:flex-row">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 hover:bg-gray-100 z-10" type="button">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex w-full flex-col bg-white md:w-[56%]">
          <div className="relative flex min-h-[340px] flex-1 items-center justify-center bg-white p-4 md:min-h-[620px] md:p-6">
            {product.images[currentImageIndex] ? (
              <div className="mx-auto w-full max-w-[680px] bg-slate-100 rounded-[28px] p-4">
               <img
                 src={product.images[currentImageIndex]}
                  alt={product.name}
                   className="w-full h-auto object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center"><span className="text-gray-500">Tidak ada gambar</span></div>
            )}

            <div className="absolute left-4 top-4">
              <span className={`${stockStatus.color} text-white px-3 py-1.5 rounded-full text-sm font-bold`}>{stockStatus.text}</span>
            </div>

            {product.discount && product.discount > 0 ? (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                -Rp {product.discount.toLocaleString('id-ID')}
              </div>
            ) : null}

            {product.images.length > 1 ? (
              <>
                <button onClick={onPrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-all shadow-lg" type="button">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={onNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-all shadow-lg" type="button">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>

          {product.images.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto border-t border-gray-200 bg-gray-50 p-3">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => onSelectImage(idx)}
                  className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'}`}
                >
                  {img ? <img src={img} alt={`Foto ${idx + 1}`} className="h-full w-full bg-white object-contain object-center p-1" /> : <div className="w-full h-full bg-gray-300" />}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex w-full flex-col space-y-4 overflow-y-auto p-6 md:w-[44%] md:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
              {product.category}
            </span>
            <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-bold tracking-wide text-slate-700">
              {getConditionLabel(product.condition)}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">{product.name}</h2>

          <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            {product.discount && product.discount > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm font-semibold">Harga Normal:</p>
                  <p className="text-base line-through text-gray-500 font-semibold">{formatPrice(extractNumericPrice(product.price))}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-bold">Harga Diskon:</p>
                  <p className="text-2xl font-bold text-red-600">{formatPrice(extractNumericPrice(calculateDiscountedPrice(product.price, product.discount)))}</p>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <p className="text-sm text-green-700 font-semibold">Hemat: {formatPrice(product.discount)}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-1">Harga:</p>
                <p className="text-2xl font-bold text-blue-700">{formatPrice(extractNumericPrice(product.price))}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Stok</h3>
              <p className="text-sm font-semibold text-slate-800">Tersedia {product.stock} pcs</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Kondisi</h3>
              <p className="text-sm font-semibold text-slate-800">{getConditionLabel(product.condition)}</p>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 text-sm mb-2 uppercase tracking-wide">Deskripsi Produk</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button onClick={onClose} className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm" type="button">
              Tutup
            </button>
            <a
              href={buildWhatsAppProductUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-3 text-white rounded-lg font-bold inline-flex items-center justify-center text-sm transition-all ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-green-500 to-green-600 hover:shadow-lg'}`}
              onClick={(e) => {
                if (product.stock === 0) e.preventDefault();
              }}
            >
              {product.stock === 0 ? 'Stok Habis' : 'Chat via WhatsApp'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
