'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('checkout.success');

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['credits'] });
    queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
  }, [queryClient]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#111113] px-4">
      <div className="app-reveal flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e11d2a]/15">
          <CheckCircle className="h-8 w-8 text-[#e11d2a]" />
        </div>
        <h1 className="text-2xl font-bold text-[#f3f0ed]">{t('title')}</h1>
        <p className="max-w-md text-sm text-[#f3f0ed]/50">
          {t('description')}
        </p>
      </div>
      <button
        onClick={() => router.push('/home')}
        className="app-btn flex items-center gap-2 bg-[#e11d2a] px-6 py-3 text-sm font-bold text-[#111113]"
      >
        {t('cta')}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
