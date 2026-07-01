import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewsletterForm from '@/components/NewsletterForm';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Trust strip */}
      <div className="bg-cream-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { icon: Truck, label: 'Free Delivery', sub: 'Orders over ₦50,000' },
              { icon: ShieldCheck, label: 'Secured by Paystack', sub: 'Card · Bank · USSD' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '14-day policy' },
              { icon: Headphones, label: '24/7 Support', sub: 'Always here for you' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-ink flex items-center justify-center shrink-0">
                  <Icon size={16} strokeWidth={1.5} className="text-kente-gold" />
                </div>
                <div>
                  <p className="text-[11px] font-body font-bold text-ink uppercase tracking-wide">{label}</p>
                  <p className="text-[10px] text-muted font-body">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategorySection />

      <FeaturedProducts />

      {/* ================================
          CRAFTSMANSHIP SECTION
          ================================ */}
      <section className="relative overflow-hidden">
        {/* Mud cloth / bogolan background */}
        <div className="absolute inset-0 mudcloth" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#C8A878]/60 to-[#C8A878]/80" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Video */}
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    src="https://res.cloudinary.com/dfpf4deqc/video/upload/q_auto:low,f_mp4,vc_h264,w_800/v1782781062/IMG_8667_jbrujv.mp4"
                    type="video/mp4"
                  />
                </video>
                {/* Kente frame accent */}
                <div className="absolute top-0 left-0 right-0 h-2 kente-bar" />
                <div className="absolute bottom-0 left-0 right-0 h-2 kente-bar" />
              </div>
              {/* Floating caption */}
              <div className="absolute -bottom-5 -right-4 lg:-right-8 bg-ink px-5 py-4">
                <p className="text-[9px] text-kente-gold font-body font-bold uppercase tracking-widest">Est.</p>
                <p className="font-heading text-cream text-3xl font-bold leading-none">2019</p>
                <p className="text-[9px] text-cream/50 font-body uppercase tracking-widest mt-1">Lagos, Nigeria</p>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ink/60 mb-4">
                The Besty Story
              </p>
              <h2 className="font-heading font-light text-ink leading-[1.05] mb-5" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
                Where African Heritage Meets Modern{' '}
                <span className="italic text-ankara-orange">Elegance</span>
              </h2>
              <div className="kente-bar w-16 mb-6" />
              <p className="font-body text-ink/70 leading-relaxed mb-4 text-[0.95rem]">
                Every piece in our collection begins as a conversation with tradition. Our artisans —
                weavers in Kente, dyers of Adire, embroiderers of Aso-oke — carry skills passed down
                through generations, from grandmother to granddaughter, master to apprentice.
              </p>
              <p className="font-body text-ink/70 leading-relaxed mb-8 text-[0.95rem]">
                At Besty Clothing, we don't just sell fabric. We preserve culture, celebrate identity,
                and dress you in the confidence of your African heritage.
              </p>

              {/* Values */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Kente', sub: 'Hand-woven in West Africa' },
                  { title: 'Ankara', sub: 'Bold print, bold identity' },
                  { title: 'Aso-oke', sub: 'Yoruba ceremonial weave' },
                  { title: 'Adire', sub: 'Indigo-dyed tradition' },
                  { title: 'Lace', sub: 'Elegance for every occasion' },
                  { title: 'Wedding', sub: 'Bridal African splendour' },
                ].map((v) => (
                  <div key={v.title} className="flex items-start gap-3">
                    <div className="w-1 h-8 bg-ankara-orange shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-body font-bold text-ink">{v.title}</p>
                      <p className="text-[11px] text-muted font-body">{v.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/products" className="btn-primary inline-flex items-center gap-2 group">
                Explore Collection
                <ArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================
          KENTE QUOTE SECTION
          ================================ */}
      <section className="relative overflow-hidden bg-ink py-20 lg:py-28">
        {/* Kente weave as decorative side panels */}
        <div className="absolute top-0 left-0 bottom-0 w-8 lg:w-16 kente-weave opacity-40" />
        <div className="absolute top-0 right-0 bottom-0 w-8 lg:w-16 kente-weave opacity-40" />

        <div className="relative max-w-3xl mx-auto px-12 lg:px-8 text-center">
          <div className="kente-bar w-16 mx-auto mb-8" />
          <p className="text-kente-gold font-heading font-light italic leading-snug mb-6" style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}>
            "When you put on your culture, you wear your power."
          </p>
          <div className="h-px w-12 bg-kente-gold/40 mx-auto mb-4" />
          <p className="text-cream/40 text-[11px] font-body uppercase tracking-[0.3em]">
            Besty Clothing — Lagos, Nigeria
          </p>
          <div className="kente-bar w-16 mx-auto mt-8" />
        </div>
      </section>

      {/* ================================
          ADIRE / FEATURED FABRIC SECTION
          ================================ */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Adire blue background */}
        <div className="absolute inset-0 adire-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-adire/80" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-10 text-center">
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-kente-gold mb-4">
            Our Fabric Heritage
          </p>
          <h2 className="font-heading font-light text-cream mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Six Fabrics. One Identity.
          </h2>
          <div className="kente-bar w-16 mx-auto mt-4 mb-10" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Ankara', origin: 'West Africa', color: '#D44820' },
              { name: 'Kente', origin: 'Ghana / Yoruba', color: '#E8B820' },
              { name: 'Aso-oke', origin: 'Yorubaland', color: '#B82010' },
              { name: 'Adire', origin: 'Ogun State', color: '#1B2B7A' },
              { name: 'George', origin: 'Niger Delta', color: '#0A4030' },
              { name: 'Isi-agu', origin: 'Igboland', color: '#8B2010' },
              { name: 'Lace', origin: 'West Africa', color: '#C9A227' },
              { name: 'Wedding', origin: 'West Africa', color: '#7A2060' },
            ].map((fab) => (
              <div key={fab.name} className="group">
                <div
                  className="h-2 mb-3 group-hover:h-4 transition-all duration-300"
                  style={{ background: fab.color }}
                />
                <p className="font-heading text-cream text-lg font-semibold">{fab.name}</p>
                <p className="text-[10px] font-body text-cream/40 uppercase tracking-wide mt-0.5">{fab.origin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================
          NEWSLETTER
          ================================ */}
      <section className="relative overflow-hidden bg-cream-dark py-16 px-5">
        <div className="kente-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div className="max-w-xl mx-auto text-center pt-6">
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-3">
            Join the Family
          </p>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-ink mb-3">
            Stay in Style
          </h2>
          <p className="font-body text-sm text-muted mb-7 leading-relaxed">
            Get early access to new collections, festival lookbooks, and exclusive offers.
            No spam — only culture.
          </p>
          <NewsletterForm />
        </div>
        <div className="kente-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </section>
    </>
  );
}
