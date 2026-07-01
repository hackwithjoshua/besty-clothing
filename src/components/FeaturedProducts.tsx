'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, 'products'), where('featured', '==', true), orderBy('createdAt', 'desc'), limit(4));
        const snap = await getDocs(q);
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
      } catch {
        try {
          const snap = await getDocs(query(collection(db, 'products'), limit(4)));
          setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="bg-cream py-20 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-3">
              Handpicked for You
            </p>
            <h2 className="font-heading font-light text-ink" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
              Featured Pieces
            </h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 text-[11px] font-body font-semibold uppercase tracking-widest text-muted hover:text-ankara-orange transition-colors group">
            View All
            <ArrowRight size={13} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="kente-bar w-20 mb-10" />

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-parchment" />
                <div className="pt-3 space-y-2">
                  <div className="h-4 bg-parchment rounded w-3/4" />
                  <div className="h-3 bg-parchment rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border-2 border-dashed border-border py-20 text-center">
            <p className="font-heading text-2xl text-ink mb-2">No Products Yet</p>
            <p className="text-sm text-muted font-body mb-5">
              Go to{' '}
              <Link href="/admin" className="text-ankara-orange underline">
                Admin Panel
              </Link>{' '}
              → Seed Sample Data to add products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <div key={p.id} className={i >= 2 ? 'hidden lg:block' : ''}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/products" className="btn-outline inline-flex items-center gap-2 group">
            View All Collections
            <ArrowRight size={13} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
