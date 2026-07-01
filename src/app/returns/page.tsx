import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Returns & Exchanges' };

const KENTE_H = `repeating-linear-gradient(90deg,#E8B820 0px,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px,#0A4030 52px,#0A4030 74px,#0C0800 74px,#0C0800 78px)`;

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>
      <div style={{ height: 4, backgroundImage: KENTE_H }} />

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-body text-muted hover:text-ink transition-colors uppercase tracking-widest mb-10">
          <ArrowLeft size={13} strokeWidth={1.5} /> Back to Store
        </Link>

        <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-2">Besty Clothing</p>
        <h1 className="font-heading text-4xl lg:text-5xl font-light text-ink mb-3">Returns & Exchanges</h1>
        <div style={{ height: 4, backgroundImage: KENTE_H }} className="w-16 mb-8" />
        <p className="font-body text-muted text-sm leading-relaxed mb-10">
          We want you to love every piece you receive. If something isn&apos;t right, we&apos;re here to help.
        </p>

        {/* Return window */}
        <div className="bg-ink p-6 mb-8 flex items-center gap-5">
          <div className="text-center shrink-0">
            <p className="font-heading text-5xl font-bold text-kente-gold leading-none">14</p>
            <p className="text-[10px] text-cream/50 uppercase tracking-widest font-body mt-1">Days</p>
          </div>
          <div>
            <p className="font-heading text-xl text-cream font-light">Return Window</p>
            <p className="text-sm font-body text-cream/50 mt-1">You have 14 days from the date of delivery to request a return or exchange.</p>
          </div>
        </div>

        {/* Eligible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="border border-border bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} strokeWidth={1.5} className="text-forest" />
              <h2 className="font-heading text-lg text-ink">Eligible for Return</h2>
            </div>
            <ul className="space-y-2">
              {[
                'Item received in wrong size',
                'Item received is damaged or defective',
                'Item does not match the description',
                'Unworn, unwashed with original tags attached',
                'Returned in original packaging',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm font-body text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0 mt-1.5" />{t}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={18} strokeWidth={1.5} className="text-ankara-red" />
              <h2 className="font-heading text-lg text-ink">Not Eligible</h2>
            </div>
            <ul className="space-y-2">
              {[
                'Items worn, washed or altered',
                'Items without original tags',
                'Custom or made-to-order pieces',
                'Sale or discounted items',
                'Items returned after 14 days',
                'Accessories (beads, gele, jewellery)',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm font-body text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-ankara-red shrink-0 mt-1.5" />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How to return */}
        <div className="border-l-4 border-ankara-orange bg-parchment p-6 mb-8">
          <h2 className="font-heading text-xl text-ink mb-5">How to Initiate a Return</h2>
          {[
            { step: '01', text: 'Email us at hello@bestyclothing.shop or WhatsApp +234 9039456476 within 14 days of delivery.' },
            { step: '02', text: 'Include your order reference number, item name, reason for return, and clear photos if damaged.' },
            { step: '03', text: 'We\'ll confirm eligibility within 1–2 business days and provide return instructions.' },
            { step: '04', text: 'Ship the item back to us. Return shipping costs are borne by the customer unless the item is defective.' },
            { step: '05', text: 'Once received and inspected, we\'ll process your exchange or refund within 5–7 business days.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 mb-4 last:mb-0">
              <span className="font-heading text-2xl font-bold text-ankara-orange/40 shrink-0 leading-none">{s.step}</span>
              <p className="text-sm font-body text-muted leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Refunds */}
        <div className="border border-border bg-white p-6 mb-6">
          <h2 className="font-heading text-xl text-ink mb-3">Refunds</h2>
          <p className="text-sm font-body text-muted leading-relaxed">
            Approved refunds are issued to the original payment method within 5–7 business days after we receive and inspect the returned item. Bank transfer timelines may vary depending on your financial institution.
          </p>
        </div>

        <p className="text-xs font-body text-muted text-center">
          Questions? Reach us at <a href="mailto:hello@bestyclothing.shop" className="text-ankara-orange hover:underline">hello@bestyclothing.shop</a> or <a href="https://wa.me/2349039456476" className="text-ankara-orange hover:underline">WhatsApp</a>
        </p>
      </div>
    </div>
  );
}
