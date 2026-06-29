'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('besty_cart');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('besty_cart', JSON.stringify(items));
  }, [items]);

  function addItem(product: Product, size: string, color: string) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    toast.success(`${product.name} added to cart`);
    setIsOpen(true);
  }

  function removeItem(productId: string, size: string, color: string) {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)
      )
    );
  }

  function updateQuantity(productId: string, size: string, color: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.selectedSize === size && i.selectedColor === color
          ? { ...i, quantity }
          : i
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
