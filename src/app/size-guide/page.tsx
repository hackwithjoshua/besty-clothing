import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Size Guide' };

const KENTE_H = `repeating-linear-gradient(90deg,#E8B820 0px,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px,#0A4030 52px,#0A4030 74px,#0C0800 74px,#0C0800 78px)`;

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>
      <div style={{ height: 4, backgroundImage: KENTE_H }} />

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-body text-muted hover:text-ink transition-colors uppercase tracking-widest mb-10">
          <ArrowLeft size={13} strokeWidth={1.5} /> Back to Store
        </Link>

        <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-2">Besty Clothing</p>
        <h1 className="font-heading text-4xl lg:text-5xl font-light text-ink mb-3">Size Guide</h1>
        <div style={{ height: 4, backgroundImage: KENTE_H }} className="w-16 mb-8" />
        <p className="font-body text-muted text-sm leading-relaxed mb-10">
          All measurements are in centimetres (cm). We recommend measuring over your undergarments for the most accurate fit. If you are between sizes, we recommend sizing up.
        </p>

        {/* Women */}
        <h2 className="font-heading text-2xl font-light text-ink mb-4">Women</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="bg-ink text-cream">
                {['Size', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)', 'UK Size'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { size: 'XS', bust: '76–81', waist: '61–66', hips: '84–89', uk: '6–8' },
                { size: 'S',  bust: '84–89', waist: '66–71', hips: '91–96', uk: '8–10' },
                { size: 'M',  bust: '91–96', waist: '71–76', hips: '99–104', uk: '10–12' },
                { size: 'L',  bust: '99–104', waist: '79–84', hips: '107–112', uk: '14–16' },
                { size: 'XL', bust: '107–112', waist: '87–92', hips: '114–119', uk: '18–20' },
                { size: 'XXL', bust: '114–119', waist: '94–99', hips: '122–127', uk: '22–24' },
              ].map((row, i) => (
                <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-parchment'}>
                  <td className="px-4 py-3 font-bold text-ink">{row.size}</td>
                  <td className="px-4 py-3 text-muted">{row.bust}</td>
                  <td className="px-4 py-3 text-muted">{row.waist}</td>
                  <td className="px-4 py-3 text-muted">{row.hips}</td>
                  <td className="px-4 py-3 text-muted">{row.uk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Men */}
        <h2 className="font-heading text-2xl font-light text-ink mb-4">Men</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="bg-ink text-cream">
                {['Size', 'Chest (cm)', 'Waist (cm)', 'Shoulder (cm)'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { size: 'S',   chest: '86–91',   waist: '71–76',   shoulder: '42' },
                { size: 'M',   chest: '96–101',  waist: '81–86',   shoulder: '44' },
                { size: 'L',   chest: '106–111', waist: '91–96',   shoulder: '46' },
                { size: 'XL',  chest: '116–121', waist: '101–106', shoulder: '48' },
                { size: 'XXL', chest: '126–131', waist: '111–116', shoulder: '50' },
              ].map((row, i) => (
                <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-parchment'}>
                  <td className="px-4 py-3 font-bold text-ink">{row.size}</td>
                  <td className="px-4 py-3 text-muted">{row.chest}</td>
                  <td className="px-4 py-3 text-muted">{row.waist}</td>
                  <td className="px-4 py-3 text-muted">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to measure */}
        <div className="bg-parchment border-l-4 border-ankara-orange p-6">
          <h3 className="font-heading text-xl text-ink mb-4">How to Measure</h3>
          <ul className="space-y-3 text-sm font-body text-muted">
            <li><span className="font-semibold text-ink">Bust / Chest —</span> measure around the fullest part of your chest, keeping the tape parallel to the floor.</li>
            <li><span className="font-semibold text-ink">Waist —</span> measure around your natural waistline, the narrowest part of your torso.</li>
            <li><span className="font-semibold text-ink">Hips —</span> measure around the fullest part of your hips and seat.</li>
            <li><span className="font-semibold text-ink">Shoulder —</span> measure from the edge of one shoulder to the other across your upper back.</li>
          </ul>
        </div>

        <p className="text-xs font-body text-muted mt-8 text-center">
          Still unsure? Contact us at <a href="mailto:hello@bestyclothing.shop" className="text-ankara-orange hover:underline">hello@bestyclothing.shop</a> or WhatsApp <a href="https://wa.me/2349039456476" className="text-ankara-orange hover:underline">+234 9039456476</a>
        </p>
      </div>
    </div>
  );
}
