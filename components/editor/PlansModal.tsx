'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Check,
  X,
  Flame,
  CircleOff,
  Coins,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { PlansGrid } from '@/components/editor/PlansGrid';
import { CreditPackagesGrid } from '@/components/editor/CreditPackagesGrid';
import { PLAN_ORDER } from '@/lib/plans';
import { withCheckoutIdentity } from '@/lib/checkout';
import { trackPaywallEvent } from '@/lib/tracking';

interface PlansModalProps {
  onClose: () => void;
  /** Motivo pelo qual o modal foi aberto — reportado no tracking de paywall. */
  trigger?: string;
}

export function PlansModal({ onClose, trigger = 'page_visit' }: PlansModalProps) {
  const t = useTranslations('editorPlans');
  const locale = useLocale();
  const uiCurrency = locale === 'pt-BR' ? 'BRL' : 'USD';
  const { accessToken } = useAuth();
  const [subscribingSlug, setSubscribingSlug] = useState<string | null>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  // true quando o usuário clica num CTA (assinar/comprar) — evita registrar
  // 'dismiss' de paywall depois de uma ação real.
  const didActRef = useRef(false);

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

  // Pacotes de crédito avulsos (top-up) — compra única, créditos entram como bônus (não expiram).
  const { data: packages } = useQuery({
    queryKey: ['credits', 'packages', uiCurrency],
    queryFn: () => api.credits.packages(accessToken!, uiCurrency),
    enabled: !!accessToken,
    staleTime: 5 * 60_000,
  });
  // Exibição orientada a dados: mostra os pacotes sempre que a API retornar
  // pacotes ativos para a moeda do usuário (o backend passou a devolver BRL).
  const hasPackages = !!packages?.some((p) => p.isActive);

  // Fecha registrando 'dismiss' se o usuário não tomou nenhuma ação (CTA).
  function handleClose() {
    if (!didActRef.current) {
      trackPaywallEvent({ action: 'dismiss', trigger, surface: 'plans_modal' });
    }
    onClose();
  }

  // 'view' quando o modal abre.
  useEffect(() => {
    trackPaywallEvent({ action: 'view', trigger, surface: 'plans_modal' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, trigger]);

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
    didActRef.current = true;
    trackPaywallEvent({
      action: 'click',
      trigger,
      surface: 'plans_modal',
      targetId: planSlug,
    });
    setSubscribingSlug(planSlug);
    // Manda o email (e nome) da conta logada para o checkout da PerfectPay.
    window.location.href = withCheckoutIdentity(targetPlan.checkoutUrl, {
      email: profile?.email,
      name: profile?.name,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative mx-4 flex max-h-[88vh] w-full max-w-6xl flex-col gap-3 overflow-y-auto sidebar-scroll rounded-[20px] border border-[#f3f0ed]/[0.06] bg-[#111113] p-4 shadow-2xl sm:p-5">

        {/* Close */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            onClick={handleClose}
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
        <div ref={plansRef}>
          <PlansGrid
            plans={plans ?? []}
            currentPlanSlug={currentPlanSlug}
            hasActiveSub={hasActiveSub}
            subscribingSlug={subscribingSlug}
            onSubscribe={handleSubscribe}
            compact
            isLoading={isLoading}
          />
        </div>
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

        {/* Pacotes de crédito avulsos (top-up) */}
        {hasPackages && (
          <>
            <div className="mt-4 flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-1.5 rounded-full border border-[#f3f0ed]/10 bg-[#f3f0ed]/[0.04] px-3 py-1">
                <Coins className="h-3 w-3 text-[#f3f0ed]/50" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f3f0ed]/50">{t('plansModal.tabCredits')}</span>
              </div>
              <h2 className="app-reveal text-lg font-bold text-[#f3f0ed] sm:text-xl">
                {t('plansModal.titleCredits')}
              </h2>
              <p className="max-w-md text-[12px] text-[#f3f0ed]/45">
                {t('plansModal.creditsSubtitle')}
              </p>
            </div>

            <CreditPackagesGrid
              packages={packages ?? []}
              currency={uiCurrency}
              compact
              plans={plans ?? []}
              surface="plans_modal"
              onAnchorClick={() => plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            />
          </>
        )}
      </div>
    </div>
  );
}
