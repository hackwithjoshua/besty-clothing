'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X, LogOut, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [pathname]);

  const isHome = pathname === '/';
  const forceWhite = !isHome || scrolled || menuOpen;

  const navLinks = [
    { href: '/products', label: 'Collections' },
    { href: '/products?category=dress', label: 'Dresses' },
    { href: '/products?category=suit', label: 'Suits' },
    { href: '/products?category=accessories', label: 'Accessories' },
  ];

  return (
    <>
      {/* Kente top strip */}
      <div className="fixed top-0 left-0 right-0 z-50 kente-strip" />

      <header
        className={`fixed top-[5px] left-0 right-0 z-40 transition-all duration-300 ${
          forceWhite
            ? 'bg-cream border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/besty-logo.png"
                alt="Besty Clothing"
                height={44}
                width={130}
                className={`object-contain transition-all duration-300 ${forceWhite ? '' : 'brightness-0 invert'}`}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-[11px] font-body font-semibold uppercase tracking-[0.16em] transition-colors group ${
                    forceWhite ? 'text-muted hover:text-ink' : 'text-cream/70 hover:text-cream'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 ${
                      forceWhite ? 'bg-ankara-orange' : 'bg-kente-gold'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button
                onClick={() => setIsOpen(true)}
                className={`relative p-2.5 transition-colors ${
                  forceWhite ? 'text-ink hover:text-ankara-orange' : 'text-cream hover:text-kente-gold'
                }`}
                aria-label="Cart"
              >
                <ShoppingBag size={21} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-ankara-orange text-cream text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-1.5 p-2.5 transition-colors ${
                      forceWhite ? 'text-ink hover:text-ankara-orange' : 'text-cream hover:text-kente-gold'
                    }`}
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-ankara-orange text-cream text-[10px] font-bold flex items-center justify-center">
                        {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <ChevronDown size={12} strokeWidth={2.5} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-cream border border-border shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs font-semibold text-ink truncate">{user.displayName || 'My Account'}</p>
                        <p className="text-[11px] text-muted truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link href="/orders" className="flex items-center gap-2.5 px-4 py-3 text-xs font-body text-ink hover:bg-cream-dark hover:text-ankara-orange transition-colors">
                        <Package size={14} strokeWidth={1.5} /> My Orders
                      </Link>
                      <button onClick={logout} className="flex items-center gap-2.5 w-full px-4 py-3 text-xs font-body text-ink hover:bg-cream-dark hover:text-ankara-red transition-colors border-t border-border">
                        <LogOut size={14} strokeWidth={1.5} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className={`hidden lg:flex items-center gap-1.5 p-2.5 text-[11px] font-body font-semibold uppercase tracking-widest transition-colors ${
                    forceWhite ? 'text-ink hover:text-ankara-orange' : 'text-cream hover:text-kente-gold'
                  }`}
                >
                  <User size={18} strokeWidth={1.5} />
                  Sign In
                </Link>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden p-2.5 transition-colors ${forceWhite ? 'text-ink' : 'text-cream'}`}
              >
                {menuOpen ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-ink text-cream">
            <div className="kente-bar" />
            <div className="px-5 py-6 flex flex-col gap-0.5">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="py-3.5 text-sm font-body font-semibold uppercase tracking-widest text-cream/70 hover:text-kente-gold border-b border-border-dark transition-colors">
                  {l.label}
                </Link>
              ))}
              <div className="pt-5 flex items-center gap-5">
                {user ? (
                  <>
                    <Link href="/orders" className="text-xs text-cream/60 hover:text-kente-gold transition-colors uppercase tracking-widest">Orders</Link>
                    <button onClick={logout} className="text-xs text-ankara-orange uppercase tracking-widest">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="text-xs font-semibold text-cream uppercase tracking-widest hover:text-kente-gold">Sign In</Link>
                    <Link href="/auth/register" className="text-xs font-semibold text-kente-gold uppercase tracking-widest">Register</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {userMenuOpen && <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
