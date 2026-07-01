'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const ACCESSORIES_IMAGES = [
  'https://res.cloudinary.com/dfpf4deqc/image/upload/v1782866684/0_wyrUyOqQwdz3o5OQ_nc6ujh.png',
  'https://res.cloudinary.com/dfpf4deqc/image/upload/v1782866682/images_3_0bc0b6a1-0a5a-4d9a-ab4d-e50e9d48171e_480x480_cjg0fz.webp',
  'https://res.cloudinary.com/dfpf4deqc/image/upload/v1782866682/images_6_fq1xps.jpg',
  'https://res.cloudinary.com/dfpf4deqc/image/upload/v1782866682/images_7_wqvuam.jpg',
];

const categories = [
  {
    label: 'Women Unique Pieces',
    slug: 'women-unique-pieces',
    image: 'https://res.cloudinary.com/dfpf4deqc/image/upload/v1782866021/images_2_y5bybr.jpg',
    sub: 'Ankara · Kente · Aso-oke',
    color: '#D44820',
  },
  {
    label: 'Men Unique Styles',
    slug: 'men-unique-styles',
    image: 'https://res.cloudinary.com/dfpf4deqc/image/upload/v1782866022/images_3_arexju.jpg',
    sub: 'Peplum · Dashiki · Lace',
    color: '#0A4030',
  },
  {
    label: 'Suits',
    slug: 'suit',
    image: 'https://res.cloudinary.com/dfpf4deqc/image/upload/v1782866508/images_5_guamzh.jpg',
    sub: 'Senator · Agbada · Buba',
    color: '#1B2B7A',
  },
];

function AccessoriesCard() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % ACCESSORIES_IMAGES.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/products?category=accessories" className="cat-card block">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
        <Image
          src={ACCESSORIES_IMAGES[current]}
          alt="Accessories"
          fill
          className="object-cover cat-card-img"
          sizes="(max-width: 640px) 50vw, 25vw"
          style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.3s ease' }}
        />
        <div className="cat-card-overlay" />

        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: '#E8B820' }} />

        {/* Dot indicators */}
        <div className="absolute top-3 right-3 flex gap-1 z-10">
          {ACCESSORIES_IMAGES.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ background: i === current ? '#E8B820' : 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 z-10">
          <p className="text-[9px] text-cream/50 uppercase tracking-widest font-body mb-1">Beads · Gele · Coral</p>
          <h3 className="font-heading font-semibold text-cream leading-none" style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>
            Accessories
          </h3>
          <div className="mt-2 kente-strip w-10 opacity-70" />
        </div>

        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: '#E8B820' }} />
      </div>
    </Link>
  );
}

export default function CategorySection() {
  return (
    <section className="bg-ink py-16 px-0">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 mb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-kente-gold mb-3">
              Browse by Category
            </p>
            <h2 className="font-heading text-cream font-light" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Find Your Style
            </h2>
          </div>
          <Link href="/products" className="hidden sm:block text-[11px] font-body font-semibold uppercase tracking-widest text-cream/40 hover:text-kente-gold transition-colors border-b border-cream/20 pb-0.5 hover:border-kente-gold">
            View all →
          </Link>
        </div>
        <div className="kente-bar mt-5 w-20" />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="cat-card block">
              <div className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover cat-card-img"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="cat-card-overlay" />
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: cat.color }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 z-10">
                  <p className="text-[9px] text-cream/50 uppercase tracking-widest font-body mb-1">{cat.sub}</p>
                  <h3 className="font-heading font-semibold text-cream leading-none" style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>
                    {cat.label}
                  </h3>
                  <div className="mt-2 kente-strip w-10 opacity-70" />
                </div>
                <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: cat.color }} />
              </div>
            </Link>
          ))}
          <AccessoriesCard />
        </div>
      </div>

      <div className="kente-bar mt-14" />
    </section>
  );
}
