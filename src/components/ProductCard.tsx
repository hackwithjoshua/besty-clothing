'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

interface Props { product: Product; }

const CATEGORY_COLORS: Record<string, string> = {
  dress: '#D44820',
  top: '#0A4030',
  wrapper: '#B82010',
  accessories: '#E8B820',
  suit: '#1B2B7A',
  skirt: '#D44820',
};

/* Pan positions — top of garment → torso → hem */
const PAN_PHASES = [
  'scale(1.38) translateY(-10%)',
  'scale(1.38) translateY(0%)',
  'scale(1.38) translateY(10%)',
];

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accentColor = CATEGORY_COLORS[product.category] || '#D44820';

  function handleMouseEnter() {
    setHovered(true);
    setPhase(0);
    let p = 0;
    timerRef.current = setInterval(() => {
      p = (p + 1) % PAN_PHASES.length;
      setPhase(p);
    }, 1800);
  }

  function handleMouseLeave() {
    setHovered(false);
    setPhase(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product, product.sizes[0] || 'M', product.colors[0] || 'Default');
  }

  const imgTransform = hovered ? PAN_PHASES[phase] : 'scale(1) translateY(0%)';
  const imgTransition = hovered ? 'transform 1.8s cubic-bezier(0.4,0,0.2,1)' : 'transform 0.5s ease-out';

  return (
    <div className="product-card group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Image wrapper */}
      <div className="product-card-img-wrap overflow-hidden">
        {product.images?.[0] && !imgErr ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top will-change-transform"
            style={{ transform: imgTransform, transition: imgTransition }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full bg-parchment flex items-center justify-center">
            <ShoppingBag size={36} strokeWidth={0.7} className="text-border" />
          </div>
        )}

        {/* Category accent top bar */}
        <div className="absolute top-0 left-0 w-full h-1 z-10" style={{ background: accentColor }} />

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-3 right-3 z-10 bg-kente-gold text-ink text-[9px] font-body font-bold uppercase tracking-widest px-2 py-1">
            Featured
          </div>
        )}

        {/* Pan indicator dots — show which section of the garment is in view */}
        {hovered && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
            {PAN_PHASES.map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full transition-all duration-300"
                style={{ background: i === phase ? '#E8B820' : 'rgba(255,255,255,0.4)', transform: i === phase ? 'scale(1.4)' : 'scale(1)' }}
              />
            ))}
          </div>
        )}

        {/* Reveal panel */}
        <div className="product-card-reveal z-10">
          <div className="flex gap-2">
            <button
              onClick={quickAdd}
              className="flex-1 flex items-center justify-center gap-2 text-[10px] font-body font-bold uppercase tracking-widest bg-cream text-ink hover:bg-kente-gold hover:text-ink py-2.5 transition-colors"
            >
              <ShoppingBag size={13} strokeWidth={2} />
              Add to Cart
            </button>
            <Link
              href={`/products/${product.id}`}
              className="w-10 flex items-center justify-center bg-cream/15 border border-cream/30 text-cream hover:bg-cream hover:text-ink transition-colors"
            >
              <Eye size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-2 px-0.5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-heading text-[1.05rem] font-semibold text-ink hover:text-ankara-orange transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className="font-body text-sm font-bold text-ankara-orange">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((c, i) => (
              <span key={i} className="text-[10px] text-muted bg-parchment px-1.5 py-0.5 font-body leading-none">
                {c.split('&')[0].trim()}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-light font-body mt-1 leading-none">
          {product.sizes.slice(0, 5).join(' · ')}
        </p>
        <div
          className="h-0.5 w-0 group-hover:w-8 mt-2 transition-all duration-300"
          style={{ background: accentColor }}
        />
      </div>
    </div>
  );
}
