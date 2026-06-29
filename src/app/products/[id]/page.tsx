'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight,
  Check, Sparkles, Scissors, Truck, RotateCcw, ZoomIn,
} from 'lucide-react';
import toast from 'react-hot-toast';

const KENTE_H = `repeating-linear-gradient(
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

const CRAFT_DETAILS = [
  { icon: Sparkles,  label: 'Fabric',      value: 'Premium authentic African textile' },
  { icon: Scissors,  label: 'Handcrafted', value: 'Skilled Nigerian artisans' },
  { icon: Truck,     label: 'Delivery',    value: '3–7 business days across Nigeria' },
  { icon: RotateCcw, label: 'Returns',     value: '14-day return policy' },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct]           = useState<Product | null>(null);
  const [loading, setLoading]           = useState(true);
  const [activeImage, setActiveImage]   = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded]               = useState(false);
  const [shakeSize, setShakeSize]       = useState(false);
  const [shakeColor, setShakeColor]     = useState(false);

  const imgRef    = useRef<HTMLDivElement>(null);
  const [zoom, setZoom]       = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
      } catch { /* noop */ } finally { setLoading(false); }
    }
    fetchProduct();
  }, [id]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setLensPos({ x: Math.min(95, Math.max(5, x)), y: Math.min(95, Math.max(5, y)) });
  }

  function shake(set: (v: boolean) => void, id: string, msg: string) {
    toast.error(msg, { duration: 2000 });
    set(true);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => set(false), 600);
  }

  function handleAddToCart() {
    if (!product) return;
    if (!selectedSize)  { shake(setShakeSize,  'size-section',  'Please select a size first'); return; }
    if (!selectedColor) { shake(setShakeColor, 'color-section', 'Please select a color / pattern'); return; }
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center" style={{ paddingTop: 73 }}>
        <div className="w-8 h-8 border-2 border-ankara-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4" style={{ paddingTop: 73 }}>
        <p className="font-heading text-3xl text-ink">Product Not Found</p>
        <Link href="/products" className="btn-outline inline-flex">Back to Collections</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [null];
  const currentImage = images[activeImage];

  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>

      {/* Kente top accent */}
      <div style={{ height: 4, backgroundImage: KENTE_H }} />

      {/* Breadcrumb + back */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-[11px] font-body text-muted uppercase tracking-widest">
          <Link href="/" className="hover:text-ankara-orange transition-colors">Home</Link>
          <span className="text-border">/</span>
          <Link href="/products" className="hover:text-ankara-orange transition-colors">Collections</Link>
          <span className="text-border">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
        <button
          onClick={() => router.back()}
          className="hidden lg:flex items-center gap-1.5 text-[11px] text-muted hover:text-ankara-orange transition-colors font-body uppercase tracking-widest"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-20 items-start">

          {/* ─── IMAGE GALLERY ─── */}
          <div className="space-y-3 lg:sticky lg:top-[85px]">

            {/* Main image with zoom loupe */}
            <div
              ref={imgRef}
              className="relative aspect-[4/5] bg-parchment overflow-hidden cursor-crosshair select-none"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              {currentImage ? (
                <>
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-top transition-transform duration-700"
                    style={{ transform: zoom ? 'scale(1.04)' : 'scale(1)' }}
                  />

                  {/* Zoom loupe — circular magnifier that follows cursor */}
                  {zoom && (
                    <div
                      className="absolute pointer-events-none z-20 rounded-full border-2 border-kente-gold shadow-[0_8px_40px_rgba(0,0,0,0.45)] overflow-hidden"
                      style={{
                        width: 190,
                        height: 190,
                        left: `calc(${lensPos.x}% - 95px)`,
                        top:  `calc(${lensPos.y}% - 95px)`,
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${currentImage})`,
                          backgroundSize: '570%',
                          backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                      {/* Crosshair */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-px h-6 bg-kente-gold/50" />
                        <div className="absolute w-6 h-px bg-kente-gold/50" />
                      </div>
                      <div className="absolute inset-0 border border-kente-gold/20 rounded-full" />
                    </div>
                  )}

                  {/* Zoom hint */}
                  {!zoom && (
                    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-ink/55 text-cream text-[10px] font-body uppercase tracking-widest px-3 py-2 backdrop-blur-sm">
                      <ZoomIn size={11} strokeWidth={1.5} />
                      Hover to zoom
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={64} strokeWidth={0.5} className="text-border" />
                </div>
              )}

              {/* Image nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-ink/65 hover:bg-ink text-cream flex items-center justify-center transition-colors z-10 backdrop-blur-sm"
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-ink/65 hover:bg-ink text-cream flex items-center justify-center transition-colors z-10 backdrop-blur-sm"
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </>
              )}

              {/* Featured badge */}
              {product.featured && (
                <div className="absolute top-4 left-4 z-10 bg-kente-gold text-ink text-[9px] font-body font-bold uppercase tracking-widest px-3 py-1.5">
                  Featured
                </div>
              )}

              {/* Bottom kente bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 z-10" style={{ backgroundImage: KENTE_H }} />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-20 bg-parchment overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === i
                        ? 'border-ankara-orange scale-105'
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    {img && <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="64px" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── PRODUCT INFO ─── */}
          <div className="lg:pt-2">

            <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-3">
              {product.category}
            </p>

            <h1 className="font-heading text-3xl lg:text-[2.6rem] font-light text-ink leading-[1.1] mb-2">
              {product.name}
            </h1>

            <div className="w-14 h-1 mb-5" style={{ backgroundImage: KENTE_H }} />

            <p className="font-heading text-2xl lg:text-3xl font-light text-ankara-orange mb-7">
              {formatPrice(product.price)}
            </p>

            {/* Story */}
            <div className="mb-7 p-5 border border-border bg-parchment/40">
              <p className="text-[9px] font-body font-bold uppercase tracking-[0.4em] text-muted mb-3">
                The Story
              </p>
              <p className="font-body text-[0.88rem] text-ink/75 leading-[1.9] italic">
                {product.description || 'This piece carries the spirit of African craftsmanship — woven with purpose, worn with pride.'}
              </p>
            </div>

            <div className="h-px bg-border mb-7" />

            {/* Size */}
            <div id="size-section" className={`mb-7 transition-all ${shakeSize ? 'animate-shake' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-ink">
                  Size
                  {!selectedSize && <span className="text-ankara-orange font-normal ml-2 normal-case tracking-normal">— choose one</span>}
                </p>
                <button className="text-[10px] text-ankara-orange font-body uppercase tracking-widest underline underline-offset-2">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-10 px-3 text-[11px] font-body font-bold uppercase tracking-wider border transition-all duration-150 ${
                      selectedSize === size
                        ? 'bg-ink text-cream border-ink'
                        : 'text-muted border-border hover:border-ink hover:text-ink'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div id="color-section" className={`mb-8 transition-all ${shakeColor ? 'animate-shake' : ''}`}>
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.35em] text-ink mb-3">
                Color / Pattern
                {!selectedColor && <span className="text-ankara-orange font-normal ml-2 normal-case tracking-normal">— choose one</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 text-[11px] font-body border transition-all duration-150 ${
                      selectedColor === color
                        ? 'bg-ink text-cream border-ink'
                        : 'text-muted border-border hover:border-ankara-orange hover:text-ankara-orange'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-3 py-[15px] text-[11px] font-body font-bold uppercase tracking-[0.3em] transition-all duration-300 ${
                added ? 'bg-forest text-cream' : 'bg-ink text-cream hover:bg-ankara-orange'
              }`}
            >
              {added
                ? <><Check size={16} strokeWidth={2.5} /> Added to Bag</>
                : <><ShoppingBag size={16} strokeWidth={1.5} /> Add to Bag</>
              }
            </button>

            <Link
              href="/checkout"
              onClick={() => { if (product && selectedSize && selectedColor) addItem(product, selectedSize, selectedColor); }}
              className="w-full flex items-center justify-center gap-3 py-[15px] text-[11px] font-body font-bold uppercase tracking-[0.3em] border border-ink text-ink hover:bg-ink hover:text-cream transition-all duration-200 mt-3"
            >
              Buy Now
            </Link>

            {/* Craft details */}
            <div className="mt-9">
              <div style={{ height: 3, backgroundImage: KENTE_H }} />
              <div className="py-6 space-y-5">
                <p className="text-[9px] font-body font-bold uppercase tracking-[0.4em] text-muted">
                  The Craft
                </p>
                {CRAFT_DETAILS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={13} strokeWidth={1.5} className="text-muted" />
                    </div>
                    <div>
                      <p className="text-[9px] font-body font-bold uppercase tracking-widest text-muted leading-none mb-1.5">
                        {label}
                      </p>
                      <p className="text-[12px] font-body text-ink leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ height: 3, backgroundImage: KENTE_H }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
