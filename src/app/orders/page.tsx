'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Package, CheckCircle2, ArrowRight, ShoppingBag, Clock, Truck, Star, ChevronDown } from 'lucide-react';

const STEPS = [
  { key: 'pending',    label: 'Order Placed',  icon: Clock,         desc: 'Your order has been received and is awaiting confirmation.' },
  { key: 'confirmed',  label: 'Confirmed',      icon: CheckCircle2,  desc: 'Your order has been confirmed and is being prepared.' },
  { key: 'processing', label: 'Processing',     icon: Package,       desc: 'Your items are being carefully packaged.' },
  { key: 'shipped',    label: 'Dispatched',     icon: Truck,         desc: 'Your order is on its way to you!' },
  { key: 'delivered',  label: 'Delivered',      icon: Star,          desc: 'Your order has been delivered. Enjoy your Besty piece!' },
] as const;

type StatusKey = typeof STEPS[number]['key'];

const STATUS_COLORS: Record<StatusKey, string> = {
  pending:    'bg-amber-100 text-amber-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-orange-100 text-orange-800',
  delivered:  'bg-green-100 text-green-800',
};

function StatusTracker({ status }: { status: string }) {
  const currentIndex = STEPS.findIndex(s => s.key === status);
  const idx = currentIndex === -1 ? 0 : currentIndex;
  const currentStep = STEPS[idx];
  const Icon = currentStep.icon;

  return (
    <div className="px-5 py-5 bg-parchment">
      {/* Current status message */}
      <div className="flex items-start gap-3 mb-5 p-3 bg-white border border-border">
        <div className="w-8 h-8 bg-ink rounded-full flex items-center justify-center shrink-0">
          <Icon size={14} strokeWidth={2} className="text-kente-gold" />
        </div>
        <div>
          <p className="text-xs font-body font-bold text-ink uppercase tracking-wider">{currentStep.label}</p>
          <p className="text-xs font-body text-muted mt-0.5">{currentStep.desc}</p>
        </div>
      </div>

      {/* Step timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" />
        <div
          className="absolute left-3.5 top-0 w-px bg-kente-gold transition-all duration-700"
          style={{ height: `${(idx / (STEPS.length - 1)) * 100}%` }}
        />

        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const done = i <= idx;
            const active = i === idx;
            return (
              <div key={step.key} className="flex items-center gap-3 relative">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all duration-500 ${
                  done ? 'bg-ink border-ink' : 'bg-cream border-border'
                }`}>
                  <StepIcon size={12} strokeWidth={done ? 2.5 : 1.5} className={done ? 'text-kente-gold' : 'text-muted'} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-body font-bold uppercase tracking-wide ${active ? 'text-ink' : done ? 'text-ink/70' : 'text-muted'}`}>
                    {step.label}
                    {active && <span className="ml-2 text-[9px] text-ankara-orange normal-case tracking-normal font-normal">— Current</span>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const statusKey = (order.status || 'pending') as StatusKey;
  const statusColor = STATUS_COLORS[statusKey] || STATUS_COLORS.pending;
  const statusLabel = STEPS.find(s => s.key === statusKey)?.label || 'Order Placed';
  const orderDate = order.createdAt
    ? new Date((order.createdAt as unknown as { seconds: number }).seconds * 1000)
    : new Date();

  return (
    <div className="bg-white border border-border overflow-hidden">
      {/* Order header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest font-body">Order</p>
            <p className="text-xs font-mono font-semibold text-ink">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-[10px] text-muted uppercase tracking-widest font-body">Date</p>
            <p className="text-xs font-semibold text-ink font-body">
              {orderDate.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="hidden sm:block">
            <p className="text-[10px] text-muted uppercase tracking-widest font-body">Total</p>
            <p className="text-xs font-semibold text-ankara-orange font-body">{formatPrice(order.totalAmount)}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full font-body ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Items */}
      <div className="p-5">
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="relative w-12 h-14 shrink-0 bg-parchment overflow-hidden">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink font-body leading-tight">{item.name}</p>
                <p className="text-xs text-muted font-body mt-0.5">
                  {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink font-body shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {order.shippingAddress && (
          <div className="mt-4 pt-4 border-t border-border text-xs font-body text-muted">
            <span className="font-semibold text-ink uppercase tracking-wide">Delivering to: </span>
            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.state} — {order.shippingAddress.phone}
          </div>
        )}
      </div>

      {/* Track Status toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 border-t-2 border-kente-gold bg-ink hover:bg-ink/90 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Truck size={14} strokeWidth={1.5} className="text-kente-gold" />
          <span className="text-[11px] font-body font-bold uppercase tracking-widest text-cream">Track Your Order</span>
        </div>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`text-kente-gold transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible tracker */}
      {open && <StatusTracker status={statusKey} />}
    </div>
  );
}

function OrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const successRef = searchParams.get('ref');

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q,
      (snap) => {
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
        setLoading(false);
      },
      () => {
        const q2 = query(collection(db, 'orders'), where('userId', '==', user.uid));
        onSnapshot(q2, (snap) => {
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
          setLoading(false);
        });
      }
    );

    return () => unsub();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center" style={{ paddingTop: 73 }}>
        <div className="w-8 h-8 border-2 border-ankara-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 text-center px-5" style={{ paddingTop: 73 }}>
        <Package size={48} strokeWidth={0.8} className="text-muted" />
        <div>
          <h1 className="font-heading text-3xl text-ink mb-2">Track Your Orders</h1>
          <p className="text-muted font-body text-sm">Sign in to view your order history</p>
        </div>
        <Link href="/auth/login" className="btn-primary inline-flex">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>
      {isSuccess && (
        <div className="bg-forest text-cream px-5 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <CheckCircle2 size={20} strokeWidth={1.5} />
            <div>
              <p className="font-body text-sm font-semibold">Order placed successfully!</p>
              {successRef && <p className="text-xs text-cream/70 mt-0.5 font-body">Reference: {successRef}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-body font-medium uppercase tracking-[0.3em] text-ankara-orange mb-2">
              {user.displayName || user.email}
            </p>
            <h1 className="font-heading text-3xl lg:text-4xl font-light text-ink">My Orders</h1>
            <div className="kente-bar w-12 mt-3" />
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors font-body uppercase tracking-wide group">
            Shop More
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border">
            <ShoppingBag size={40} strokeWidth={0.8} className="text-muted mx-auto mb-4" />
            <p className="font-heading text-2xl text-ink mb-2">No Orders Yet</p>
            <p className="text-muted text-sm font-body mb-6">Your order history will appear here once you make a purchase.</p>
            <Link href="/products" className="btn-primary inline-flex">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center" style={{ paddingTop: 73 }}>
        <div className="w-8 h-8 border-2 border-ankara-orange border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
