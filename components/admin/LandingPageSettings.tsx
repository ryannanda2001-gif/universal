import { MAX_SERVICE_IMAGES, type SiteContent } from '@/lib/site-content';

type SiteContentField = Exclude<keyof SiteContent, 'services'>;

type LandingPageSettingsProps = {
  siteContent: SiteContent;
  isLoading: boolean;
  isSaving: boolean;
  error: string;
  onFieldChange: (field: SiteContentField, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'aboutImage') => void;
  onServiceChange: (serviceIndex: number, field: 'title' | 'description', value: string) => void;
  onServiceImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    serviceIndex: number,
    imageIndex: number
  ) => void;
  onServiceImageRemove: (serviceIndex: number, imageIndex: number) => void;
  onSave: () => void;
};

type TextFieldProps = {
  label: string;
  field: SiteContentField;
  value: string;
  onFieldChange: LandingPageSettingsProps['onFieldChange'];
  multiline?: boolean;
  rows?: number;
};

function TextField({ label, field, value, onFieldChange, multiline = false, rows = 4 }: TextFieldProps) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onFieldChange(field, event.target.value)}
          rows={rows}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onFieldChange(field, event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
        />
      )}
    </label>
  );
}

export function LandingPageSettings({
  siteContent,
  isLoading,
  isSaving,
  error,
  onFieldChange,
  onImageUpload,
  onServiceChange,
  onServiceImageUpload,
  onServiceImageRemove,
  onSave,
}: LandingPageSettingsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Kustomisasi Landing Page</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ubah banner, layanan, footer, dan kontak website langsung dari dashboard admin.
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
                <TextField
                  label="Badge"
                  field="productsBadge"
                  value={siteContent.productsBadge}
                  onFieldChange={onFieldChange}
                />
                <TextField
                  label="Judul"
                  field="productsTitle"
                  value={siteContent.productsTitle}
                  onFieldChange={onFieldChange}
                />
                <TextField
                  label="Deskripsi"
                  field="productsDescription"
                  value={siteContent.productsDescription}
                  onFieldChange={onFieldChange}
                  multiline
                />
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
                <TextField label="Badge" field="aboutBadge" value={siteContent.aboutBadge} onFieldChange={onFieldChange} />
                <TextField label="Judul" field="aboutTitle" value={siteContent.aboutTitle} onFieldChange={onFieldChange} />
                <TextField
                  label="Paragraf 1"
                  field="aboutParagraphOne"
                  value={siteContent.aboutParagraphOne}
                  onFieldChange={onFieldChange}
                  multiline
                />
                <TextField
                  label="Paragraf 2"
                  field="aboutParagraphTwo"
                  value={siteContent.aboutParagraphTwo}
                  onFieldChange={onFieldChange}
                  multiline
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Footer & Kontak</h3>
              <div className="space-y-4">
                <TextField label="Badge Footer" field="footerBadge" value={siteContent.footerBadge} onFieldChange={onFieldChange} />
                <TextField label="Judul Footer" field="footerTitle" value={siteContent.footerTitle} onFieldChange={onFieldChange} />
                <TextField
                  label="Deskripsi Footer"
                  field="footerDescription"
                  value={siteContent.footerDescription}
                  onFieldChange={onFieldChange}
                  multiline
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Nomor WhatsApp" field="contactPhone" value={siteContent.contactPhone} onFieldChange={onFieldChange} />
                  <TextField label="Email" field="contactEmail" value={siteContent.contactEmail} onFieldChange={onFieldChange} />
                </div>
                <TextField
                  label="Alamat Baris 1"
                  field="contactAddressLine1"
                  value={siteContent.contactAddressLine1}
                  onFieldChange={onFieldChange}
                />
                <TextField
                  label="Alamat Baris 2"
                  field="contactAddressLine2"
                  value={siteContent.contactAddressLine2}
                  onFieldChange={onFieldChange}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="URL Instagram" field="instagramUrl" value={siteContent.instagramUrl} onFieldChange={onFieldChange} />
                  <TextField label="Label Instagram" field="instagramLabel" value={siteContent.instagramLabel} onFieldChange={onFieldChange} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="URL TikTok" field="tiktokUrl" value={siteContent.tiktokUrl} onFieldChange={onFieldChange} />
                  <TextField label="Label TikTok" field="tiktokLabel" value={siteContent.tiktokLabel} onFieldChange={onFieldChange} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Google Maps Embed URL" field="mapsEmbedUrl" value={siteContent.mapsEmbedUrl} onFieldChange={onFieldChange} />
                  <TextField label="Label Maps" field="mapsLabel" value={siteContent.mapsLabel} onFieldChange={onFieldChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Section Layanan</h3>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Badge Layanan" field="servicesBadge" value={siteContent.servicesBadge} onFieldChange={onFieldChange} />
                <TextField label="Judul Layanan" field="servicesTitle" value={siteContent.servicesTitle} onFieldChange={onFieldChange} />
              </div>

              {siteContent.services.map((service, serviceIndex) => (
                <div
                  key={`service-${serviceIndex}`}
                  className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Layanan {serviceIndex + 1}</p>
                      <p className="text-xs text-slate-500">Maksimal {MAX_SERVICE_IMAGES} gambar untuk rotasi otomatis di landing page.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {service.images.length}/{MAX_SERVICE_IMAGES} gambar
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Judul Layanan
                      <input
                        type="text"
                        value={service.title}
                        onChange={(event) => onServiceChange(serviceIndex, 'title', event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Deskripsi Layanan
                      <textarea
                        value={service.description}
                        onChange={(event) => onServiceChange(serviceIndex, 'description', event.target.value)}
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
                      />
                    </label>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700">Galeri Layanan</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                      {Array.from({ length: MAX_SERVICE_IMAGES }).map((_, imageIndex) => {
                        const image = service.images[imageIndex] || '';

                        return (
                          <div key={`service-${serviceIndex}-image-${imageIndex}`} className="group relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => onServiceImageUpload(event, serviceIndex, imageIndex)}
                              className="hidden"
                              id={`service-${serviceIndex}-image-input-${imageIndex}`}
                            />
                            <label
                              htmlFor={`service-${serviceIndex}-image-input-${imageIndex}`}
                              className={`flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                                image ? 'border-cyan-400 bg-cyan-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              {image ? (
                                <img src={image} alt={`Layanan ${serviceIndex + 1} gambar ${imageIndex + 1}`} className="h-full w-full object-cover" />
                              ) : (
                                <div className="p-3 text-center">
                                  <p className="text-xs font-semibold text-slate-600">Tambah Gambar {imageIndex + 1}</p>
                                </div>
                              )}
                            </label>
                            {image ? (
                              <button
                                type="button"
                                onClick={() => onServiceImageRemove(serviceIndex, imageIndex)}
                                className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[11px] font-bold text-red-600 shadow-sm transition hover:bg-white"
                              >
                                Hapus
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
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
