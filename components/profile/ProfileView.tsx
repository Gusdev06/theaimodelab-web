'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  Crown,
  ExternalLink,
  Gift,
  Image as ImageIcon,
  Loader2,
  Receipt,
  Settings,
  Sparkles,
  TrendingUp,
  Video,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLANS_ENABLED } from '@/lib/features';
import { api, type CreditTransaction } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ManageSubscriptionModal } from '@/components/editor/ManageSubscriptionModal';

// ─── Avatar com anel de créditos ─────────────────────────────────────────────

function AvatarRing({
  avatarUrl,
  name,
  fraction,
}: {
  avatarUrl?: string | null;
  name: string;
  fraction: number;
}) {
  const R = 44;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - fraction);
  const color = fraction > 0.25 ? '#e11d2a' : fraction > 0.1 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative size-[96px] shrink-0">
      <svg className="pointer-events-none absolute inset-0 size-full -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(243,240,237,0.08)" strokeWidth="3" />
        <circle
          cx="48"
          cy="48"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <span className="absolute inset-[7px] overflow-hidden rounded-full bg-app-card">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-[30px] font-bold text-app-lime">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </span>
    </div>
  );
}

// ─── Aba de uso (histórico de créditos) ──────────────────────────────────────

function txIcon(type: string, description: string) {
  const desc = description.toLowerCase();
  if (type === 'GENERATION_DEBIT') {
    if (desc.includes('video')) return Video;
    if (desc.includes('image') || desc.includes('imagem')) return ImageIcon;
    return Zap;
  }
  if (type.includes('PURCHASE') || type.includes('PAYMENT')) return CreditCard;
  if (type.includes('BONUS')) return Gift;
  if (type.includes('PLAN')) return Sparkles;
  return type.includes('DEBIT') ? ArrowDownCircle : ArrowUpCircle;
}

const TX_PAGE_SIZE = 20;

function UsageTab({ accessToken, dateLocale }: { accessToken: string; dateLocale: string }) {
  const t = useTranslations('account.usage');
  const [page, setPage] = useState(1);
  const numFmt = useMemo(() => new Intl.NumberFormat(dateLocale), [dateLocale]);

  const { data, isPending, isFetching } = useQuery({
    queryKey: ['credits', 'transactions', page],
    queryFn: () => api.credits.transactions(accessToken, page, TX_PAGE_SIZE),
    enabled: !!accessToken,
    placeholderData: (prev) => prev,
  });

  const txs = data?.data ?? [];
  const meta = data?.meta;

  const typeLabel: Record<string, string> = {
    GENERATION_DEBIT: t('types.generationDebit'),
    PLAN_CREDIT: t('types.planCredit'),
    BONUS_CREDIT: t('types.bonusCredit'),
    PURCHASE_CREDIT: t('types.purchaseCredit'),
    PAYMENT_CREDIT: t('types.paymentCredit'),
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="flex flex-col gap-4">
      {meta && (
        <div className="rounded-[14px] border border-app-hairline bg-app-surface px-4 py-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-app-muted">
            {t('totalTransactions')}
          </p>
          <p className="mt-1 text-[22px] font-bold tabular-nums text-app-lime">{numFmt.format(meta.total)}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-[14px] border border-app-hairline bg-app-surface">
        <div className="flex items-center justify-between border-b border-app-hairline px-4 py-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-app-muted">
            {t('transactions')}
          </span>
          {isFetching && !isPending && <Loader2 className="size-3.5 animate-spin text-app-muted" />}
        </div>

        <div className="max-h-[364px] divide-y divide-app-hairline overflow-y-auto scrollbar-app">
          {isPending ? (
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <div className="size-9 shrink-0 skeleton-app rounded-xl bg-app-card" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 skeleton-app rounded bg-app-card" />
                  <div className="h-2.5 w-1/3 skeleton-app rounded bg-app-card" />
                </div>
                <div className="h-4 w-16 skeleton-app rounded bg-app-card" />
              </div>
            ))
          ) : txs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <Receipt className="size-7 text-app-muted" strokeWidth={1.6} />
              <p className="text-[13.5px] text-app-muted">{t('empty')}</p>
            </div>
          ) : (
            txs.map((tx: CreditTransaction) => {
              const debit = tx.amount < 0;
              const Icon = txIcon(tx.type, tx.description);
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-xl',
                      debit ? 'bg-red-500/10 text-red-400' : 'bg-app-lime/10 text-app-lime',
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-app-text">{tx.description}</p>
                    <p className="mt-0.5 text-[11px] text-app-muted">
                      {typeLabel[tx.type] ?? tx.type} · {fmtDate(tx.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-[14px] font-bold tabular-nums',
                      debit ? 'text-red-400' : 'text-app-lime',
                    )}
                  >
                    {debit ? '' : '+'}
                    {numFmt.format(tx.amount)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-app-hairline px-4 py-3">
            <span className="text-[12px] text-app-muted">
              {page} / {meta.totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex size-8 items-center justify-center rounded-lg border border-app-hairline text-app-text-2 transition-colors duration-200 ease-app hover:text-app-text disabled:opacity-40"
              >
                <ChevronLeft className="size-4" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="flex size-8 items-center justify-center rounded-lg border border-app-hairline text-app-text-2 transition-colors duration-200 ease-app hover:text-app-text disabled:opacity-40"
              >
                <ChevronRight className="size-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── View ────────────────────────────────────────────────────────────────────

export type ProfileTab = 'account' | 'usage';

export function ProfileView({ initialTab = 'account' }: { initialTab?: ProfileTab }) {
  const t = useTranslations('home');
  const tp = useTranslations('account.profile');
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [tab, setTab] = useState<ProfileTab>(initialTab);
  const [showManageModal, setShowManageModal] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.users.me(accessToken!),
    enabled: !!accessToken,
  });
  const { data: balance } = useQuery({
    queryKey: ['credits', 'balance'],
    queryFn: () => api.credits.balance(accessToken!),
    enabled: !!accessToken,
  });

  const reactivateMutation = useMutation({
    mutationFn: () => api.subscriptions.reactivate(accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      toast.success(tp('reactivateSuccessTitle'));
    },
    onError: () => toast.error(tp('reactivateErrorTitle')),
  });

  const dateLocale = locale === 'pt-BR' ? 'pt-BR' : locale === 'es' ? 'es' : 'en-US';
  const numFmt = useMemo(() => new Intl.NumberFormat(dateLocale), [dateLocale]);

  if (!profile) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-app-lime" strokeWidth={1.8} />
      </div>
    );
  }

  const used = balance?.planCreditsUsed ?? 0;
  const remaining = balance?.planCreditsRemaining ?? 0;
  const totalCr = used + remaining;
  const fraction = totalCr > 0 ? remaining / totalCr : 1;
  const usagePercent = totalCr > 0 ? (used / totalCr) * 100 : 0;

  const plan = profile.plan as Record<string, unknown> | null;
  const planName = (plan?.name as string) || (plan?.planName as string) || null;
  const planSlug = (plan?.slug as string) || null;
  const isFreeUser = planSlug === 'free' || !planSlug;

  const sub = profile.subscription as Record<string, unknown> | null;
  const subStatus = (sub?.status as string) || null;
  const cancelAtPeriodEnd = (sub?.cancelAtPeriodEnd as boolean) || false;
  const subEnd = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd as string).toLocaleDateString(dateLocale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    : null;

  const periodStart = balance
    ? new Date(balance.periodStart).toLocaleDateString(dateLocale, { day: '2-digit', month: 'short' })
    : '';
  const periodEnd = balance
    ? new Date(balance.periodEnd).toLocaleDateString(dateLocale, { day: '2-digit', month: 'short' })
    : '';

  const avatarUrl = typeof profile.avatarUrl === 'string' ? profile.avatarUrl : null;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto scrollbar-app">
      <div className="mx-auto w-full max-w-[1500px] px-6 pb-16 pt-5 sm:pt-7">
        {/* cabeçalho */}
        <div className="app-reveal relative overflow-hidden rounded-[18px] border border-app-hairline bg-app-surface p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-[radial-gradient(circle,rgba(225,29,42,0.12),transparent_65%)]" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <AvatarRing avatarUrl={avatarUrl} name={profile.name} fraction={fraction} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="min-w-0 truncate text-[22px] font-bold tracking-[-0.3px] text-app-text sm:text-[24px]">
                  {profile.name}
                </h1>
                {profile.emailVerified && <BadgeCheck className="size-5 shrink-0 text-app-lime" strokeWidth={2} />}
                {planName && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full border border-app-lime/25 bg-app-lime/10 px-2.5 py-0.5 text-[11px] font-bold text-app-lime">
                    <Crown className="size-3" strokeWidth={2} />
                    {planName}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-[14px] text-app-text-2">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* abas — roláveis no mobile */}
        <div className="mt-6 flex items-center gap-1 overflow-x-auto border-b border-app-hairline [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(['account', 'usage'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                'relative shrink-0 px-3 pb-3 pt-1 text-[14px] font-semibold transition-colors duration-200 ease-app sm:px-4',
                tab === id ? 'text-app-text' : 'text-app-muted hover:text-app-text-2',
              )}
            >
              {t(`profile.tabs.${id}`)}
              {tab === id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-app-lime" />
              )}
            </button>
          ))}
        </div>

        {/* conteúdo — uso */}
        {tab === 'usage' && accessToken && (
          <div className="mt-6">
            <UsageTab accessToken={accessToken} dateLocale={dateLocale} />
          </div>
        )}

        {/* conteúdo — conta */}
        {tab === 'account' && (
          <div className="mt-6 flex flex-col gap-6">
            {/* créditos */}
            {balance && (
              <section>
                <SectionHeader icon={Coins} title={tp('credits')} />
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatTile label={tp('available')} value={numFmt.format(balance.totalCreditsAvailable)} highlight />
                  <StatTile label={tp('fromPlan')} value={isFreeUser ? '30' : numFmt.format(balance.planCreditsRemaining)} />
                  <StatTile label={tp('bonus')} value={numFmt.format(balance.bonusCreditsRemaining)} />
                  <StatTile label={tp('usageInPeriod')} value={`${usagePercent.toFixed(0)}%`} />
                </div>
                <div className="mt-3 rounded-[14px] border border-app-hairline bg-app-surface p-4">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.1em] text-app-muted">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="size-3.5" strokeWidth={1.8} />
                      {tp('usageInPeriod')}
                    </span>
                    <span>{isFreeUser ? tp('daily') : `${periodStart} — ${periodEnd}`}</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-app-hairline-2">
                    <div className="h-full rounded-full bg-app-lime transition-all" style={{ width: `${Math.min(usagePercent, 100)}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] text-app-muted">
                    {tp('creditsUsed', { count: numFmt.format(balance.planCreditsUsed) })}
                  </p>
                </div>
              </section>
            )}

            {/* plano + assinatura — oculto enquanto planos estão desativados */}
            {PLANS_ENABLED && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[14px] border border-app-hairline bg-app-surface p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-app-muted">
                  <Crown className="size-4" strokeWidth={1.8} /> {tp('plan')}
                </div>
                <p className="mt-3 text-[16px] font-bold text-app-text">{planName ?? tp('noActivePlan')}</p>
              </div>
              <div className="rounded-[14px] border border-app-hairline bg-app-surface p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-app-muted">
                  <CreditCard className="size-4" strokeWidth={1.8} /> {tp('subscription')}
                </div>
                {subStatus ? (
                  <div className="mt-3">
                    <p className="text-[15px] font-bold text-app-text capitalize">{subStatus}</p>
                    {subEnd && <p className="mt-0.5 text-[12px] text-app-muted">{tp('renewsOn', { date: subEnd })}</p>}
                  </div>
                ) : (
                  <p className="mt-3 text-[14px] text-app-muted">{tp('noActiveSubscription')}</p>
                )}
              </div>
            </div>
            )}

            {/* gerenciar assinatura — oculto enquanto planos estão desativados */}
            {PLANS_ENABLED && (
            <button
              type="button"
              onClick={() => setShowManageModal(true)}
              className="app-press flex items-center gap-3 rounded-[14px] border border-app-hairline bg-app-surface px-4 py-3.5 text-left transition-colors duration-200 ease-app hover:border-app-hairline-2"
            >
              <Settings className="size-4 shrink-0 text-app-lime" strokeWidth={1.8} />
              <span className="flex-1 text-[14px] font-semibold text-app-text">{tp('manageSubscription')}</span>
              <ExternalLink className="size-4 text-app-muted" strokeWidth={1.8} />
            </button>
            )}

            {/* reativar (cancelamento agendado) */}
            {PLANS_ENABLED && subStatus?.toLowerCase() === 'active' && cancelAtPeriodEnd && (
              <div className="flex flex-col gap-3 rounded-[14px] border border-app-hairline bg-app-surface p-4">
                <p className="text-[14px] font-medium text-app-text-2">{tp('scheduledToCancel')}</p>
                <button
                  type="button"
                  onClick={() => reactivateMutation.mutate()}
                  disabled={reactivateMutation.isPending}
                  className="app-btn flex h-9 w-fit items-center gap-2 bg-app-lime px-4 text-[13px] font-bold text-app-lime-ink disabled:opacity-50"
                >
                  {reactivateMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
                  {tp('reactivateSubscription')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {PLANS_ENABLED && showManageModal && <ManageSubscriptionModal onClose={() => setShowManageModal(false)} />}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: typeof Coins; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-app-lime" strokeWidth={1.8} />
      <h2 className="text-[14px] font-bold text-app-text">{title}</h2>
    </div>
  );
}

function StatTile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-[14px] border p-4',
        highlight ? 'border-app-lime/25 bg-app-lime/[0.06]' : 'border-app-hairline bg-app-surface',
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-app-muted">{label}</p>
      <p className={cn('mt-1.5 text-[22px] font-bold tabular-nums', highlight ? 'text-app-lime' : 'text-app-text')}>
        {value}
      </p>
    </div>
  );
}
