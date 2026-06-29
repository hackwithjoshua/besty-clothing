'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const KENTE_VERTICAL = `repeating-linear-gradient(
  to bottom,
  #E8B820 0px,  #E8B820 14px,
  #0C0800 14px, #0C0800 20px,
  #D44820 20px, #D44820 34px,
  #0C0800 34px, #0C0800 40px,
  #0A4030 40px, #0A4030 54px,
  #0C0800 54px, #0C0800 60px,
  #B82010 60px, #B82010 74px,
  #0C0800 74px, #0C0800 80px,
  #1B2B7A 80px, #1B2B7A 94px,
  #0C0800 94px, #0C0800 100px
)`;

const KENTE_HORIZONTAL = `repeating-linear-gradient(
  90deg,
  #E8B820 0px, #E8B820 22px,
  #0C0800 22px, #0C0800 26px,
  #D44820 26px, #D44820 48px,
  #0C0800 48px, #0C0800 52px,
  #0A4030 52px, #0A4030 74px,
  #0C0800 74px, #0C0800 78px,
  #B82010 78px, #B82010 100px,
  #0C0800 100px, #0C0800 104px
)`;

/* Strip widths — keep as constants so left panel and image match perfectly */
const LEFT_STRIP  = 6;   /* px — left edge of left panel */
const RIGHT_STRIP = 8;   /* px — right edge of left panel / left edge of image (the seam) */
const FAR_STRIP   = 6;   /* px — right edge of image */

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col" style={{ backgroundColor: '#0C0800' }}>
      <div className="h-[73px] shrink-0" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[46fr_54fr] min-h-[calc(100vh-73px)]">

        {/* ═══════════════════════
            LEFT PANEL
            ═══════════════════════ */}
        <div className="relative flex flex-col overflow-hidden order-2 lg:order-1">

          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#0E0900',
              backgroundImage: `
                repeating-linear-gradient(60deg,  transparent 0px, transparent 28px, rgba(232,184,32,0.04) 28px, rgba(232,184,32,0.04) 29px),
                repeating-linear-gradient(-60deg, transparent 0px, transparent 28px, rgba(212,72,32,0.03) 28px, rgba(212,72,32,0.03) 29px)
              `,
            }}
          />

          {/* Left edge strip */}
          <div
            className="absolute top-0 left-0 bottom-0 z-10"
            style={{ width: LEFT_STRIP, backgroundImage: KENTE_VERTICAL }}
          />

          {/* Right edge strip — the seam (slim) */}
          <div
            className="absolute top-0 right-0 bottom-0 z-10 hidden lg:block"
            style={{ width: RIGHT_STRIP, backgroundImage: KENTE_VERTICAL }}
          />

          {/* Horizontal kente accent — connects left strip to right strip exactly */}
          <div
            className="absolute z-10 hidden lg:block"
            style={{
              top: '38%',
              left: LEFT_STRIP,
              right: RIGHT_STRIP,
              height: 5,
              backgroundImage: KENTE_HORIZONTAL,
            }}
          />

          {/* Content — padded to sit inside the strips */}
          <div
            className="relative z-10 flex flex-col justify-between h-full pt-10 pb-10 lg:pt-14 lg:pb-14"
            style={{
              paddingLeft: LEFT_STRIP + 24,
              paddingRight: RIGHT_STRIP + 16,
            }}
          >
            {/* Top */}
            <div>
              <div className="flex items-center gap-3 mb-10 lg:mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-6 h-px bg-kente-gold" />
                <span className="text-kente-gold text-[10px] font-body font-bold uppercase tracking-[0.45em]">
                  Lagos · Nigeria · 2025
                </span>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h1
                  className="text-cream font-heading font-light leading-[0.86] whitespace-nowrap"
                  style={{ fontSize: 'clamp(3.2rem, 7.5vw, 9.5rem)', letterSpacing: '-0.03em' }}
                >
                  BESTY
                </h1>
                <div
                  className="font-heading font-bold leading-[0.86] whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(3.2rem, 7.5vw, 9.5rem)',
                    letterSpacing: '-0.03em',
                    WebkitTextStroke: '2px #E8B820',
                    color: 'transparent',
                  }}
                >
                  CLOTHING
                </div>
              </div>

              <p
                className="font-heading font-light italic text-cream/50 mt-6"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
              >
                Wear Your African Story
              </p>
            </div>

            {/* Bottom */}
            <div className="animate-slide-up" style={{ animationDelay: '0.38s' }}>

              {/* Kente bar — marginRight -16 closes the gap to the right strip edge */}
              <div
                className="mb-7"
                style={{ height: 6, backgroundImage: KENTE_HORIZONTAL, marginRight: -16 }}
              />

              <p className="font-body text-cream/50 text-[0.875rem] leading-relaxed mb-8 max-w-[300px]">
                Authentic Ankara · Kente · Aso-oke · Adire —
                handcrafted by skilled Nigerian artisans.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/products" className="btn-gold group flex items-center gap-2">
                  Shop Collection
                  <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/products?featured=true" className="btn-outline-gold">
                  Featured
                </Link>
              </div>

              <div className="flex items-center">
                {[
                  { n: '500+', label: 'Designs' },
                  { n: '12K+', label: 'Customers' },
                  { n: '100%', label: 'Authentic' },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center">
                    {i > 0 && <div className="w-px h-8 bg-cream/10 mx-5" />}
                    <div>
                      <p className="font-heading text-[1.6rem] font-bold text-kente-gold leading-none">{s.n}</p>
                      <p className="text-[10px] text-cream/35 uppercase tracking-widest font-body mt-1">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════
            RIGHT PANEL — Image
            ═══════════════════════ */}
        <div className="relative min-h-[60vw] lg:min-h-0 order-1 lg:order-2 overflow-hidden">
          <Image
            src="/culture.png"
            alt="African fashion — Besty Clothing"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />

          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-ink/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-ink/65 to-transparent" />

          {/* Left edge strip — matches right strip of left panel exactly (same width = seamless seam) */}
          <div
            className="absolute top-0 left-0 bottom-0 z-10 hidden lg:block"
            style={{ width: RIGHT_STRIP, backgroundImage: KENTE_VERTICAL }}
          />

          {/* Right edge strip */}
          <div
            className="absolute top-0 right-0 bottom-0 z-10"
            style={{ width: FAR_STRIP, backgroundImage: KENTE_VERTICAL }}
          />

          {/* Season badge */}
          <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-20">
            <div style={{ height: 5, backgroundImage: KENTE_HORIZONTAL }} />
            <div className="bg-ink/88 backdrop-blur-md px-5 py-4 border-b-[3px] border-kente-gold">
              <p className="text-kente-gold text-[9px] font-body font-bold uppercase tracking-[0.4em] mb-1">
                New Collection
              </p>
              <p className="text-cream font-heading text-2xl font-light leading-none">
                Harmattan<br />
                <span className="text-kente-gold italic">2025</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="kente-bar" />
    </section>
  );
}
