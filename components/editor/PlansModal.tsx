'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Check,
  X,
  Flame,
  CircleOff,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { PlansGrid } from '@/components/editor/PlansGrid';
import { PLAN_ORDER } from '@/lib/plans';

interface PlansModalProps {
  onClose: () => void;
}

export function PlansModal({ onClose }: PlansModalProps) {
  const t = useTranslations('editorPlans');
  const locale = useLocale();
  const uiCurrency = locale === 'pt-BR' ? 'BRL' : 'USD';
  const { accessToken } = useAuth();
  const [subscribingSlug, setSubscribingSlug] = useState<string | null>(null);

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['plans', uiCurrency],
    queryFn: () => api.plans.list(accessToken!, uiCurrency),
    enabled: !!accessToken,
    staleTime: 5 * 60_000,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.users.me(accessToken!),
    enabled: !!accessToken,
    staleTime: 60_000,
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isLoading = plansLoading || profileLoading;

  const currentPlanSlug =
    (profile?.plan as Record<string, unknown> | null)?.slug as string | null ?? null;

  const sub = profile?.subscription as Record<string, unknown> | null;
  const hasActiveSub = sub?.status === 'ACTIVE' || sub?.status === 'active';

  // Ordena do mais caro para o mais barato.
  const sorted = (plans ?? []).slice().sort(
    (a, b) => PLAN_ORDER.indexOf(b.slug) - PLAN_ORDER.indexOf(a.slug),
  );

  // Assinar = redirecionar para o checkout da PerfectPay (assinatura mensal).
  function handleSubscribe(planSlug: string) {
    if (subscribingSlug) return;
    const targetPlan = sorted.find((plan) => plan.slug === planSlug);
    if (!targetPlan?.checkoutUrl) return;
    setSubscribingSlug(planSlug);
    window.location.href = targetPlan.checkoutUrl;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative mx-4 flex max-h-[88vh] w-full max-w-6xl flex-col gap-3 overflow-y-auto sidebar-scroll rounded-[20px] border border-[#f3f0ed]/[0.06] bg-[#111113] p-4 shadow-2xl sm:p-5">

        {/* Close */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            onClick={onClose}
            className="app-press app-ease flex h-8 w-8 items-center justify-center rounded-full text-landing-text/30 transition-all hover:bg-landing-text/8 hover:text-landing-text/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-1.5 rounded-full border border-[#e11d2a]/20 bg-[#e11d2a]/8 px-3 py-1">
            <Flame className="h-3 w-3 text-[#e11d2a]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#e11d2a]">{t('plansModal.limitedOffer')}</span>
          </div>
          <h2 className="app-reveal text-lg font-bold text-[#f3f0ed] sm:text-xl">
            {t('plansModal.titlePlans')}
          </h2>
          <p className="max-w-md text-[12px] text-[#f3f0ed]/45">
            {t('plansModal.plansSubtitle', { count: t('plansModal.creatorsCount') })}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-[#f3f0ed]/30">
            <span className="flex items-center gap-1">
              <CircleOff className="h-2.5 w-2.5" />
              {t('plansModal.cancelAnytime')}
            </span>
          </div>
        </div>

        {/* Plans */}
        <PlansGrid
          plans={plans ?? []}
          currentPlanSlug={currentPlanSlug}
          hasActiveSub={hasActiveSub}
          subscribingSlug={subscribingSlug}
          onSubscribe={handleSubscribe}
          compact
          isLoading={isLoading}
        />
        {!isLoading && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-[#f3f0ed]/25">
            <span className="flex items-center gap-1">
              <Check className="h-2.5 w-2.5 text-[#e11d2a]/50" />
              {t('plansModal.noCancelFee')}
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-2.5 w-2.5 text-[#e11d2a]/50" />
              {t('plansModal.creditsRenew')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
