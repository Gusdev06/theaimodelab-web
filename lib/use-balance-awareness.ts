'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { GENERATION_BUCKET_COST } from '@/lib/plans';
import { trackPaywallEvent } from '@/lib/tracking';

export type BalanceStatus = 'ok' | 'low' | 'zero';

/**
 * Low-balance awareness shared by the credit badges (deprecated workspace
 * TopNavbar + the active shell AppTopbar).
 *
 * zero → red "out of credits"; >0 but below a single video → amber warning.
 * Fires a paywall "view" event at most once per session per state (guarded by
 * sessionStorage so it survives re-mounts across both surfaces).
 */
export function useBalanceAwareness({
  credits,
  loading,
  enabled = true,
  surface,
}: {
  /** Current spendable balance. */
  credits: number;
  /** True while the balance is still loading (keeps status 'ok'). */
  loading?: boolean;
  /** Gate the whole thing (e.g. only when a user is signed in). */
  enabled?: boolean;
  /** Where the badge lives, e.g. 'navbar' | 'app_topbar'. */
  surface: string;
}): { balanceStatus: BalanceStatus; balanceTooltip: string | undefined } {
  const tUpsell = useTranslations('editorUpsell.navbar');

  const VIDEO_COST = GENERATION_BUCKET_COST.videos;
  const balanceStatus: BalanceStatus =
    loading || !enabled
      ? 'ok'
      : credits <= 0
        ? 'zero'
        : credits < VIDEO_COST
          ? 'low'
          : 'ok';

  const balanceTooltip =
    balanceStatus === 'zero'
      ? tUpsell('zeroBalance')
      : balanceStatus === 'low'
        ? tUpsell('lowBalance')
        : undefined;

  // Fire a paywall "view" at most once per session per state.
  const balanceTrackedRef = useRef(false);
  useEffect(() => {
    if (balanceStatus === 'ok') return;
    if (balanceTrackedRef.current) return;
    const sessionKey = `theaimodelab-balance-tracked-${balanceStatus}`;
    try {
      if (sessionStorage.getItem(sessionKey)) {
        balanceTrackedRef.current = true;
        return;
      }
      sessionStorage.setItem(sessionKey, '1');
    } catch {
      /* sessionStorage may be unavailable */
    }
    balanceTrackedRef.current = true;
    trackPaywallEvent({
      action: 'view',
      trigger: balanceStatus === 'zero' ? 'zero_balance' : 'low_balance',
      surface,
      creditsAvailable: credits,
      creditsNeeded: VIDEO_COST,
    });
  }, [balanceStatus, credits, VIDEO_COST, surface]);

  return { balanceStatus, balanceTooltip };
}
