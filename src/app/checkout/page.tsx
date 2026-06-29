'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, generateOrderRef } from '@/lib/utils';
import { ShippingAddress } from '@/types';
import { Lock, ChevronRight, ShoppingBag, Check, MapPin, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

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

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara',
  'Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau',
  'Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

const STEPS = [
  { id: 'info',    label: 'Delivery', icon: MapPin },
  { id: 'payment', label: 'Payment',  icon: CreditCard },
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep]         = useState<'info' | 'payment'>('info');
  const [loading, setLoading]   = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || '',
    email:    user?.email || '',
    phone:    '',
    address:  '',
    city:     '',
    state:    '',
  });

  useEffect(() => {
    // If already loaded from a previous render, mark ready immediately
    if (window.PaystackPop) { setSdkReady(true); return; }
    const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
    if (existing) {
      existing.addEventListener('load', () => setSdkReady(true));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => toast.error('Failed to load payment SDK. Check your connection.');
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: user.displayName || prev.fullName,
        email:    user.email    || prev.email,
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-5" style={{ paddingTop: 73 }}>
        <div className="w-20 h-20 bg-parchment flex items-center justify-center">
          <ShoppingBag size={32} strokeWidth={0.8} className="text-muted" />
        </div>
        <p className="font-heading text-2xl font-light text-ink">Your bag is empty</p>
        <Link href="/products" className="btn-gold">Browse Collections</Link>
      </div>
    );
  }

  const shipping   = totalAmount >= 50000 ? 0 : 3500;
  const grandTotal = totalAmount + shipping;

  function validateAddress(): boolean {
    const required: (keyof ShippingAddress)[] = ['fullName','email','phone','address','city','state'];
    for (const field of required) {
      if (!address[field].trim()) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      toast.error('Please enter a valid email address'); return false;
    }
    if (!/^(\+?234|0)[0-9]{10}$/.test(address.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Nigerian phone number'); return false;
    }
    return true;
  }

  async function handleProceedToPayment() {
    if (!user) { toast.error('Please sign in to continue'); router.push('/auth/login'); return; }
    if (!validateAddress()) return;
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handlePaystack() {
    if (!user) return;
    if (!sdkReady || !window.PaystackPop) {
      toast.error('Payment is still loading — please wait a moment and try again.');
      return;
    }
    setLoading(true);
    const ref = generateOrderRef();
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    console.log('[Paystack] key prefix:', paystackKey?.slice(0, 10), '| amount:', grandTotal * 100, '| email:', address.email);
    if (!paystackKey || !paystackKey.startsWith('pk_')) {
      toast.error(`Paystack key invalid — must start with pk_test_ or pk_live_ (got: ${paystackKey?.slice(0, 12) ?? 'none'})`);
      setLoading(false); return;
    }
    try {
      const handler = window.PaystackPop.setup({
        key: paystackKey, email: address.email,
        amount: grandTotal * 100, currency: 'NGN', ref,
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: address.fullName },
            { display_name: 'Phone', variable_name: 'phone', value: address.phone },
          ],
        },
        callback: (response: { reference: string }) => {
          const orderItems = items.map((item) => ({
            productId: item.product.id, name: item.product.name,
            price: item.product.price, quantity: item.quantity,
            selectedSize: item.selectedSize, selectedColor: item.selectedColor,
            image: item.product.images?.[0] || '',
          }));
          addDoc(collection(db, 'orders'), {
            userId: user.uid, items: orderItems,
            totalAmount: grandTotal, status: 'confirmed',
            shippingAddress: address, paymentRef: response.reference,
            createdAt: serverTimestamp(),
          })
            .then(() => {
              // Send confirmation email (non-blocking)
              fetch('/api/send-order-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: address.email,
                  orderRef: response.reference,
                  items: orderItems,
                  total: grandTotal,
                  shipping,
                  address,
                }),
              }).catch(() => {}); // don't block checkout flow on email failure

              clearCart();
              toast.success('Order placed! Confirmation email sent.');
              router.push(`/orders?success=true&ref=${response.reference}`);
            })
            .catch(() => {
              toast.error('Payment received but order save failed. Contact support.');
            });
        },
        onClose: () => { setLoading(false); toast.error('Payment cancelled'); },
      });
      handler.openIframe();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Paystack] setup error:', msg);
      toast.error(`Payment error: ${msg}`);
      setLoading(false);
    }
  }

  const stepIndex = step === 'info' ? 0 : 1;

  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>

      {/* Kente strip */}
      <div style={{ height: 4, backgroundImage: KENTE_H }} />

      {/* Top bar */}
      <div className="bg-ink">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src="/besty-logo.png"
              alt="Besty Clothing"
              height={36}
              width={110}
              className="object-contain brightness-0 invert"
            />
          </Link>

          {/* Step progress */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const done    = i < stepIndex;
              const active  = i === stepIndex;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  {i > 0 && (
                    <div className={`w-8 h-px ${done || active ? 'bg-kente-gold' : 'bg-cream/20'}`} />
                  )}
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      done   ? 'bg-forest text-cream'
                      : active ? 'bg-kente-gold text-ink'
                      : 'bg-cream/10 text-cream/40'
                    }`}>
                      {done ? <Check size={11} strokeWidth={2.5} /> : i + 1}
                    </div>
                    <span className={`text-[11px] font-body uppercase tracking-widest hidden sm:block ${
                      active ? 'text-kente-gold' : done ? 'text-cream/60' : 'text-cream/30'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/cart" className="text-[11px] font-body uppercase tracking-widest text-cream/40 hover:text-cream/70 transition-colors">
            ← Cart
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">

          {/* ─── LEFT: FORM ─── */}
          <div>
            {step === 'info' ? (
              <div>
                {/* Section header */}
                <div className="mb-7">
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-2">
                    Step 1 of 2
                  </p>
                  <h2 className="font-heading text-3xl font-light text-ink mb-3">
                    Delivery Information
                  </h2>
                  <div className="w-14 h-1" style={{ backgroundImage: KENTE_H }} />
                </div>

                {!user && (
                  <div className="border-l-4 border-kente-gold bg-parchment px-4 py-3 mb-6">
                    <p className="text-[12px] font-body text-ink/70">
                      <Link href="/auth/login" className="text-ankara-orange font-bold underline underline-offset-2">
                        Sign in
                      </Link>{' '}
                      to autofill your details and track your order.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { field: 'fullName', label: 'Full Name',        placeholder: 'Amara Okafor',         type: 'text',  span: false },
                    { field: 'email',    label: 'Email Address',    placeholder: 'amara@example.com',     type: 'email', span: false },
                    { field: 'phone',    label: 'Phone Number',     placeholder: '+234 800 000 0000',     type: 'tel',   span: true  },
                    { field: 'address',  label: 'Delivery Address', placeholder: '12 Adeola Odeku Street',type: 'text',  span: true  },
                    { field: 'city',     label: 'City',             placeholder: 'Lagos',                 type: 'text',  span: false },
                  ].map(({ field, label, placeholder, type, span }) => (
                    <div key={field} className={span ? 'sm:col-span-2' : ''}>
                      <label className="admin-label">{label}</label>
                      <input
                        type={type}
                        value={address[field as keyof ShippingAddress]}
                        onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                        placeholder={placeholder}
                        className="form-input"
                        required
                      />
                    </div>
                  ))}

                  <div>
                    <label className="admin-label">State</label>
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Select your state</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Free shipping notice */}
                {totalAmount < 50000 && (
                  <div className="mt-5 flex items-center gap-3 border border-kente-gold/30 bg-kente-gold/5 px-4 py-3">
                    <div className="w-1 self-stretch bg-kente-gold shrink-0" />
                    <p className="text-[11px] font-body text-ink/70">
                      Add <span className="font-bold text-ink">{formatPrice(50000 - totalAmount)}</span> more to get <span className="font-bold text-forest">free shipping</span>.
                    </p>
                  </div>
                )}
                {totalAmount >= 50000 && (
                  <div className="mt-5 flex items-center gap-3 border border-forest/30 bg-forest/5 px-4 py-3">
                    <Check size={14} strokeWidth={2.5} className="text-forest shrink-0" />
                    <p className="text-[11px] font-body text-ink/70">
                      You qualify for <span className="font-bold text-forest">free shipping</span>!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleProceedToPayment}
                  className="w-full flex items-center justify-center gap-3 bg-ink text-cream hover:bg-ankara-orange py-4 mt-7 text-[11px] font-body font-bold uppercase tracking-[0.3em] transition-all duration-200"
                >
                  Continue to Payment
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-7">
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-2">
                    Step 2 of 2
                  </p>
                  <h2 className="font-heading text-3xl font-light text-ink mb-3">Payment</h2>
                  <div className="w-14 h-1" style={{ backgroundImage: KENTE_H }} />
                </div>

                {/* Delivery summary card */}
                <div className="border border-border bg-white mb-6">
                  <div style={{ height: 3, backgroundImage: KENTE_H }} />
                  <div className="p-4 space-y-2 text-[12px] font-body">
                    <div className="flex justify-between">
                      <span className="text-muted uppercase tracking-widest text-[10px] font-bold">Contact</span>
                      <span className="text-ink font-medium">{address.email}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between">
                      <span className="text-muted uppercase tracking-widest text-[10px] font-bold">Deliver to</span>
                      <span className="text-ink font-medium text-right max-w-[60%]">
                        {address.fullName} · {address.address}, {address.city}, {address.state}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <button
                      onClick={() => setStep('info')}
                      className="text-[10px] font-body font-bold uppercase tracking-widest text-ankara-orange underline underline-offset-2"
                    >
                      Edit delivery info
                    </button>
                  </div>
                </div>

                {/* Paystack block */}
                <div className="border border-border bg-white">
                  <div style={{ height: 3, backgroundImage: KENTE_H }} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-ink flex items-center justify-center shrink-0">
                        <Lock size={16} strokeWidth={1.5} className="text-kente-gold" />
                      </div>
                      <div>
                        <p className="font-body text-[13px] font-bold text-ink">Secure Payment via Paystack</p>
                        <p className="text-[11px] text-muted font-body">Card · Bank Transfer · USSD · Pay with Bank</p>
                      </div>
                    </div>

                    {/* Mini total */}
                    <div className="bg-parchment p-4 mb-6 space-y-2 text-[12px] font-body">
                      <div className="flex justify-between text-muted">
                        <span>Subtotal</span>
                        <span>{formatPrice(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-muted">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-forest font-bold' : ''}>
                          {shipping === 0 ? 'Free' : formatPrice(shipping)}
                        </span>
                      </div>
                      <div style={{ height: 2, backgroundImage: KENTE_H }} />
                      <div className="flex justify-between font-heading text-xl font-semibold text-ink pt-1">
                        <span>Total</span>
                        <span className="text-ankara-orange">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePaystack}
                      disabled={loading || !sdkReady}
                      className="w-full flex items-center justify-center gap-3 bg-kente-gold hover:bg-amber-400 text-ink py-4 text-[11px] font-body font-bold uppercase tracking-[0.3em] transition-all duration-200 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                          Processing…
                        </>
                      ) : !sdkReady ? (
                        <>
                          <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                          Loading payment…
                        </>
                      ) : (
                        <>
                          <Lock size={14} strokeWidth={2} />
                          Pay {formatPrice(grandTotal)}
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-muted text-center mt-4 font-body leading-relaxed">
                      Your payment is secured by Paystack. We accept Visa, Mastercard, Verve, bank transfer & USSD.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT: ORDER SUMMARY (dark panel) ─── */}
          <div className="lg:sticky lg:top-[85px]">
            <div className="bg-ink text-cream">
              <div style={{ height: 4, backgroundImage: KENTE_H }} />

              <div className="p-5">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-kente-gold mb-1">
                  Your Order
                </p>
                <p className="font-heading text-xl font-light text-cream mb-5">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>

                <ul className="space-y-4 mb-5">
                  {items.map((item) => (
                    <li
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-14 h-16 shrink-0 bg-cream/10 overflow-hidden">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill className="object-cover"
                            sizes="56px"
                          />
                        )}
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-kente-gold text-ink text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-body font-semibold text-cream leading-tight line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-cream/40 mt-0.5 font-body">
                          {item.selectedSize} · {item.selectedColor}
                        </p>
                      </div>
                      <p className="text-[12px] font-body font-bold text-kente-gold shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div style={{ height: 2, backgroundImage: KENTE_H }} />

                <div className="pt-4 space-y-2 text-[12px] font-body">
                  <div className="flex justify-between text-cream/50">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-cream/50">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-forest font-bold' : ''}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div style={{ height: 2, backgroundImage: KENTE_H, marginTop: 16, marginBottom: 16 }} />

                <div className="flex justify-between items-end">
                  <span className="font-heading text-lg font-light text-cream/60">Total</span>
                  <span className="font-heading text-2xl font-semibold text-kente-gold">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] text-cream/30 font-body mt-4 leading-relaxed">
                    Free shipping on orders above ₦50,000.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
