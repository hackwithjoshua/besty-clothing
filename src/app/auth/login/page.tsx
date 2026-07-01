'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const KENTE_V = `repeating-linear-gradient(
  to bottom,
  #E8B820 0px,  #E8B820 14px,
  #0C0800 14px, #0C0800 20px,
  #D44820 20px, #D44820 34px,
  #0C0800 34px, #0C0800 40px,
  #0A4030 40px, #0A4030 54px,
  #0C0800 54px, #0C0800 60px,
  #B82010 60px, #B82010 74px,
  #0C0800 74px, #0C0800 80px,
  #1B2B7A 80px, #1B2B7A 94px,
  #0C0800 94px, #0C0800 100px
)`;

const KENTE_H = `repeating-linear-gradient(
  90deg,
  #E8B820 0px, #E8B820 22px, #0C0800 22px, #0C0800 26px,
  #D44820 26px, #D44820 48px, #0C0800 48px, #0C0800 52px,
  #0A4030 52px, #0A4030 74px, #0C0800 74px, #0C0800 78px,
  #B82010 78px, #B82010 100px, #0C0800 100px, #0C0800 104px
)`;

function LoginForm() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const { signIn, signInWithGoogle }  = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const next         = searchParams.get('next') || '/';
  const isAdminLogin = next === '/admin';

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      router.push(next);
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push(next);
    } catch {
      toast.error('Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ══════════════════════════════════════
     ADMIN LOGIN
  ══════════════════════════════════════ */
  if (isAdminLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0C0800' }}>
        <div className="absolute top-0 left-0 right-0 h-[5px]" style={{ backgroundImage: KENTE_H }} />
        <div className="absolute bottom-0 left-0 right-0 h-[5px]" style={{ backgroundImage: KENTE_H }} />

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <Image src="/besty-logo.png" alt="Besty Clothing" height={44} width={140} className="object-contain brightness-0 invert mx-auto" />
            </Link>
            <div className="h-[4px] mt-5 w-16 mx-auto" style={{ backgroundImage: KENTE_H }} />
          </div>

          {/* Card */}
          <div className="bg-[#0E0900] border border-cream/[0.07] p-8">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} strokeWidth={1.5} className="text-kente-gold" />
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-ankara-orange">Secure Sign In</p>
            </div>
            <h2 className="font-heading text-3xl font-light text-cream mb-6">Admin Panel</h2>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-body font-semibold uppercase tracking-[0.3em] text-cream/40 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bestyclothing.shop"
                  required
                  className="w-full bg-[#0A0600] border border-cream/10 focus:border-kente-gold text-cream text-sm placeholder:text-cream/20 px-4 py-3 font-body outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-body font-semibold uppercase tracking-[0.3em] text-cream/40 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    minLength={6}
                    className="w-full bg-[#0A0600] border border-cream/10 focus:border-kente-gold text-cream text-sm placeholder:text-cream/20 px-4 py-3 pr-11 font-body outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-kente-gold transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} strokeWidth={1.5} /> : <Eye size={17} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-kente-gold hover:bg-amber-400 text-ink font-body font-bold text-xs uppercase tracking-[0.4em] py-4 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Verifying…</>
                  : <><ShieldCheck size={14} strokeWidth={2} /> Access Dashboard</>
                }
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-body text-cream/25 hover:text-cream/50 transition-colors uppercase tracking-widest">
              <ArrowLeft size={12} strokeWidth={2} />
              Back to store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     USER LOGIN — split layout (unchanged)
  ══════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-12" style={{ backgroundColor: '#0E0900' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(232,184,32,0.4) 40px, rgba(232,184,32,0.4) 41px),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(212,72,32,0.4) 40px, rgba(212,72,32,0.4) 41px)
          `
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-[6px]" style={{ backgroundImage: KENTE_V }} />
        <div className="relative z-10">
          <Link href="/" className="inline-block mb-12">
            <Image src="/besty-logo.png" alt="Besty Clothing" height={44} width={140} className="object-contain brightness-0 invert mb-1" />
            <p className="text-[9px] text-kente-gold uppercase tracking-[0.3em] mt-1">Lagos · Nigeria</p>
          </Link>
          <blockquote className="font-heading text-2xl lg:text-3xl font-light text-cream/80 leading-relaxed mb-4 italic">
            "Wear Your Story. Celebrate Your Culture."
          </blockquote>
          <div className="kente-bar w-12" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-8 font-body">
            <ArrowLeft size={15} strokeWidth={1.5} />
            Back to store
          </Link>

          <div className="lg:hidden mb-8">
            <Image src="/besty-logo.png" alt="Besty Clothing" height={40} width={130} className="object-contain" />
          </div>

          <h2 className="font-heading text-3xl lg:text-4xl font-light text-ink mb-2">Welcome back</h2>
          <p className="font-body text-sm text-muted mb-8">
            New here?{' '}
            <Link href="/auth/register" className="text-ankara-orange font-medium hover:underline">Create an account</Link>
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-border bg-white hover:bg-parchment py-3.5 text-sm font-medium text-ink transition-colors disabled:opacity-50 font-body mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted uppercase tracking-widest font-body">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-muted mb-2 font-body">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="form-input" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium uppercase tracking-widest text-muted font-body">Password</label>
                <a href="#" className="text-xs text-ankara-orange hover:underline font-body">Forgot password?</a>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="form-input pr-12" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
                  {showPassword ? <EyeOff size={17} strokeWidth={1.5} /> : <Eye size={17} strokeWidth={1.5} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
