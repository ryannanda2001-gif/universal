import { WHATSAPP_NUMBER } from '@/lib/homepage';

export function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 font-semibold"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi via WhatsApp"
    >
      WhatsApp
    </a>
  );
}
