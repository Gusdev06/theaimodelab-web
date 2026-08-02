'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { ArrowRight, Gift, ImageIcon, Sparkles, Wand2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { trackPaywallEvent } from '@/lib/tracking';

/**
 * Herói de primeira sessão do /home: visível apenas para usuário sem assinatura
 * ativa e sem nenhuma geração. Leva direto à primeira foto (aha moment) — se o
 * usuário tem créditos de bônus (welcome credits), a primeira geração é grátis;
 * sem créditos, a tentativa de gerar abre o PlansModal (paywall proativo na
 * primeira sessão, em vez de dashboard vazio).
 */
export function FirstRunHero() {
  const t = useTranslations('home');
  const { user, accessToken } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.users.me(accessToken!),
    enabled: !!accessToken && !!user,
    staleTime: 60_000,
  });

  // Mesma queryKey da ContinueSection — react-query deduplica o fetch.
  const { data: gallery } = useQuery({
    queryKey: ['home', 'recent-generations'],
    queryFn: () => api.gallery.list(accessToken!, 1, 12),
    enabled: !!accessToken && !!user,
    staleTime: 60_000,
  });

  const sub = profile?.subscription as Record<string, unknown> | null;
  const hasActiveSub = sub?.status === 'ACTIVE' || sub?.status === 'active';
  const generations = gallery?.data ?? [];
  const credits = profile?.credits as {
    bonusCreditsRemaining?: number;
    planCreditsRemaining?: number;
  } | null;
  const bonusCredits = credits?.bonusCreditsRemaining ?? 0;

  const show =
    !!profile && !!gallery && !hasActiveSub && generations.length === 0;

  const viewTracked = useRef(false);
  useEffect(() => {
    if (!show || viewTracked.current) return;
    viewTracked.current = true;
    trackPaywallEvent({
      action: 'view',
      trigger: 'first_session',
      surface: 'home_first_run',
      creditsAvailable: bonusCredits,
    });
  }, [show, bonusCredits]);

  if (!show) return null;

  const steps = [
    { id: 'prompt', icon: Wand2 },
    { id: 'generate', icon: ImageIcon },
    { id: 'unlock', icon: Sparkles },
  ] as const;

  return (
    <section className="app-reveal relative overflow-hidden rounded-[18px] border border-[rgba(225,29,42,0.35)] bg-app-card p-6 md:p-8">
      {/* brilho de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[rgba(225,29,42,0.12)] blur-3xl"
      />

      {bonusCredits > 0 && (
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-app-lime/30 bg-app-lime/10 px-3 py-1 text-[12.5px] font-semibold text-app-lime">
          <Gift className="size-3.5" strokeWidth={2} />
          {t('firstRun.freeCreditsBadge', { credits: bonusCredits })}
        </span>
      )}

      <h2 className="max-w-[560px] text-[24px] font-bold leading-tight tracking-[-0.4px] text-app-text md:text-[30px]">
        {t('firstRun.title')}
      </h2>
      <p className="mt-2 max-w-[560px] text-[14.5px] leading-relaxed text-app-text-2">
        {t('firstRun.subtitle')}
      </p>

      <ol className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-6">
        {steps.map(({ id, icon: Icon }, i) => (
          <li key={id} className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-app-hairline bg-app-bg">
              <Icon className="size-4 text-app-text-2" strokeWidth={1.8} />
            </span>
            <span className="text-[13.5px] text-app-text-2">
              <span className="mr-1 font-semibold text-app-text">{i + 1}.</span>
              {t(`firstRun.steps.${id}`)}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/image"
          onClick={() =>
            trackPaywallEvent({
              action: 'click',
              trigger: 'first_session',
              surface: 'home_first_run',
              targetId: 'generate_first_image',
              creditsAvailable: bonusCredits,
            })
          }
          className="app-btn flex h-11 items-center gap-2 bg-app-lime px-5 text-[14.5px] font-semibold text-app-lime-ink"
        >
          {t('firstRun.cta')}
          <ArrowRight className="size-[17px]" strokeWidth={2.2} />
        </Link>
        <Link
          href="/pricing"
          onClick={() =>
            trackPaywallEvent({
              action: 'click',
              trigger: 'first_session',
              surface: 'home_first_run',
              targetId: 'view_plans',
              creditsAvailable: bonusCredits,
            })
          }
          className="text-[13.5px] font-medium text-app-text-2 underline-offset-4 transition-colors hover:text-app-text hover:underline"
        >
          {t('firstRun.secondaryCta')}
        </Link>
      </div>
    </section>
  );
}
