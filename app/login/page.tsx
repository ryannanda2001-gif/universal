import { Suspense } from 'react';

import LoginPageClient from './LoginPageClient';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-cyan-50 to-blue-100 flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-blue-100 p-8 text-center text-slate-500">
            Menyiapkan halaman login...
          </div>
        }
      >
        <LoginPageClient />
      </Suspense>
    </div>
  );
}
