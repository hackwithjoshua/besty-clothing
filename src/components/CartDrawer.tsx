'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems, isOpen, setIsOpen } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-cream z-50 flex flex-col shadow-2xl transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Kente top */}
        <div className="kente-bar" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag size={19} strokeWidth={1.5} className="text-ankara-orange" />
            <h2 className="font-heading text-xl font-semibold text-ink">Your Cart</h2>
            {totalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-ankara-orange text-cream text-[10px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-muted hover:text-ink transition-colors">
            <X size={19} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-6 text-center">
              <div className="w-20 h-20 bg-parchment flex items-center justify-center">
                <ShoppingBag size={30} strokeWidth={0.8} className="text-muted-light" />
              </div>
              <div>
                <p className="font-heading text-xl text-ink">Your cart is empty</p>
                <p className="text-sm text-muted font-body mt-1">Discover beautiful African fashion</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn-primary">
                Browse Collections
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-4 p-5"
                >
                  <div className="relative w-20 h-24 shrink-0 bg-parchment overflow-hidden">
                    {item.product.images?.[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-base font-semibold text-ink line-clamp-2 leading-tight">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted font-body">
                      <span>{item.selectedSize}</span>
                      <span>·</span>
                      <span>{item.selectedColor}</span>
                    </div>
                    <p className="text-sm font-bold text-ankara-orange mt-1 font-body">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink">
                          <Minus size={11} strokeWidth={2} />
                        </button>
                        <span className="w-7 text-center text-sm font-medium text-ink font-body">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink">
                          <Plus size={11} strokeWidth={2} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)} className="p-1 text-muted-light hover:text-ankara-red transition-colors">
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="kente-bar" />
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-body font-bold uppercase tracking-widest text-muted">Subtotal</span>
              <span className="font-heading text-2xl font-bold text-ink">{formatPrice(totalAmount)}</span>
            </div>
            <p className="text-[11px] text-muted font-body">Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="btn-gold w-full text-center block">
              Checkout Now
            </Link>
            <Link href="/cart" onClick={() => setIsOpen(false)} className="btn-outline w-full text-center block">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
