'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex flex-col items-center justify-center gap-6 px-5 text-center">
        <div className="w-24 h-24 rounded-full bg-cream-dark flex items-center justify-center">
          <ShoppingBag size={40} strokeWidth={0.8} className="text-brown-light" />
        </div>
        <div>
          <h1 className="font-heading text-3xl text-deep-brown mb-2">Your Cart is Empty</h1>
          <p className="text-brown-light font-body text-sm">Discover beautiful African fashion pieces</p>
        </div>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2">
          Browse Collections
          <ArrowRight size={15} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const shipping = totalAmount >= 50000 ? 0 : 3500;

  return (
    <div className="min-h-screen bg-cream pt-16 lg:pt-[72px]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs text-brown-light hover:text-terracotta transition-colors font-body uppercase tracking-wide"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Continue Shopping
          </Link>
          <div className="h-px flex-1 bg-border" />
          <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-deep-brown">
            Shopping Cart
            <span className="text-brown-light font-light ml-2 text-xl">({totalItems})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-3 border-b border-border text-[10px] font-body uppercase tracking-widest text-brown-light">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Price</span>
              <span />
            </div>

            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="py-6 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center"
                >
                  {/* Product */}
                  <div className="flex gap-4">
                    <div className="relative w-20 h-24 shrink-0 bg-cream-dark overflow-hidden">
                      {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-heading text-base font-semibold text-deep-brown hover:text-terracotta transition-colors line-clamp-2 leading-tight"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-brown-light font-body">
                        <span>Size: <b className="text-brown">{item.selectedSize}</b></span>
                        <span>·</span>
                        <span>Color: <b className="text-brown">{item.selectedColor}</b></span>
                      </div>
                      <p className="text-sm font-semibold text-terracotta mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-brown hover:text-deep-brown transition-colors"
                      >
                        <Minus size={13} strokeWidth={2} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-deep-brown font-body">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-brown hover:text-deep-brown transition-colors"
                      >
                        <Plus size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <p className="text-right font-heading text-base font-semibold text-deep-brown hidden sm:block">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                    className="p-1 text-brown-light hover:text-ankara transition-colors ml-auto sm:ml-0"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border p-6 sticky top-24">
              <h2 className="font-heading text-xl font-semibold text-deep-brown mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 text-sm font-body">
                <div className="flex justify-between text-brown">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-deep-brown font-medium">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-brown">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-forest font-medium' : 'text-deep-brown font-medium'}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-brown-light">
                    Add {formatPrice(50000 - totalAmount)} more for free shipping
                  </p>
                )}
              </div>

              <div className="h-px bg-border mb-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-body text-sm font-semibold uppercase tracking-wide text-deep-brown">
                  Total
                </span>
                <span className="font-heading text-2xl font-bold text-deep-brown">
                  {formatPrice(totalAmount + shipping)}
                </span>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brown-light font-body">
                <span>🔒</span>
                <span>Secured by Paystack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
