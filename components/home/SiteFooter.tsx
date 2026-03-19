import { WHATSAPP_NUMBER } from '@/lib/homepage';

export function SiteFooter() {
  return (
    <footer id="hubungi" className="bg-linear-to-r from-gray-900 via-blue-900 to-gray-900 text-gray-300 py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Universal Komputer</h4>
            <p className="text-sm leading-relaxed text-gray-400">
              Toko komputer terpercaya untuk kebutuhan teknologi Anda. Menyediakan produk berkualitas dengan harga terjangkau.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-4">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#beli" className="text-gray-400 hover:text-white transition-colors">Produk</a></li>
              <li><a href="#hubungi" className="text-gray-400 hover:text-white transition-colors">Kontak</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Service Laptop</li>
              <li className="text-gray-400">Service Komputer</li>
              <li className="text-gray-400">Service Printer</li>
              <li className="text-gray-400">Konsultasi Teknis</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>Tel</span>
                <div>
                  <p className="text-gray-400">0812 8968 9799</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>Email</span>
                <div>
                  <p className="text-gray-400">info@universalcomputer.id</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>Alamat</span>
                <div>
                  <p className="text-gray-400">Jl. Ciledug Raya No.3</p>
                  <p className="text-gray-400">Tangerang, Banten</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 Universal Komputer. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              WhatsApp
            </a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
