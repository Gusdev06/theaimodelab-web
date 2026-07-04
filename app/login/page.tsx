'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AuthForm } from '@/components/auth/AuthForm';

const GOOGLE_ERROR_KEYS = ['google_denied', 'google_exchange_failed', 'google_no_token', 'auth_failed', 'google_failed', 'google_config'];

function LoginPageContent() {
  const searchParams = useSearchParams();
  const tCommon = useTranslations('auth.common');

  const planParam = searchParams.get('plan');
  const resetToken = searchParams.get('token');
  const googleErrorParam = searchParams.get('error');

  const googleError = googleErrorParam
    ? tCommon(GOOGLE_ERROR_KEYS.includes(googleErrorParam) ? `googleErrors.${googleErrorParam}` : 'googleErrors.default')
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-center">
        <div className="app-reveal mb-8 flex flex-col items-center">
          <Image src="/logo-red-sem-fundo.png" alt="The AI Model Lab" width={180} height={180} className="mix-blend-lighten" />
          <p className="mt-2 text-xs text-white/25">{tCommon('tagline')}</p>
        </div>

        <AuthForm
          planParam={planParam}
          resetToken={resetToken}
          googleError={googleError}
          onSuccess={() => { }}
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
