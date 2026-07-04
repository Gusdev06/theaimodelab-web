'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

// Assinaturas descontinuadas: o antigo checkout de planos (/checkout?plan=)
// agora só redireciona para a vitrine de pacotes de crédito.
function CheckoutRedirectContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/creditos');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111113]">
      <Loader2 className="h-7 w-7 animate-spin text-[#e11d2a]" />
      <p className="text-sm text-[#f3f0ed]/50">Redirecionando...</p>
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
