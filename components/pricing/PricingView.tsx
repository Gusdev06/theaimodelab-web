'use client';

import { useState } from 'react';
import { Check, CircleOff, Coins, Flame, type LucideIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { PlansGrid } from '@/components/editor/PlansGrid';
import { PLAN_ORDER } from '@/lib/plans';
import { generateMetaEventId, trackMetaPixelEvent } from '@/lib/tracking';

/** Faixa de confiança exibida abaixo dos cards (garantias do plano). */
function TrustBar({ items }: { items: { icon: LucideIcon; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-3 rounded-[14px] border border-app-hairline bg-app-surface/50 px-6 py-4">
      {items.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-2.5 text-[13px] text-app-text-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[rgba(225,29,42,0.2)] bg-[rgba(225,29,42,0.07)]">
            <Icon className="size-3.5 text-app-lime" strokeWidth={2} />
          </span>
          {label}
        </span>
      ))}
    </div>
  );
}

/** Página de preços do shell — mesma lógica do PlansModal do workspace,
 *  renderizada como tela (sem overlay). */
export function PricingView() {
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

  const isLoading = plansLoading || profileLoading;

  const currentPlanSlug =
    ((profile?.plan as Record<string, unknown> | null)?.slug as string | null) ?? null;

  const sub = profile?.subscription as Record<string, unknown> | null;
  const hasActiveSub = sub?.status === 'ACTIVE' || sub?.status === 'active';

  // Ordena do mais caro para o mais barato.
  const sorted = (plans ?? [])
    .slice()
    .sort((a, b) => PLAN_ORDER.indexOf(b.slug) - PLAN_ORDER.indexOf(a.slug));

  // Assinar = redirecionar para o checkout da PerfectPay (assinatura mensal).
  function handleSubscribe(planSlug: string) {
    if (subscribingSlug) return;
    const targetPlan = sorted.find((plan) => plan.slug === planSlug);
    if (!targetPlan?.checkoutUrl) return;

    setSubscribingSlug(planSlug);
    const eventId = generateMetaEventId('initiate_checkout_plan');
    trackMetaPixelEvent('InitiateCheckout', {
      content_ids: [planSlug],
      content_name: targetPlan.name ?? planSlug,
      content_type: 'product',
      currency: targetPlan.currency ?? uiCurrency,
      value: (targetPlan.priceCents ?? 0) / 100,
      checkout_type: 'subscription',
    }, eventId);
    window.location.href = targetPlan.checkoutUrl;
  }

  return (
    // toda a área é o container de scroll, no padrão das demais telas
    <div className="min-h-0 flex-1 overflow-y-auto scrollbar-app">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-6 pb-16 pt-8 lg:px-11">
        {/* cabeçalho */}
        <div className="flex flex-col items-start gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full border border-[rgba(225,29,42,0.25)] bg-[rgba(225,29,42,0.08)] px-3 py-1">
            <Flame className="size-3 text-app-lime" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-app-lime">
              {t('plansModal.limitedOffer')}
            </span>
          </div>
          <h2 className="app-reveal text-[26px] font-bold tracking-[-0.3px] text-app-text">
            {t('plansModal.titlePlans')}
          </h2>
          <p className="app-reveal max-w-xl text-[14px] leading-relaxed text-app-text-2" style={{ animationDelay: '0.08s' }}>
            {t('plansModal.plansSubtitle', { count: t('plansModal.creatorsCount') })}
          </p>
        </div>

        {/* planos */}
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
          <TrustBar
            items={[
              { icon: CircleOff, label: t('plansModal.cancelAnytime') },
              { icon: Check, label: t('plansModal.noCancelFee') },
              { icon: Coins, label: t('plansModal.creditsRenew') },
            ]}
          />
        )}
      </div>
    </div>
  );
}
