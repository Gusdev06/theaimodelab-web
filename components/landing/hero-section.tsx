"use client";

import { ArrowRight, Check } from "lucide-react";
import { useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";
import { useTranslations } from "next-intl";
import { LazyVideo } from "./lazy-video";
import { HeroVsl } from "./hero-vsl";

const HERO_VIDEOS = [
  "https://cdn.geraew.com.br/storage/v1/object/public/ai-generations/generations/cmmo0y3ig001pmj012ef18i2x/f8b501b1-404e-4f90-80e5-6369dd0a1c85/output_1.mp4",
  "https://cdn.geraew.com.br/storage/v1/object/public/ai-generations/utils/hf_20260215_062116_c9ddf0ba-3933-4775-a153-416f3a4ceba2.mp4",
  "https://cdn.geraew.com.br/storage/v1/object/public/ai-generations/utils/hf_20260201_001035_5d855ac6-5faf-4ec9-ad55-5b8b3c6c8b27.mp4",
  "https://cdn.geraew.com.br/storage/v1/object/public/ai-generations/generations/cmnb7rni6004qli01djg36ikq/79f3dded-b759-487e-90d3-3ba02d3decda/output_0.mp4",
  "https://cdn.geraew.com.br/storage/v1/object/public/ai-generations/utils/output_0%20(1).mp4",
  "https://cdn.geraew.com.br/storage/v1/object/public/ai-generations/utils/hf_20260304_053449_2ac62494-bf74-454e-8c64-9b04f658037a.mp4",
];

/* Parede de conteúdo do desktop: duas colunas em marquee vertical, sentidos
   opostos — a metáfora visual da "esteira de conteúdo" que o produto vende. */
const WALL_COLUMNS: { videos: string[]; heights: string[]; dir: "up" | "down" }[] = [
  {
    videos: [HERO_VIDEOS[0], HERO_VIDEOS[2], HERO_VIDEOS[4]],
    heights: ["h-72", "h-80", "h-64"],
    dir: "up",
  },
  {
    videos: [HERO_VIDEOS[1], HERO_VIDEOS[3], HERO_VIDEOS[5]],
    heights: ["h-64", "h-72", "h-80"],
    dir: "down",
  },
];

function WallCard({ video, height }: { video: string; height: string }) {
  return (
    <div
      className={`relative w-full ${height} shrink-0 overflow-hidden rounded-2xl border border-[#f3f0ed]/[0.06] bg-gradient-to-b from-landing-card to-landing-bg shadow-2xl`}
    >
      <LazyVideo src={video} overlay />
    </div>
  );
}

function ContentWall() {
  return (
    <div className="relative hidden lg:block" aria-hidden="true">
      {/* Glow behind the wall */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[420px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[110px]"
        style={{ background: "rgba(225,29,42,0.1)" }}
      />

      <div className="landing-mask-y flex h-[640px] gap-5 overflow-hidden">
        {WALL_COLUMNS.map((col, ci) => (
          <div key={ci} className="w-[230px] overflow-hidden">
            <div
              className={`flex flex-col gap-5 ${
                col.dir === "up" ? "landing-marquee-up" : "landing-marquee-down"
              }`}
            >
              {[0, 1].map((dup) => (
                <div key={dup} className="flex flex-col gap-5" aria-hidden={dup === 1}>
                  {col.videos.map((video, vi) => (
                    <WallCard key={vi} video={video} height={col.heights[vi]} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateScales = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = Array.from(container.children) as HTMLElement[];

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      const maxDistance = container.clientWidth * 0.45;
      const t = Math.min(distance / maxDistance, 1);
      const scale = 1 - t * 0.22;
      const opacity = 1 - t * 0.4;
      card.style.transform = `scale(${scale})`;
      card.style.opacity = String(opacity);
    });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Scroll to center on the 3rd card (index 2)
    requestAnimationFrame(() => {
      const middleCard = container.children[2] as HTMLElement;
      if (middleCard) {
        container.scrollLeft =
          middleCard.offsetLeft -
          (container.clientWidth - middleCard.clientWidth) / 2;
      }
      updateScales();
    });

    container.addEventListener("scroll", updateScales, { passive: true });
    return () => container.removeEventListener("scroll", updateScales);
  }, [updateScales]);

  return (
    <div className="relative mt-14 lg:hidden">
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto"
        style={{
          paddingLeft: "calc(50% - 75px)",
          paddingRight: "calc(50% - 75px)",
        }}
      >
        {HERO_VIDEOS.map((video, i) => (
          <div
            key={i}
            className="relative shrink-0 snap-center overflow-hidden rounded-2xl border border-[#f3f0ed]/[0.06] bg-gradient-to-b from-landing-card to-landing-bg shadow-2xl will-change-transform"
            style={{ width: 150, height: 240 }}
          >
            <LazyVideo src={video} overlay />
          </div>
        ))}
      </div>

      {/* Glow behind carousel */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[80px]"
        style={{ background: "rgba(225,29,42,0.08)" }}
      />
    </div>
  );
}

export function HeroSection() {
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;
  const { openLoginModal } = useLoginModal();
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  function scrollToPricing(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const el = document.querySelector("#precos");
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  }

  const trustItems = [t("trust1"), t("trust2"), t("trust3")];

  return (
    <section className="landing-noise relative overflow-hidden pt-24 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      {/* Radial glow — brand energy from top-left, following the copy */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 25% 0%, rgba(225,29,42,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 30%, rgba(225,29,42,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_485px] lg:items-center lg:gap-14 xl:gap-20">
          {/* Copy — centered on mobile, left-aligned on desktop */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <div className="landing-shimmer landing-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-landing-accent/20 bg-landing-accent/[0.07] px-4 py-1.5 sm:mb-8">
              <span className="text-[13px] font-medium text-landing-accent">
                {t("badge")}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="landing-reveal bg-gradient-to-b from-landing-text to-landing-text/70 bg-clip-text font-sora text-[34px] leading-[1.05] font-extrabold tracking-[-0.02em] text-transparent sm:text-[52px] lg:text-[56px] xl:text-[62px]"
              style={{ animationDelay: "0.08s" }}
            >
              {t("title")}
            </h1>

            {/* VSL — renders only on /en */}
            <HeroVsl />

            {/* Sub-headline */}
            <p
              className="landing-reveal mt-5 max-w-[620px] text-[15px] leading-relaxed text-landing-text-secondary sm:mt-7 sm:text-[17px] lg:max-w-[540px] lg:text-[18px]"
              style={{ animationDelay: "0.16s" }}
            >
              {t("subtitle")}
            </p>

            {/* CTA */}
            <div
              className="landing-reveal mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:gap-5"
              style={{ animationDelay: "0.24s" }}
            >
              {loading ? (
                <div className="h-12 w-44 animate-pulse rounded-full bg-landing-text/8 sm:h-[52px] sm:w-48" />
              ) : isLoggedIn ? (
                <a
                  href="/home"
                  className="landing-btn group inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_8px_24px_rgba(225,29,42,0.24)] sm:px-8 sm:py-4 sm:text-[15px]"
                >
                  {tNav("accessPlatform")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openLoginModal({ mode: "register" })}
                    className="landing-btn group inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_8px_24px_rgba(225,29,42,0.24)] sm:px-8 sm:py-4 sm:text-[15px]"
                  >
                    {t("cta")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                  <a
                    href="#precos"
                    onClick={scrollToPricing}
                    className="landing-ease rounded-full border border-[#f3f0ed]/[0.1] px-7 py-3.5 text-[14px] font-medium text-[#f3f0ed]/70 transition-all duration-300 hover:border-[#f3f0ed]/[0.2] hover:text-[#f3f0ed] sm:px-8 sm:py-4 sm:text-[15px]"
                  >
                    {t("ctaSecondary")}
                  </a>
                </>
              )}
            </div>

            {/* Microcopy */}
            <p
              className="landing-reveal mt-5 text-[13px] tracking-wide text-landing-text-muted"
              style={{ animationDelay: "0.32s" }}
            >
              {t("microcopy")}
            </p>

            {/* Trust chips */}
            <div
              className="landing-reveal mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:mt-7 lg:justify-start"
              style={{ animationDelay: "0.4s" }}
            >
              {trustItems.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-[12px] text-landing-text-muted sm:text-[13px]"
                >
                  <Check className="h-3.5 w-3.5 text-landing-accent/70" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Desktop: content assembly-line wall */}
          <ContentWall />
        </div>

        {/* Mobile: swipeable carousel */}
        <HeroCarousel />
      </div>
    </section>
  );
}
