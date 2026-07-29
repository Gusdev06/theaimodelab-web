"use client";

import { useTranslations } from "next-intl";
import { useCountUp } from "./use-count-up";
import { Star } from "lucide-react";

/* TODO: SUBSTITUIR POR NÚMEROS REAIS */
const STATS = [
  { value: 1500, labelKey: "creators", prefix: "+" },
  { value: 25000, labelKey: "images", prefix: "+" },
  { value: 5000, labelKey: "videos", prefix: "+" },
  // { value: 49, labelKey: "rating", isRating: true },
] as const;

/* Nomes de modelos/ferramentas são marcas — não passam por i18n. */
const MODELS = [
  "Kling 3.0",
  "Veo 3.1",
  "Sora 2 Pro",
  "Nano Banana",
  "Motion Control",
  "Skin Enhancer",
  "Upscale 4K",
  "ElevenLabs",
];

function Stat({
  value,
  label,
  prefix,
  isRating,
}: {
  value: number;
  label: string;
  prefix?: string;
  isRating?: boolean;
}) {
  const { ref, count } = useCountUp(value);
  const display = isRating
    ? (count / 10).toFixed(1)
    : count.toLocaleString("pt-BR");

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2">
        {isRating && (
          <Star className="h-5 w-5 fill-landing-accent text-landing-accent" />
        )}
        <span className="font-sora text-[24px] font-bold tabular-nums text-landing-text sm:text-[32px]">
          {!isRating && prefix}
          {display}
        </span>
      </div>
      <span className="text-[13px] font-medium tracking-wide text-landing-text-muted">
        {label}
      </span>
    </div>
  );
}

function ModelsTicker() {
  return (
    <div className="landing-mask-x mt-9 overflow-hidden sm:mt-11" aria-hidden="true">
      <div className="landing-marquee-left flex w-max items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {MODELS.map((model) => (
              <span
                key={`${dup}-${model}`}
                className="flex items-center whitespace-nowrap"
              >
                <span className="font-sora text-[13px] font-semibold tracking-[0.12em] text-[#f3f0ed]/30 uppercase sm:text-[14px]">
                  {model}
                </span>
                <span className="mx-6 h-1 w-1 rounded-full bg-landing-accent/50 sm:mx-8" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialProof() {
  const t = useTranslations("socialProof");
  return (
    <section className="relative border-y border-[#f3f0ed]/[0.04] bg-landing-bg-secondary py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="landing-reveal grid grid-cols-2 gap-5 sm:gap-10 md:flex md:items-center md:justify-center md:gap-16 lg:gap-20">
          {STATS.map((s) => (
            <Stat
              key={s.labelKey}
              value={s.value}
              prefix={s.prefix}
              label={t(s.labelKey)}
            />
          ))}
        </div>
      </div>
      <ModelsTicker />
    </section>
  );
}
