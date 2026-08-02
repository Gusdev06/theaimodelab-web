'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Coins, Film, Sparkles, Wand2, X } from 'lucide-react';
import { useEditor } from '@/lib/editor-context';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { trackPaywallEvent } from '@/lib/tracking';
import { GENERATION_BUCKET_COST } from '@/lib/plans';

type UpsellAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** Estimated credit cost, shown on the button. */
  cost: number;
  /** Called when the user has enough balance. Should route/prefill the tool. */
  run: () => void;
};

interface PostGenerationUpsellProps {
  /** 'image' → offer Upscale + Animate; 'video' → offer variation. */
  kind: 'image' | 'video';
  /** URL of the media just generated (used to seed the next tool). */
  mediaUrl: string;
  /** Prompt used to create the media (used for the video variation). */
  prompt?: string;
  /** Opens the plans modal when the user can't afford the chosen action. */
  onOpenPlans: () => void;
}

/**
 * Inline, dismissible bar of contextual next-step actions rendered under a
 * freshly generated image/video. Each action reuses an existing tool by opening
 * the matching panel with the media pre-selected. If the user lacks credits for
 * the action, the plans modal opens instead.
 */
export function PostGenerationUpsell({ kind, mediaUrl, prompt, onOpenPlans }: PostGenerationUpsellProps) {
  const t = useTranslations('editorUpsell.postGeneration');
  const [dismissed, setDismissed] = useState(false);
  const { credits, requestPanelWithImage, requestPanelWithPrompt } = useEditor();
  const { accessToken } = useAuth();

  // Estimate the cost of each offered action so the buttons show real numbers.
  const upscaleEstimate = useQuery({
    queryKey: ['credits', 'estimate', 'IMAGE_TO_IMAGE', 'RES_4K', 'NBP', 'UPSCALE'],
    queryFn: () => api.credits.estimate(accessToken!, {
      type: 'IMAGE_TO_IMAGE',
      resolution: 'RES_4K',
      modelVariant: 'NBP',
      freeGenerationType: 'UPSCALE',
    }),
    enabled: !!accessToken && kind === 'image',
    staleTime: 60_000,
  });

  if (dismissed) return null;

  const upscaleCost = upscaleEstimate.data?.creditsRequired ?? GENERATION_BUCKET_COST.images;
  const animateCost = GENERATION_BUCKET_COST.videos;
  const variationCost = GENERATION_BUCKET_COST.videos;

  const actions: UpsellAction[] =
    kind === 'image'
      ? [
          {
            id: 'upscale',
            label: t('image.upscale'),
            icon: <Sparkles className="h-3.5 w-3.5" />,
            cost: upscaleCost,
            run: () => requestPanelWithImage({ panelType: 'upscale', imageUrl: mediaUrl }),
          },
          {
            id: 'animate',
            label: t('image.animate'),
            icon: <Film className="h-3.5 w-3.5" />,
            cost: animateCost,
            run: () => requestPanelWithImage({ panelType: 'generate-video', imageUrl: mediaUrl }),
          },
        ]
      : [
          {
            id: 'variation',
            label: t('video.variation'),
            icon: <Wand2 className="h-3.5 w-3.5" />,
            cost: variationCost,
            run: () => requestPanelWithPrompt({ panelType: 'generate-video', prompt: prompt ?? '' }),
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
    if (!affordable) {
      onOpenPlans();
      return;
    }
    action.run();
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
    <div className="flex items-center gap-1.5 rounded-xl border border-[#f3f0ed]/[0.07] bg-[#f3f0ed]/[0.02] px-2 py-1.5">
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#e11d2a]/25 bg-[#e11d2a]/[0.08] px-2.5 py-1 text-[11px] font-semibold text-[#f3f0ed]/85 transition-all hover:border-[#e11d2a]/45 hover:bg-[#e11d2a]/[0.14] active:scale-95"
          >
            <span className="text-[#e11d2a]">{action.icon}</span>
            {action.label}
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#f3f0ed]/45">
              <Coins className="h-2.5 w-2.5" />
              {t('credits', { count: action.cost })}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={handleDismiss}
        title={t('dismiss')}
        aria-label={t('dismiss')}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#f3f0ed]/30 transition-all hover:bg-[#f3f0ed]/8 hover:text-[#f3f0ed]/70"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
