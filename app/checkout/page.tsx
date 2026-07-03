'use client';

import { Loader2, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { clearRecoveryPromo, getStoredRecoveryPromo } from '@/lib/recovery-promo';

function CheckoutRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, accessToken, loading: authLoading } = useAuth();
  const triggered = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const planSlug = searchParams.get('plan');

  useEffect(() => {
    if (authLoading) return;

    if (!planSlug) {
      router.replace('/creditos');
      return;
    }

    if (!user || !accessToken) {
      router.replace(`/login?plan=${encodeURIComponent(planSlug)}`);
      return;
    }

    if (triggered.current) return;
    triggered.current = true;

    (async () => {
      const recoveryPromo = getStoredRecoveryPromo();
      try {
        const res = await api.subscriptions.create(accessToken, planSlug, undefined, recoveryPromo);
        if (recoveryPromo) clearRecoveryPromo();
        window.location.href = res.checkoutUrl;
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        if (status === 409) {
          try {
            const res = await api.subscriptions.upgrade(accessToken, planSlug);
            window.location.href = res.checkoutUrl;
            return;
          } catch {
            // fall through
          }
        }
        setErrorMsg('Não foi possível iniciar o checkout. Tente novamente pela página de planos.');
      }
    })();
  }, [authLoading, user, accessToken, planSlug, router]);

  if (errorMsg) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#111113] px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>
        <p className="max-w-sm text-center text-sm text-[#f3f0ed]/60">{errorMsg}</p>
        <button
          onClick={() => router.replace('/creditos')}
          className="app-press app-ease flex h-11 items-center justify-center rounded-xl bg-[#e11d2a] px-6 text-sm font-bold text-[#111113] transition-colors hover:bg-[#f75fae]"
        >
          Ver planos
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111113]">
      <Loader2 className="h-7 w-7 animate-spin text-[#e11d2a]" />
      <p className="text-sm text-[#f3f0ed]/50">Preparando seu checkout...</p>
    </div>
  );
}

export default function CheckoutRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111113]">
          <Loader2 className="h-7 w-7 animate-spin text-[#e11d2a]" />
        </div>
      }
    >
      <CheckoutRedirectContent />
    </Suspense>
  );
}
