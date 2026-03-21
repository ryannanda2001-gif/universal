type HeroBannerProps = {
  imageSrc: string;
};

export function HeroBanner({ imageSrc }: HeroBannerProps) {
  return (
    <section id="home" className="relative aspect-video w-full overflow-hidden bg-slate-950">
      <img
        src={imageSrc || '/store-1.jpg'}
        alt="Banner Universal Komputer"
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.src = '/store-1.jpg';
        }}
      />
    </section>
  );
}
