import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Care Instructions' };

const KENTE_H = `repeating-linear-gradient(90deg,#E8B820 0px,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px,#0A4030 52px,#0A4030 74px,#0C0800 74px,#0C0800 78px)`;

const sections = [
  {
    title: 'Ankara & Printed Fabrics',
    tips: [
      'Hand wash in cold water (below 30°C) with a mild detergent.',
      'Do not soak for extended periods — this may cause colours to bleed.',
      'Turn inside out before washing to preserve the print vibrancy.',
      'Do not wring — gently squeeze out excess water.',
      'Dry flat in shade away from direct sunlight.',
      'Iron on medium heat on the reverse side only.',
    ],
  },
  {
    title: 'Kente Cloth',
    tips: [
      'Dry clean only — Kente is hand-woven and extremely delicate.',
      'Store flat or loosely rolled, never folded tightly along weave lines.',
      'Keep away from moisture and humidity.',
      'Do not iron directly — use a pressing cloth on low heat.',
      'Handle with clean hands; oils and dirt can stain the silk threads.',
    ],
  },
  {
    title: 'Aso-oke',
    tips: [
      'Dry clean is strongly recommended for all Aso-oke pieces.',
      'If hand washing, use cold water and very mild soap — rinse thoroughly.',
      'Lay flat to dry, reshaping while damp.',
      'Iron on the reverse side at low-to-medium heat.',
      'Store in a breathable fabric bag away from direct light.',
    ],
  },
  {
    title: 'Adire (Tie-Dye)',
    tips: [
      'Wash separately the first 2–3 times as excess dye may bleed.',
      'Cold hand wash only — hot water sets unwanted stains and fades the pattern.',
      'Use a colour-safe detergent.',
      'Do not bleach under any circumstances.',
      'Dry in shade — sunlight fades the indigo dye over time.',
    ],
  },
  {
    title: 'Lace Fabrics',
    tips: [
      'Hand wash gently in lukewarm water with a delicate fabric cleanser.',
      'Do not scrub or rub — pat gently to clean.',
      'Lay flat on a towel to dry; do not tumble dry.',
      'Iron on very low heat using a pressing cloth.',
      'Store folded in tissue paper to prevent snagging.',
    ],
  },
  {
    title: 'George Fabric',
    tips: [
      'Dry clean is preferred for structured George pieces.',
      'For light hand washing, use cold water and mild soap.',
      'Iron on low heat on the reverse side.',
      'Store hanging or loosely rolled to prevent creasing.',
    ],
  },
];

export default function CareInstructionsPage() {
  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>
      <div style={{ height: 4, backgroundImage: KENTE_H }} />

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-body text-muted hover:text-ink transition-colors uppercase tracking-widest mb-10">
          <ArrowLeft size={13} strokeWidth={1.5} /> Back to Store
        </Link>

        <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-2">Besty Clothing</p>
        <h1 className="font-heading text-4xl lg:text-5xl font-light text-ink mb-3">Care Instructions</h1>
        <div style={{ height: 4, backgroundImage: KENTE_H }} className="w-16 mb-8" />
        <p className="font-body text-muted text-sm leading-relaxed mb-10">
          Each fabric in our collection carries generations of craft. Proper care ensures your piece stays vibrant and beautiful for years to come.
        </p>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="border border-border bg-white p-6">
              <h2 className="font-heading text-xl text-ink mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-ankara-orange inline-block shrink-0" />
                {s.title}
              </h2>
              <ul className="space-y-2">
                {s.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-body text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-kente-gold shrink-0 mt-1.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-ink p-6 text-center">
          <p className="text-cream/60 text-sm font-body">Have a question about caring for your Besty piece?</p>
          <a href="mailto:hello@bestyclothing.shop" className="text-kente-gold font-body text-sm hover:underline">hello@bestyclothing.shop</a>
        </div>
      </div>
    </div>
  );
}
