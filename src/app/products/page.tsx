'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'dress', label: 'Dresses' },
  { value: 'top', label: 'Tops' },
  { value: 'skirt', label: 'Skirts' },
  { value: 'wrapper', label: 'Wrappers' },
  { value: 'suit', label: 'Suits' },
  { value: 'accessories', label: 'Accessories' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let q;
        if (activeCategory) {
          q = query(
            collection(db, 'products'),
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc')
          );
        } else {
          q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        }
        const snap = await getDocs(q);
        let data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));

        if (sortBy === 'price-asc') data = data.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') data = data.sort((a, b) => b.price - a.price);

        setProducts(data);
      } catch {
        try {
          const snap = await getDocs(collection(db, 'products'));
          let data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
          if (activeCategory) data = data.filter((p) => p.category === activeCategory);
          setProducts(data);
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Page header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
          <p className="text-xs font-body font-medium uppercase tracking-[0.3em] text-terracotta mb-2">
            Besty Clothing
          </p>
          <h1 className="font-heading text-4xl lg:text-5xl font-light text-deep-brown">
            {activeCategory
              ? CATEGORIES.find((c) => c.value === activeCategory)?.label || 'Collections'
              : 'All Collections'}
          </h1>
          <div className="ankara-divider w-16 mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`shrink-0 px-4 py-2 text-xs font-medium uppercase tracking-wider font-body transition-colors ${
                  activeCategory === cat.value
                    ? 'bg-deep-brown text-cream'
                    : 'text-brown-light hover:text-deep-brown border border-transparent hover:border-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort + filter count */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:block text-xs text-brown-light font-body">
              {loading ? '—' : `${products.length} items`}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-body border border-border bg-white px-3 py-2 text-deep-brown focus:outline-none focus:border-terracotta cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter badge */}
        {activeCategory && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-brown-light font-body">Filtered by:</span>
            <button
              onClick={() => setActiveCategory('')}
              className="flex items-center gap-1.5 bg-deep-brown text-cream text-xs px-3 py-1.5 hover:bg-terracotta transition-colors font-body"
            >
              {CATEGORIES.find((c) => c.value === activeCategory)?.label}
              <X size={11} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-cream-dark" />
                <div className="pt-3 space-y-2">
                  <div className="h-4 bg-cream-dark rounded w-3/4" />
                  <div className="h-3 bg-cream-dark rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-3xl text-deep-brown mb-3">No Products Found</p>
            <p className="text-brown-light font-body text-sm mb-6">
              {activeCategory
                ? `No ${activeCategory}s available yet.`
                : 'No products have been added yet.'}
            </p>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory('')}
                className="btn-outline inline-flex"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
