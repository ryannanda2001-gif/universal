import Link from 'next/link';

type HomeHeaderProps = {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

export function HomeHeader({ isMenuOpen, onToggleMenu, onCloseMenu }: HomeHeaderProps) {
  return (
    <header className="bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-wide font-brand">Universal Komputer</Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/products" className="hover:underline">Produk</Link>
        </nav>

        <button className="md:hidden text-white focus:outline-none" onClick={onToggleMenu} type="button">
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
        <div className="md:hidden bg-linear-to-b from-blue-700 to-blue-600 px-4 py-4">
          <nav className="flex flex-col space-y-3">
            <Link href="/" className="hover:underline" onClick={onCloseMenu}>Home</Link>
            <Link href="/products" className="hover:underline" onClick={onCloseMenu}>Produk</Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
