import type { SiteContent } from '@/lib/site-content';

type LandingPageSettingsProps = {
  siteContent: SiteContent;
  isLoading: boolean;
  isSaving: boolean;
  error: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'aboutImage') => void;
  onSave: () => void;
};

export function LandingPageSettings({
  siteContent,
  isLoading,
  isSaving,
  error,
  onChange,
  onImageUpload,
  onSave,
}: LandingPageSettingsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Kustomisasi Landing Page</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ubah isi landing page secara langsung mulai dari banner, judul section produk, tentang toko, hingga footer kontak.
        </p>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      {isLoading ? (
        <p className="text-slate-500">Sedang memuat konten landing page...</p>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Banner Utama</h3>
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={siteContent.heroImage || '/store-1.jpg'}
                    alt="Preview banner"
                    className="aspect-video w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = '/store-1.jpg';
                    }}
                  />
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  Ganti Foto Banner
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                    onChange={(event) => onImageUpload(event, 'heroImage')}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Section Produk</h3>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Badge
                  <input
                    type="text"
                    name="productsBadge"
                    value={siteContent.productsBadge}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Judul
                  <input
                    type="text"
                    name="productsTitle"
                    value={siteContent.productsTitle}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Deskripsi
                  <textarea
                    name="productsDescription"
                    value={siteContent.productsDescription}
                    onChange={onChange}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Section Tentang Toko</h3>
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={siteContent.aboutImage || '/store-photo.jpg'}
                    alt="Preview tentang toko"
                    className="aspect-[4/3] w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = '/store-photo.jpg';
                    }}
                  />
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  Ganti Foto Tentang Toko
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                    onChange={(event) => onImageUpload(event, 'aboutImage')}
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Badge
                  <input
                    type="text"
                    name="aboutBadge"
                    value={siteContent.aboutBadge}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Judul
                  <input
                    type="text"
                    name="aboutTitle"
                    value={siteContent.aboutTitle}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Paragraf 1
                  <textarea
                    name="aboutParagraphOne"
                    value={siteContent.aboutParagraphOne}
                    onChange={onChange}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Paragraf 2
                  <textarea
                    name="aboutParagraphTwo"
                    value={siteContent.aboutParagraphTwo}
                    onChange={onChange}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Footer & Kontak</h3>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Badge Footer
                  <input
                    type="text"
                    name="footerBadge"
                    value={siteContent.footerBadge}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Judul Footer
                  <input
                    type="text"
                    name="footerTitle"
                    value={siteContent.footerTitle}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Deskripsi Footer
                  <textarea
                    name="footerDescription"
                    value={siteContent.footerDescription}
                    onChange={onChange}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Nomor WhatsApp
                    <input
                      type="text"
                      name="contactPhone"
                      value={siteContent.contactPhone}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Email
                    <input
                      type="text"
                      name="contactEmail"
                      value={siteContent.contactEmail}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                    />
                  </label>
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  Alamat Baris 1
                  <input
                    type="text"
                    name="contactAddressLine1"
                    value={siteContent.contactAddressLine1}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Alamat Baris 2
                  <input
                    type="text"
                    name="contactAddressLine2"
                    value={siteContent.contactAddressLine2}
                    onChange={onChange}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    URL Instagram
                    <input
                      type="text"
                      name="instagramUrl"
                      value={siteContent.instagramUrl}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Label Instagram
                    <input
                      type="text"
                      name="instagramLabel"
                      value={siteContent.instagramLabel}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                    />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    URL Facebook
                    <input
                      type="text"
                      name="facebookUrl"
                      value={siteContent.facebookUrl}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Label Facebook
                    <input
                      type="text"
                      name="facebookLabel"
                      value={siteContent.facebookLabel}
                      onChange={onChange}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Kustomisasi Landing Page'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
