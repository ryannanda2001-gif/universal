import Link from 'next/link';

type HomeHeaderProps = {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

export function HomeHeader({ isMenuOpen, onToggleMenu, onCloseMenu }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-linear-to-r from-slate-950 via-blue-900 to-cyan-700 py-4 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-brand text-xl font-bold tracking-wide md:text-2xl">Universal Komputer</Link>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link href="/" className="text-sm font-semibold text-white/90 transition hover:text-white">Home</Link>
          <Link href="/products" className="text-sm font-semibold text-white/90 transition hover:text-white">Produk</Link>
        </nav>

        <button className="text-white focus:outline-none md:hidden" onClick={onToggleMenu} type="button">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen ? (
        <div className="bg-linear-to-b from-blue-950 to-blue-900 px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-3">
            <Link href="/" className="font-semibold text-white/90 transition hover:text-white" onClick={onCloseMenu}>Home</Link>
            <Link href="/products" className="font-semibold text-white/90 transition hover:text-white" onClick={onCloseMenu}>Produk</Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
