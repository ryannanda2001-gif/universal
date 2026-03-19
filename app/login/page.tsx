'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectedFrom = searchParams.get('redirectedFrom') || '/admin';
  const initialError = useMemo(() => {
    const errorCode = searchParams.get('error');
    if (errorCode === 'not-authorized') {
      return 'Akun ini tidak memiliki akses ke dashboard admin.';
    }
    return '';
  }, [searchParams]);

  useEffect(() => {
    const syncUnauthorizedState = async () => {
      if (searchParams.get('error') === 'not-authorized') {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error(signOutError);
        }
      }
    };

    syncUnauthorizedState();
  }, [searchParams]);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.push(redirectedFrom);
      router.refresh();
    } catch (signInError) {
      console.error(signInError);
      setError(signInError instanceof Error ? signInError.message : 'Login gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-cyan-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Login Admin</h1>
          <p className="text-slate-500 mt-2">Masuk dengan akun admin Anda untuk mengelola produk.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="admin@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Masukkan password"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white py-3 font-bold disabled:opacity-60"
          >
            {isSubmitting ? 'Sedang masuk...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
