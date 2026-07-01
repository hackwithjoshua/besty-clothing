import Link from 'next/link';
import { ArrowLeft, Truck, Clock, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shipping Policy' };

const KENTE_H = `repeating-linear-gradient(90deg,#E8B820 0px,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px,#0A4030 52px,#0A4030 74px,#0C0800 74px,#0C0800 78px)`;

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>
      <div style={{ height: 4, backgroundImage: KENTE_H }} />

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-body text-muted hover:text-ink transition-colors uppercase tracking-widest mb-10">
          <ArrowLeft size={13} strokeWidth={1.5} /> Back to Store
        </Link>

        <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-2">Besty Clothing</p>
        <h1 className="font-heading text-4xl lg:text-5xl font-light text-ink mb-3">Shipping Policy</h1>
        <div style={{ height: 4, backgroundImage: KENTE_H }} className="w-16 mb-8" />
        <p className="font-body text-muted text-sm leading-relaxed mb-10">
          We take pride in delivering your Besty pieces safely and promptly across Nigeria and beyond.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On all orders over ₦50,000 within Lagos' },
            { icon: Clock, title: 'Processing Time', desc: '1–2 business days before dispatch' },
            { icon: MapPin, title: 'We Deliver To', desc: 'All 36 states across Nigeria' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-ink p-5 text-center">
              <Icon size={22} strokeWidth={1.2} className="text-kente-gold mx-auto mb-3" />
              <p className="font-heading text-cream text-lg font-light mb-1">{title}</p>
              <p className="text-xs font-body text-cream/50">{desc}</p>
            </div>
          ))}
        </div>

        {/* Delivery times */}
        <div className="border border-border bg-white p-6 mb-8">
          <h2 className="font-heading text-xl text-ink mb-5">Delivery Timeframes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted">
                  <th className="pb-3 pr-6">Location</th>
                  <th className="pb-3 pr-6">Estimated Time</th>
                  <th className="pb-3">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { loc: 'Lagos (Island & Mainland)', time: '1–2 business days', cost: 'Free over ₦50,000 / ₦2,000' },
                  { loc: 'Lagos (Outskirts)', time: '2–3 business days', cost: '₦2,500' },
                  { loc: 'Abuja', time: '2–4 business days', cost: '₦3,500' },
                  { loc: 'Port Harcourt', time: '2–4 business days', cost: '₦3,500' },
                  { loc: 'Other Cities', time: '3–6 business days', cost: '₦4,000–₦5,000' },
                  { loc: 'Remote Areas', time: '5–8 business days', cost: 'Calculated at checkout' },
                ].map((r) => (
                  <tr key={r.loc}>
                    <td className="py-3 pr-6 text-ink font-medium">{r.loc}</td>
                    <td className="py-3 pr-6 text-muted">{r.time}</td>
                    <td className="py-3 text-muted">{r.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Order Tracking',
              body: 'Once your order is dispatched, you will receive a confirmation message via email or WhatsApp with your tracking details. You can also check your order status on the My Orders page.',
            },
            {
              title: 'Packaging',
              body: 'All pieces are carefully packaged to preserve their quality during transit. Delicate fabrics like Kente and Aso-oke are wrapped in tissue and placed in protective garment bags.',
            },
            {
              title: 'Failed Delivery',
              body: 'If a delivery attempt is unsuccessful, our logistics partner will contact you to reschedule. After two failed attempts, the item will be returned to us and a re-delivery fee may apply.',
            },
            {
              title: 'Delays',
              body: 'While we strive to meet all estimated timeframes, delays may occur during public holidays, adverse weather, or peak periods. We will always notify you if there is a significant delay.',
            },
          ].map((s) => (
            <div key={s.title} className="border-l-4 border-ankara-orange bg-parchment p-5">
              <h3 className="font-heading text-lg text-ink mb-2">{s.title}</h3>
              <p className="text-sm font-body text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="text-xs font-body text-muted mt-10 text-center">
          Shipping questions? <a href="mailto:hello@bestyclothing.shop" className="text-ankara-orange hover:underline">hello@bestyclothing.shop</a> · <a href="https://wa.me/2349039456476" className="text-ankara-orange hover:underline">WhatsApp us</a>
        </p>
      </div>
    </div>
  );
}
