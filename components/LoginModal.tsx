'use client';

import { X } from 'lucide-react';
import { useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useLoginModal } from '@/lib/login-modal-context';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthCarousel } from '@/components/auth/AuthCarousel';

function LoginModalContent() {
  const { isOpen, planParam, initialMode, closeLoginModal } = useLoginModal();
  const tCommon = useTranslations('auth.common');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeLoginModal} />

      {/* Modal card — split layout on desktop */}
      <div
        className="relative bg-[#111113] p-2 z-10 flex h-[75vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl"
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* ── Left: Form panel ── */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-y-auto bg-[#111113] px-8 py-8 lg:w-[420px] lg:shrink-0">
          <button
            onClick={closeLoginModal}
            className="app-press app-ease absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl text-white/30 transition-colors hover:bg-white/[0.08] hover:text-white/70"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="app-reveal mb-6 flex flex-col items-center">
            <Image src="/logo-red-sem-fundo.png" alt="The AI Model Lab" width={140} height={140} className="mix-blend-lighten" />
            <p className="mt-1 text-xs text-white/25">{tCommon('tagline')}</p>
          </div>

          <AuthForm
            key={`${initialMode}-${planParam ?? ''}`}
            planParam={planParam}
            initialMode={initialMode}
            initialView={initialMode === 'register' ? 'email' : 'options'}
            onSuccess={closeLoginModal}
            onClose={closeLoginModal}
          />
        </div>

        {/* ── Right: Carousel panel (desktop only) ── */}
        <AuthCarousel className="rounded-lg shadow-lg hidden lg:flex lg:flex-1" />
      </div>
    </div>
  );
}

export function LoginModal() {
  return (
    <Suspense>
      <LoginModalContent />
    </Suspense>
  );
}
