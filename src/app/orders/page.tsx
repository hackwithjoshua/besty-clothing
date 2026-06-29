'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Package, CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'status-pending' },
  confirmed: { label: 'Confirmed', className: 'status-confirmed' },
  processing: { label: 'Processing', className: 'status-processing' },
  shipped: { label: 'Shipped', className: 'status-shipped' },
  delivered: { label: 'Delivered', className: 'status-delivered' },
};

function OrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const successRef = searchParams.get('ref');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    async function fetchOrders() {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user!.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
      } catch {
        try {
          const q2 = query(collection(db, 'orders'), where('userId', '==', user!.uid));
          const snap2 = await getDocs(q2);
          setOrders(snap2.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex flex-col items-center justify-center gap-4 text-center px-5">
        <Package size={48} strokeWidth={0.8} className="text-brown-light" />
        <div>
          <h1 className="font-heading text-3xl text-deep-brown mb-2">Track Your Orders</h1>
          <p className="text-brown-light font-body text-sm">Sign in to view your order history</p>
        </div>
        <Link href="/auth/login" className="btn-primary inline-flex">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>
      {/* Success banner */}
      {isSuccess && (
        <div className="bg-forest text-cream px-5 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <CheckCircle2 size={20} strokeWidth={1.5} />
            <div>
              <p className="font-body text-sm font-semibold">Order placed successfully! 🎉</p>
              {successRef && (
                <p className="text-xs text-cream/70 mt-0.5 font-body">
                  Reference: {successRef}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-body font-medium uppercase tracking-[0.3em] text-terracotta mb-2">
              {user.displayName || 'My Account'}
            </p>
            <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-deep-brown">
              My Orders
            </h1>
            <div className="ankara-divider w-12 mt-3" />
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 text-sm text-brown hover:text-terracotta transition-colors font-body uppercase tracking-wide group">
            Shop More
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border">
            <ShoppingBag size={40} strokeWidth={0.8} className="text-brown-light mx-auto mb-4" />
            <p className="font-heading text-2xl text-deep-brown mb-2">No Orders Yet</p>
            <p className="text-brown-light text-sm font-body mb-6">
              Your order history will appear here once you make a purchase.
            </p>
            <Link href="/products" className="btn-primary inline-flex">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const orderDate = order.createdAt
                ? new Date((order.createdAt as unknown as { seconds: number }).seconds * 1000)
                : new Date();

              return (
                <div key={order.id} className="bg-white border border-border">
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[10px] text-brown-light uppercase tracking-widest font-body">Order</p>
                        <p className="text-xs font-mono font-semibold text-deep-brown">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div>
                        <p className="text-[10px] text-brown-light uppercase tracking-widest font-body">Date</p>
                        <p className="text-xs font-semibold text-deep-brown font-body">
                          {orderDate.toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-border hidden sm:block" />
                      <div className="hidden sm:block">
                        <p className="text-[10px] text-brown-light uppercase tracking-widest font-body">Total</p>
                        <p className="text-xs font-semibold text-terracotta font-body">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 ${status.className} font-body`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="p-5">
                    <div className="space-y-3">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="relative w-12 h-14 shrink-0 bg-cream-dark overflow-hidden">
                            {item.image && (
                              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-deep-brown font-body leading-tight">
                              {item.name}
                            </p>
                            <p className="text-xs text-brown-light font-body mt-0.5">
                              {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-deep-brown font-body shrink-0">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {order.shippingAddress && (
                      <div className="mt-4 pt-4 border-t border-border text-xs font-body text-brown-light">
                        <span className="font-semibold text-brown uppercase tracking-wide">Delivering to: </span>
                        {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state} — {order.shippingAddress.phone}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
