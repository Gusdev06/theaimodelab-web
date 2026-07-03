'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Gift, Coins, ArrowRight, Gem } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FeedbackRewardModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackRewardModal({ open, onClose }: FeedbackRewardModalProps) {
  const router = useRouter();
  const t = useTranslations('feedback.modal');

  const handleAccept = () => {
    onClose();
    router.push('/feedback');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[460px] overflow-hidden border-0 bg-transparent p-0 shadow-none"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#e11d2a]/20 bg-gradient-to-br from-[#1f2a1c] via-[#111113] to-[#111113] p-8">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#e11d2a]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#e11d2a]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e11d2a]/15 ring-1 ring-[#e11d2a]/30">
              <Gift className="h-8 w-8 text-[#e11d2a]" />
            </div>

            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#e11d2a]/30 bg-[#e11d2a]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#e11d2a]">
              <Gem className="h-3 w-3" />
              {t('badge')}
            </div>

            <DialogTitle className="mb-3 text-2xl font-bold text-[#f3f0ed]">
              {t('title')}
            </DialogTitle>

            <DialogDescription className="mb-6 text-[15px] leading-relaxed text-[#f3f0ed]/70">
              {t.rich('description', {
                highlight: (chunks) => (
                  <span className="font-semibold text-[#e11d2a]">{chunks}</span>
                ),
              })}
            </DialogDescription>

            <div className="mb-6 flex w-full items-center gap-3 rounded-xl border border-[#e11d2a]/20 bg-[#e11d2a]/5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e11d2a]/15">
                <Coins className="h-5 w-5 text-[#e11d2a]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-[#f3f0ed]">{t('cardTitle')}</div>
                <div className="text-xs text-[#f3f0ed]/60">{t('cardSubtitle')}</div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Button
                onClick={handleAccept}
                className="group h-11 w-full bg-[#e11d2a] font-semibold text-[#1c1917] shadow-[0_0_24px_rgba(225,29,42,0.35)] hover:bg-[#ff5964] hover:shadow-[0_0_32px_rgba(225,29,42,0.5)]"
              >
                {t('cta')}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="h-10 w-full text-sm text-[#f3f0ed]/50 hover:bg-transparent hover:text-[#f3f0ed]/80"
              >
                {t('dismiss')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
