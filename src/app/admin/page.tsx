'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  serverTimestamp, orderBy, query, getDoc, updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import {
  Plus, Trash2, Package, UploadCloud, Loader2, ShieldOff,
  Pencil, X, Image as ImageIcon, ShoppingBag, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { seedProducts } from '@/lib/seedProducts';

const CATEGORIES = ['dress', 'top', 'skirt', 'wrapper', 'suit', 'accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const IMAGE_LABELS = ['Front View', 'Back View', 'Detail Shot', 'Full Look', 'Close-up', 'Side View'];

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: 'Pending',    className: 'status-pending' },
  confirmed:  { label: 'Confirmed',  className: 'status-confirmed' },
  processing: { label: 'Processing', className: 'status-processing' },
  shipped:    { label: 'Shipped',    className: 'status-shipped' },
  delivered:  { label: 'Delivered',  className: 'status-delivered' },
};

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image?: string;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
  };
  paystackRef?: string;
  createdAt?: { seconds: number };
}

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'dress',
  sizes: [] as string[],
  colors: '',
  images: [''] as string[],
  inStock: true,
  featured: false,
};

type AccessState = 'checking' | 'denied' | 'granted';
type Tab = 'products' | 'orders';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [access, setAccess]       = useState<AccessState>('checking');
  const [countdown, setCountdown] = useState(5);
  const [tab, setTab]             = useState<Tab>('products');

  // products
  const [products, setProducts]   = useState<Product[]>([]);
  const [form, setForm]           = useState(emptyForm);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [seeding, setSeeding]     = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // orders
  const [orders, setOrders]           = useState<Order[]>([]);
  const [ordersFetching, setOrdersFetching] = useState(false);
  const [ordersFetched, setOrdersFetched]   = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!showForm) return;
    const t = setTimeout(() => {
      if (!formRef.current) return;
      const top = formRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(t);
  }, [showForm]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/auth/login?next=/admin'); return; }
    async function checkAdmin() {
      try {
        const snap = await getDoc(doc(db, 'admins', user!.email!));
        setAccess(snap.exists() ? 'granted' : 'denied');
      } catch { setAccess('denied'); }
    }
    checkAdmin();
  }, [user, authLoading]);

  useEffect(() => {
    if (access !== 'denied') return;
    if (countdown <= 0) { router.replace('/'); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [access, countdown, router]);

  useEffect(() => { if (access === 'granted') fetchProducts(); }, [access]);

  useEffect(() => {
    if (access === 'granted' && tab === 'orders' && !ordersFetched) fetchOrders();
  }, [tab, access, ordersFetched]);

  async function fetchProducts() {
    try {
      const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
    } catch {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
    } finally { setFetching(false); }
  }

  async function fetchOrders() {
    setOrdersFetching(true);
    try {
      const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
    } catch {
      const snap = await getDocs(collection(db, 'orders'));
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
    } finally {
      setOrdersFetching(false);
      setOrdersFetched(true);
    }
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    setUpdatingStatus(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order marked as ${status}`);
    } catch {
      toast.error('Failed to update order status');
    } finally { setUpdatingStatus(null); }
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      category: p.category,
      sizes: p.sizes || [],
      colors: (p.colors || []).join(', '),
      images: p.images?.length ? p.images : [''],
      inStock: p.inStock !== false,
      featured: p.featured || false,
    });
    setEditId(p.id);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || form.sizes.length === 0) {
      toast.error('Name, price and at least one size are required');
      return;
    }
    const imageUrls = form.images.map((u) => u.trim()).filter(Boolean);
    const colorList = form.colors.split(',').map((c) => c.trim()).filter(Boolean);

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        sizes: form.sizes,
        colors: colorList,
        images: imageUrls,
        inStock: form.inStock,
        featured: form.featured,
      };

      if (editId) {
        await updateDoc(doc(db, 'products', editId), payload);
        toast.success('Product updated!');
      } else {
        await addDoc(collection(db, 'products'), { ...payload, createdAt: serverTimestamp() });
        toast.success('Product added!');
      }

      cancelForm();
      fetchProducts();
    } catch {
      toast.error(editId ? 'Failed to update product' : 'Failed to add product');
    } finally { setLoading(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete product'); }
  }

  async function handleSeed() {
    if (!confirm('Add 8 sample African fashion products to the database?')) return;
    setSeeding(true);
    try {
      await seedProducts();
      toast.success('Sample products added!');
      fetchProducts();
    } catch { toast.error('Failed to seed products'); } finally { setSeeding(false); }
  }

  function setImageUrl(index: number, value: string) {
    setForm((prev) => {
      const imgs = [...prev.images];
      imgs[index] = value;
      return { ...prev, images: imgs };
    });
  }
  function addImageRow() {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  }
  function removeImageRow(index: number) {
    setForm((prev) => {
      const imgs = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: imgs.length ? imgs : [''] };
    });
  }

  /* ── Checking ── */
  if (authLoading || access === 'checking') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-kente-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-cream/40 text-xs font-body uppercase tracking-widest">Verifying access…</p>
        </div>
      </div>
    );
  }

  /* ── Access Denied ── */
  if (access === 'denied') {
    const KV = `repeating-linear-gradient(to bottom, #E8B820 0px, #E8B820 14px, #0C0800 14px, #0C0800 20px, #D44820 20px, #D44820 34px, #0C0800 34px, #0C0800 40px, #0A4030 40px, #0A4030 54px, #0C0800 54px, #0C0800 60px)`;
    const KH = `repeating-linear-gradient(90deg, #E8B820 0px, #E8B820 22px, #0C0800 22px, #0C0800 26px, #D44820 26px, #D44820 48px, #0C0800 48px, #0C0800 52px)`;
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-[8px]" style={{ backgroundImage: KV }} />
        <div className="absolute top-0 right-0 bottom-0 w-[8px]" style={{ backgroundImage: KV }} />
        <div className="absolute top-0 left-[8px] right-[8px] h-[5px]" style={{ backgroundImage: KH }} />
        <div className="absolute bottom-0 left-[8px] right-[8px] h-[5px]" style={{ backgroundImage: KH }} />
        <div className="text-center max-w-md relative z-10">
          <ShieldOff size={52} strokeWidth={0.8} className="text-ankara-red mx-auto mb-6" />
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.45em] text-ankara-red mb-3">Access Denied</p>
          <h1 className="font-heading text-4xl font-light text-cream mb-4">Unauthorised</h1>
          <div className="kente-bar w-16 mx-auto mb-6" />
          <p className="font-body text-cream/50 text-sm leading-relaxed mb-2">
            The account <span className="text-cream/80 font-semibold">{user?.email}</span> is not authorised to access the admin dashboard.
          </p>
          <p className="font-body text-cream/30 text-sm mb-10">
            Only pre-approved admin accounts can log in here.
          </p>
          <div className="inline-flex items-center gap-3 border border-cream/10 px-5 py-3 mb-8">
            <div className="w-6 h-6 rounded-full border border-ankara-red/60 flex items-center justify-center">
              <span className="text-ankara-red text-xs font-bold">{countdown}</span>
            </div>
            <p className="text-cream/30 text-xs font-body uppercase tracking-widest">Redirecting to home…</p>
          </div>
          <div><Link href="/" className="btn-outline-gold text-sm">Go Home Now</Link></div>
        </div>
      </div>
    );
  }

  /* ── Admin Panel ── */
  return (
    <div className="min-h-screen bg-cream" style={{ paddingTop: 73 }}>
      <div className="kente-bar" />

      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8 lg:py-10">

        {/* Page header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange mb-1">Admin Panel</p>
            <h1 className="font-heading text-3xl font-light text-ink">
              {tab === 'products' ? 'Product Management' : 'Orders'}
            </h1>
            <div className="kente-bar w-14 mt-3" />
            <p className="text-[11px] font-body text-muted mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forest inline-block" />
              {user?.email}
            </p>
          </div>
          {tab === 'products' && (
            <div className="flex items-center gap-2 shrink-0 mt-1">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 border border-border text-muted hover:border-kente-gold hover:text-kente-gold text-[11px] font-body font-bold uppercase tracking-widest px-3 py-2.5 transition-colors disabled:opacity-40"
              >
                {seeding ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} strokeWidth={1.5} />}
                Seed Data
              </button>
              <button
                onClick={() => { if (showForm && !editId) { cancelForm(); } else { cancelForm(); setShowForm(true); } }}
                className="flex items-center gap-2 bg-kente-gold hover:bg-amber-400 text-ink text-[11px] font-body font-bold uppercase tracking-widest px-4 py-2.5 transition-colors"
              >
                <Plus size={13} strokeWidth={2.5} />
                Add Product
              </button>
            </div>
          )}
          {tab === 'orders' && (
            <button
              onClick={() => { setOrdersFetched(false); fetchOrders(); }}
              className="flex items-center gap-2 border border-border text-muted hover:border-kente-gold hover:text-kente-gold text-[11px] font-body font-bold uppercase tracking-widest px-3 py-2.5 transition-colors shrink-0 mt-1"
            >
              {ordersFetching ? <Loader2 size={13} className="animate-spin" /> : <ShoppingBag size={13} strokeWidth={1.5} />}
              Refresh
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-border mb-10">
          <button
            onClick={() => setTab('products')}
            className={`px-5 py-2.5 text-[11px] font-body font-bold uppercase tracking-widest border-b-2 transition-colors ${
              tab === 'products'
                ? 'border-kente-gold text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-5 py-2.5 text-[11px] font-body font-bold uppercase tracking-widest border-b-2 transition-colors ${
              tab === 'orders'
                ? 'border-kente-gold text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            Orders {ordersFetched ? `(${orders.length})` : ''}
          </button>
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <>
            {/* Add / Edit product form */}
            {showForm && (
              <div ref={formRef} className="bg-white border border-border p-6 mb-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading text-xl font-light text-ink">
                    {editId ? 'Edit Product' : 'New Product'}
                  </h2>
                  <button onClick={cancelForm} className="p-1 text-muted hover:text-ink">
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="admin-label">Product Name *</label>
                    <input
                      type="text" value={form.name} required
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ankara Wrap Dress"
                      className="form-input"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="admin-label">Description</label>
                    <textarea
                      value={form.description} rows={3}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe the piece — fabric, style, occasion…"
                      className="form-input min-h-[80px] resize-none"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Price (₦) *</label>
                    <input
                      type="number" value={form.price} required min="0"
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="25000"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="admin-label">Sizes * — select at least one</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {SIZES.map((size) => (
                        <button key={size} type="button"
                          onClick={() => setForm((prev) => ({
                            ...prev,
                            sizes: prev.sizes.includes(size)
                              ? prev.sizes.filter((s) => s !== size)
                              : [...prev.sizes, size],
                          }))}
                          className={`size-btn text-xs ${form.sizes.includes(size) ? 'selected' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">Colors / Patterns *</label>
                    <input
                      type="text" value={form.colors}
                      onChange={(e) => setForm({ ...form, colors: e.target.value })}
                      placeholder="Red & Gold, Blue & White, Green"
                      className="form-input"
                    />
                    <p className="text-[10px] text-muted font-body mt-1">Separate multiple colors with commas</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="admin-label">Product Images (URLs)</label>
                    <p className="text-[10px] text-muted font-body mb-3">
                      Add at least a front view. Back view and detail shots help customers see more. Not mandatory.
                    </p>
                    <div className="space-y-2">
                      {form.images.map((url, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-parchment border border-border flex items-center justify-center shrink-0">
                            {url ? (
                              <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <ImageIcon size={13} strokeWidth={1.5} className="text-muted" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => setImageUrl(i, e.target.value)}
                              placeholder={`${IMAGE_LABELS[i] || `Image ${i + 1}`} — paste image URL here`}
                              className="form-input text-sm"
                            />
                          </div>
                          {form.images.length > 1 && (
                            <button type="button" onClick={() => removeImageRow(i)} className="p-1.5 text-muted-light hover:text-ankara-red transition-colors shrink-0">
                              <X size={14} strokeWidth={1.5} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {form.images.length < 6 && (
                      <button
                        type="button" onClick={addImageRow}
                        className="mt-3 flex items-center gap-1.5 text-[11px] font-body font-bold uppercase tracking-widest text-muted hover:text-ankara-orange transition-colors"
                      >
                        <Plus size={12} strokeWidth={2.5} />
                        Add Another Image
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-kente-gold" />
                      <span className="text-sm text-ink font-body">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 accent-kente-gold" />
                      <span className="text-sm text-ink font-body">In Stock</span>
                    </label>
                  </div>

                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 disabled:opacity-60">
                      {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} strokeWidth={2} />}
                      {loading ? (editId ? 'Saving…' : 'Adding…') : (editId ? 'Save Changes' : 'Add Product')}
                    </button>
                    <button type="button" onClick={cancelForm} className="btn-outline">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Products table */}
            <div>
              {fetching ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-kente-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border">
                  <Package size={40} strokeWidth={0.8} className="text-muted-light mx-auto mb-4" />
                  <p className="font-heading text-xl text-ink mb-2">No Products Yet</p>
                  <p className="text-sm text-muted font-body">Click "Seed Data" to add demo products, or "Add Product" to create your own.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted">
                        <th className="pb-3 pr-4">Product</th>
                        <th className="pb-3 pr-4">Category</th>
                        <th className="pb-3 pr-4">Price</th>
                        <th className="pb-3 pr-4">Sizes</th>
                        <th className="pb-3 pr-4">Colors</th>
                        <th className="pb-3 pr-4">Images</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((p) => (
                        <tr key={p.id} className="group">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              {p.images?.[0] ? (
                                <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover bg-parchment shrink-0" />
                              ) : (
                                <div className="w-10 h-12 bg-parchment shrink-0 flex items-center justify-center">
                                  <Package size={14} className="text-border" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-ink truncate max-w-[160px]">{p.name}</p>
                                {p.featured && <span className="text-[10px] text-kente-gold font-bold uppercase tracking-wide">Featured</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-xs bg-parchment px-2 py-0.5 text-muted capitalize">{p.category}</span>
                          </td>
                          <td className="py-3 pr-4 font-semibold text-ankara-orange">{formatPrice(p.price)}</td>
                          <td className="py-3 pr-4 text-muted text-xs">{p.sizes?.join(', ') || '—'}</td>
                          <td className="py-3 pr-4 text-muted text-xs max-w-[120px] truncate">{p.colors?.join(', ') || '—'}</td>
                          <td className="py-3 pr-4">
                            <div className="flex gap-1">
                              {(p.images || []).slice(0, 3).map((img, i) => (
                                <img key={i} src={img} alt="" className="w-7 h-9 object-cover bg-parchment" />
                              ))}
                              {(p.images?.length || 0) > 3 && (
                                <div className="w-7 h-9 bg-parchment flex items-center justify-center text-[10px] text-muted font-bold">
                                  +{(p.images?.length || 0) - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs px-2 py-1 ${p.inStock ? 'status-confirmed' : 'status-pending'}`}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEdit(p)}
                                className="p-1.5 text-muted-light hover:text-ankara-orange transition-colors"
                                aria-label="Edit"
                              >
                                <Pencil size={14} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id, p.name)}
                                className="p-1.5 text-muted-light hover:text-ankara-red transition-colors"
                                aria-label="Delete"
                              >
                                <Trash2 size={14} strokeWidth={1.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div>
            {ordersFetching ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-kente-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border">
                <ShoppingBag size={40} strokeWidth={0.8} className="text-muted-light mx-auto mb-4" />
                <p className="font-heading text-xl text-ink mb-2">No Orders Yet</p>
                <p className="text-sm text-muted font-body">Orders will appear here once customers place them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const orderDate = order.createdAt
                    ? new Date(order.createdAt.seconds * 1000)
                    : new Date();

                  return (
                    <div key={order.id} className="bg-white border border-border">
                      {/* Order header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border">
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <p className="text-[10px] text-muted uppercase tracking-widest font-body">Order</p>
                            <p className="text-xs font-mono font-semibold text-ink">#{order.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div>
                            <p className="text-[10px] text-muted uppercase tracking-widest font-body">Customer</p>
                            <p className="text-xs font-semibold text-ink font-body">{order.userEmail || '—'}</p>
                          </div>
                          <div className="h-8 w-px bg-border hidden sm:block" />
                          <div className="hidden sm:block">
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
                          {order.paystackRef && (
                            <>
                              <div className="h-8 w-px bg-border hidden lg:block" />
                              <div className="hidden lg:block">
                                <p className="text-[10px] text-muted uppercase tracking-widest font-body">Ref</p>
                                <p className="text-xs font-mono text-muted">{order.paystackRef}</p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Status dropdown */}
                        <div className="relative">
                          {updatingStatus === order.id ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs font-body text-muted">
                              <Loader2 size={12} className="animate-spin" />
                              Updating…
                            </div>
                          ) : (
                            <div className="relative">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className={`appearance-none text-xs font-semibold px-3 py-1.5 pr-7 cursor-pointer border-0 outline-none font-body ${status.className}`}
                              >
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                                ))}
                              </select>
                              <ChevronDown size={11} strokeWidth={2} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-5">
                        <div className="space-y-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="relative w-10 h-12 shrink-0 bg-parchment overflow-hidden">
                                {item.image && (
                                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
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
                            <span className="font-semibold text-ink uppercase tracking-wide">Ship to: </span>
                            {order.shippingAddress.name} — {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                            {order.shippingAddress.state} · {order.shippingAddress.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
