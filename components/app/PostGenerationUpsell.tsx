'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Coins, Film, Sparkles, Wand2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { trackPaywallEvent } from '@/lib/tracking';
import { GENERATION_BUCKET_COST } from '@/lib/plans';

type UpsellAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** Custo estimado em créditos, exibido no botão. */
  cost: number;
  /** Rota da tool com a mídia pré-carregada. */
  href: string;
};

interface PostGenerationUpsellProps {
  /** 'image' → Upscale + Animar; 'video' → variação. */
  kind: 'image' | 'video';
  /** URL da mídia recém-gerada (semeia a próxima tool). */
  mediaUrl: string;
  /** Prompt usado (para a variação de vídeo). */
  prompt?: string;
  /** Chamado antes de navegar (ex.: fechar o lightbox que contém a barra). */
  onNavigate?: () => void;
}

/**
 * Barra inline dismissível de próximos passos, no estilo clean do shell novo,
 * exibida sob uma criação recém-gerada (dentro do lightbox das telas de geração).
 * Cada ação reabre a tool certa com a mídia pré-carregada via querystring.
 * Sem saldo para a ação: dispara o evento de paywall e leva aos créditos.
 */
export function PostGenerationUpsell({ kind, mediaUrl, prompt, onNavigate }: PostGenerationUpsellProps) {
  const t = useTranslations('editorUpsell.postGeneration');
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const { user, accessToken } = useAuth();

  // saldo atual — para decidir se a ação é custeável antes de navegar
  const { data: balance } = useQuery({
    queryKey: ['credits', 'balance'],
    queryFn: () => api.credits.balance(accessToken!),
    enabled: !!accessToken && !!user,
    staleTime: 30_000,
  });
  const credits = balance?.totalCreditsAvailable ?? 0;

  // custo do upscale 4K (mesma estimativa do painel de upscale da UI nova)
  const upscaleEstimate = useQuery({
    queryKey: ['credits', 'estimate', 'IMAGE_TO_IMAGE', 'RES_2K', 'NBP', 'UPSCALE'],
    queryFn: () =>
      api.credits.estimate(accessToken!, {
        type: 'IMAGE_TO_IMAGE',
        resolution: 'RES_2K',
        modelVariant: 'NBP',
        freeGenerationType: 'UPSCALE',
      }),
    enabled: !!accessToken && !!user && kind === 'image',
    staleTime: 60_000,
  });

  if (dismissed) return null;

  const ref = encodeURIComponent(mediaUrl);
  const upscaleCost = upscaleEstimate.data?.creditsRequired ?? GENERATION_BUCKET_COST.images;
  const animateCost = GENERATION_BUCKET_COST.videos;
  const variationCost = GENERATION_BUCKET_COST.videos;

  const actions: UpsellAction[] =
    kind === 'image'
      ? [
          {
            id: 'upscale',
            label: t('image.upscale'),
            icon: <Sparkles className="size-3.5" strokeWidth={2} />,
            cost: upscaleCost,
            href: `/image?tool=upscale&ref=${ref}`,
          },
          {
            id: 'animate',
            label: t('image.animate'),
            icon: <Film className="size-3.5" strokeWidth={2} />,
            cost: animateCost,
            href: `/video?ref=${ref}`,
          },
        ]
      : [
          {
            id: 'variation',
            label: t('video.variation'),
            icon: <Wand2 className="size-3.5" strokeWidth={2} />,
            cost: variationCost,
            href: `/video?prompt=${encodeURIComponent(prompt ?? '')}`,
          },
        ];

  const handleClick = (action: UpsellAction) => {
    const affordable = credits >= action.cost;
    trackPaywallEvent({
      action: 'click',
      trigger: 'post_generation_upsell',
      surface: kind === 'image' ? 'generate_image' : 'generate_video',
      toolType: action.id,
      creditsNeeded: action.cost,
      creditsAvailable: credits,
      targetId: action.id,
    });
    // fecha o lightbox antes de navegar — na mesma rota o overlay não desmonta sozinho
    onNavigate?.();
    router.push(affordable ? action.href : '/creditos');
  };

  const handleDismiss = () => {
    setDismissed(true);
    trackPaywallEvent({
      action: 'dismiss',
      trigger: 'post_generation_upsell',
      surface: kind === 'image' ? 'generate_image' : 'generate_video',
      creditsAvailable: credits,
    });
  };

  return (
    <div className="flex w-0 min-w-full items-center gap-2 rounded-[14px] border border-app-hairline bg-app-card px-3 py-2.5">
      <span className="shrink-0 pr-1 text-[12px] font-semibold text-app-text-2">{t('heading')}</span>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleClick(action)}
            className="app-press inline-flex items-center gap-1.5 rounded-full border border-app-hairline-2 bg-app-surface px-3 py-1.5 text-[12.5px] font-semibold text-app-text transition-colors duration-200 ease-app hover:border-[rgba(225,29,42,0.4)] hover:bg-app-card-hover"
          >
            <span className="text-app-lime">{action.icon}</span>
            {action.label}
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-app-muted">
              <Coins className="size-3" strokeWidth={2} />
              {t('credits', { count: action.cost })}
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        title={t('dismiss')}
        aria-label={t('dismiss')}
        className="flex size-6 shrink-0 items-center justify-center rounded-full text-app-muted transition-colors duration-200 ease-app hover:bg-app-surface hover:text-app-text"
      >
        <X className="size-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
