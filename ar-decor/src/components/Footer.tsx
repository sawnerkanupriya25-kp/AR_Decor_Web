import Link from 'next/link';

interface FooterProps {
  settings?: any;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-gradient-premium text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gradient-gold mb-4">AR Decor</h3>
            <p className="text-gray-300 mb-4">
              {settings?.site_tagline || 'We Decorate Your Moments, You Create the Memories.'}
            </p>
            <div className="flex space-x-4">
              <a
                href={settings?.instagram_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/balloon-decor" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Balloon Decor
                </Link>
              </li>
              <li>
                <Link href="/wedding-entries" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Wedding Entries
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/balloon-decor/birthday-decor" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Birthday Decor
                </Link>
              </li>
              <li>
                <Link href="/balloon-decor/baby-shower" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Baby Shower
                </Link>
              </li>
              <li>
                <Link href="/balloon-decor/name-reveal" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Name Reveal
                </Link>
              </li>
              <li>
                <Link href="/wedding-entries/pyro-entry" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Pyro Entry
                </Link>
              </li>
              <li>
                <Link href="/wedding-entries/smoke-entry" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Smoke Entry
                </Link>
              </li>
              <li>
                <Link href="/wedding-entries/haldi-setup" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Haldi Setup
                </Link>
              </li>
              <li>
                <Link href="/wedding-entries/mehndi-setup" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Mehndi Setup
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <a href={`tel:${settings?.contact_phone || '8269037288'}`} className="hover:text-[#D4AF37]">
                  {settings?.contact_phone || '8269037288'}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>💬</span>
                <a href={`https://wa.me/91${settings?.whatsapp_number || '8269037288'}`} className="hover:text-[#D4AF37]">
                  WhatsApp Available
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>{settings?.footer_content || '© 2024 AR Decor. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}
