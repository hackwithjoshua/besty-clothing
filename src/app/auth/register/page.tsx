'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-ankara', 'bg-gold', 'bg-forest'];

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      router.push('/');
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch {
      toast.error('Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-deep-brown items-end p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(201,162,39,0.4) 40px, rgba(201,162,39,0.4) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(193,112,40,0.4) 40px, rgba(193,112,40,0.4) 41px)
            `,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown via-transparent to-transparent" />
        <div className="relative z-10">
          <Link href="/" className="inline-block mb-12">
            <Image src="/besty-logo.png" alt="Besty Clothing" height={44} width={140} className="object-contain brightness-0 invert" />
          </Link>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            {[
              'Access exclusive African fashion collections',
              'Track your orders in real-time',
              'Get early access to new arrivals',
              'Enjoy seamless Paystack checkout',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border border-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} className="text-gold" />
                </div>
                <p className="text-sm text-cream/70 font-body">{benefit}</p>
              </div>
            ))}
          </div>
          <div className="h-px w-12 bg-gold" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
        <div className="w-full max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-brown-light hover:text-terracotta transition-colors mb-8 font-body"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            Back to store
          </Link>

          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-deep-brown mb-2">
            Create Account
          </h2>
          <p className="font-body text-sm text-brown-light mb-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-terracotta font-medium hover:underline">
              Sign in
            </Link>
          </p>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-border bg-white hover:bg-cream py-3.5 text-sm font-medium text-deep-brown transition-colors disabled:opacity-50 font-body mb-6"
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
            <span className="text-xs text-brown-light uppercase tracking-widest font-body">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-brown mb-2 font-body">
                Full Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Amara Okafor"
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-brown mb-2 font-body">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-brown mb-2 font-body">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="form-input pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light hover:text-brown transition-colors"
                >
                  {showPassword ? <EyeOff size={17} strokeWidth={1.5} /> : <Eye size={17} strokeWidth={1.5} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-brown-light font-body">
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-brown-light text-center mt-6 font-body">
            By creating an account you agree to our{' '}
            <a href="#" className="text-terracotta hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-terracotta hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
