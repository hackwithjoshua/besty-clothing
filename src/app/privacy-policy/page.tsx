import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

const KENTE_H = `repeating-linear-gradient(90deg,#E8B820 0px,#E8B820 22px,#0C0800 22px,#0C0800 26px,#D44820 26px,#D44820 48px,#0C0800 48px,#0C0800 52px,#0A4030 52px,#0A4030 74px,#0C0800 74px,#0C0800 78px)`;

const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'When you create an account, we collect your name, email address, and password (encrypted).',
      'When you place an order, we collect your delivery address, phone number, and payment reference (we do not store card details — all payments are processed securely by Paystack).',
      'We may collect usage data such as pages visited and time spent on the site to improve your experience.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'To process and fulfil your orders.',
      'To send you order confirmation and delivery updates via email.',
      'To respond to your enquiries and customer service requests.',
      'To improve our website, products, and services.',
      'To send you promotional updates if you have opted in (you can unsubscribe at any time).',
    ],
  },
  {
    title: '3. How We Share Your Information',
    body: [
      'We do not sell, trade, or rent your personal information to third parties.',
      'We share order and delivery details with our logistics partners solely to fulfil your delivery.',
      'We use Paystack to process payments — your payment data is governed by Paystack\'s privacy policy.',
      'We may disclose information if required by law or to protect our rights.',
    ],
  },
  {
    title: '4. Data Security',
    body: [
      'Your data is stored securely on Google Firebase servers with industry-standard encryption.',
      'All data transmitted to and from our website is encrypted via HTTPS/SSL.',
      'We restrict access to your personal data to authorised personnel only.',
      'In the unlikely event of a data breach, we will notify you promptly.',
    ],
  },
  {
    title: '5. Cookies',
    body: [
      'Our website uses cookies to maintain your session and remember your cart.',
      'We use analytics cookies (anonymous) to understand how visitors use our site.',
      'You can disable cookies in your browser settings, though some features may not work correctly.',
    ],
  },
  {
    title: '6. Your Rights',
    body: [
      'You have the right to access the personal data we hold about you.',
      'You may request correction or deletion of your personal data at any time.',
      'You may withdraw consent for marketing communications at any time.',
      'To exercise any of these rights, contact us at hello@bestyclothing.shop.',
    ],
  },
  {
    title: '7. Children\'s Privacy',
    body: [
      'Our services are not directed to children under the age of 13.',
      'We do not knowingly collect personal information from children.',
      'If you believe we have inadvertently collected such information, please contact us immediately.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time.',
      'We will notify you of significant changes by posting the new policy on this page with an updated date.',
      'Continued use of our services after changes constitutes acceptance of the revised policy.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>
      <div style={{ height: 4, backgroundImage: KENTE_H }} />

      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-body text-muted hover:text-ink transition-colors uppercase tracking-widest mb-10">
          <ArrowLeft size={13} strokeWidth={1.5} /> Back to Store
        </Link>

        <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-2">Besty Clothing</p>
        <h1 className="font-heading text-4xl lg:text-5xl font-light text-ink mb-3">Privacy Policy</h1>
        <div style={{ height: 4, backgroundImage: KENTE_H }} className="w-16 mb-3" />
        <p className="text-xs font-body text-muted mb-8">Last updated: June 2026</p>

        <p className="font-body text-muted text-sm leading-relaxed mb-10">
          Besty Clothing (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal information and your right to privacy. This policy explains what information we collect, how we use it, and your rights regarding your data.
        </p>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="border border-border bg-white p-6">
              <h2 className="font-heading text-lg text-ink mb-4">{s.title}</h2>
              <ul className="space-y-2">
                {s.body.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-body text-muted leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-ankara-orange shrink-0 mt-1.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-ink p-6 text-center">
          <p className="text-cream/60 text-sm font-body mb-1">Privacy concerns or requests?</p>
          <a href="mailto:hello@bestyclothing.shop" className="text-kente-gold font-body text-sm hover:underline">hello@bestyclothing.shop</a>
          <p className="text-cream/30 text-xs font-body mt-3">Besty Clothing · Lagos, Nigeria</p>
        </div>
      </div>
    </div>
  );
}
