import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="kente-bar" />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/besty-logo.png"
                alt="Besty Clothing"
                height={48}
                width={140}
                className="object-contain brightness-0 invert mb-1"
              />
              <p className="text-[8px] font-body font-bold uppercase tracking-[0.35em] text-kente-gold mt-2">
                Lagos · Nigeria
              </p>
            </div>
            <div className="kente-bar w-14 mb-5" />
            <p className="text-sm font-body text-cream/50 leading-relaxed mb-6 max-w-xs">
              Celebrating African heritage through timeless fashion.
              Every piece tells a story of culture, craftsmanship, and pride.
            </p>
            {/* Social — inline SVG icons */}
            <div className="flex items-center gap-3">
              {[
                {
                  label: 'Instagram', href: '#',
                  svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                },
                {
                  label: 'Facebook', href: '#',
                  svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                },
                {
                  label: 'X/Twitter', href: '#',
                  svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                },
              ].map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 border border-cream/15 flex items-center justify-center text-cream/40 hover:border-kente-gold hover:text-kente-gold transition-colors"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[9px] font-body font-bold uppercase tracking-[0.3em] text-kente-gold mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                ['All Collections', '/products'],
                ['Dresses', '/products?category=dress'],
                ['Tops & Blouses', '/products?category=top'],
                ['Skirts', '/products?category=skirt'],
                ['Wrappers', '/products?category=wrapper'],
                ['Suits & Agbada', '/products?category=suit'],
                ['Accessories', '/products?category=accessories'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[13px] font-body text-cream/50 hover:text-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-[9px] font-body font-bold uppercase tracking-[0.3em] text-kente-gold mb-5">
              Help
            </h3>
            <ul className="space-y-3">
              {[
                ['My Orders', '/orders'],
                ['Size Guide', '#'],
                ['Care Instructions', '#'],
                ['Returns & Exchanges', '#'],
                ['Shipping Policy', '#'],
                ['Privacy Policy', '#'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[13px] font-body text-cream/50 hover:text-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[9px] font-body font-bold uppercase tracking-[0.3em] text-kente-gold mb-5">
              Contact
            </h3>
            <ul className="space-y-4 mb-7">
              <li className="flex items-start gap-3">
                <MapPin size={14} strokeWidth={1.5} className="text-ankara-orange shrink-0 mt-0.5" />
                <span className="text-[13px] font-body text-cream/50">Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} strokeWidth={1.5} className="text-ankara-orange shrink-0" />
                <a href="tel:+2348000000000" className="text-[13px] font-body text-cream/50 hover:text-cream transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} strokeWidth={1.5} className="text-ankara-orange shrink-0" />
                <a href="mailto:hello@bestyclothing.com" className="text-[13px] font-body text-cream/50 hover:text-cream transition-colors">
                  hello@bestyclothing.com
                </a>
              </li>
            </ul>

            {/* Payment badges */}
            <p className="text-[9px] uppercase tracking-widest text-cream/20 mb-3 font-body">We Accept</p>
            <div className="flex items-center gap-2 flex-wrap">
              {['Paystack', 'Visa', 'Verve', 'USSD'].map((m) => (
                <div key={m} className="border border-cream/10 px-2 py-1 text-[9px] font-bold text-cream/30 tracking-wider font-body">
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="kente-bar mt-12 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-body text-cream/25">
            © {new Date().getFullYear()} Besty Clothing. All rights reserved. Lagos, Nigeria.
          </p>
          <p className="text-[11px] font-body text-cream/25">
            Handcrafted in Africa · Delivered Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
