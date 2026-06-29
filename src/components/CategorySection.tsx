import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    label: 'Dresses',
    slug: 'dress',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=85',
    sub: 'Ankara · Kente · Aso-oke',
    color: '#D44820',
  },
  {
    label: 'Tops',
    slug: 'top',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=85',
    sub: 'Peplum · Dashiki · Lace',
    color: '#0A4030',
  },
  {
    label: 'Suits',
    slug: 'suit',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=85',
    sub: 'Senator · Agbada · Buba',
    color: '#1B2B7A',
  },
  {
    label: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85',
    sub: 'Beads · Gele · Coral',
    color: '#E8B820',
  },
];

export default function CategorySection() {
  return (
    <section className="bg-ink py-16 px-0">
      {/* Section header */}
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
        {/* Kente divider */}
        <div className="kente-bar mt-5 w-20" />
      </div>

      {/* Grid */}
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

                {/* Color accent bar on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: cat.color }}
                />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 z-10">
                  <p className="text-[9px] text-cream/50 uppercase tracking-widest font-body mb-1">{cat.sub}</p>
                  <h3
                    className="font-heading font-semibold text-cream leading-none"
                    style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}
                  >
                    {cat.label}
                  </h3>
                  {/* Mini kente strip */}
                  <div className="mt-2 kente-strip w-10 opacity-70" />
                </div>

                {/* Left accent */}
                <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: cat.color }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="kente-bar mt-14" />
    </section>
  );
}
