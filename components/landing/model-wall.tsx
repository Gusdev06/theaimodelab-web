"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "./use-scroll-reveal";
import { LazyVideo } from "./lazy-video";

/* Vitrine de modelos: uma parede grande de rostos gerados por IA, com alguns
   reels em movimento no meio. A ideia é o mesmo impacto da grade de modelos
   da referência — "olha quantas dá pra criar". Cada célula é uma caixa 3:4,
   então imagem (next/image fill) e vídeo (LazyVideo absoluto) convivem no grid. */
type Tile = { kind: "image"; src: string } | { kind: "video"; src: string };

const TILES: Tile[] = [
  { kind: "image", src: "/midia/models/m1.jpg" },
  { kind: "image", src: "/midia/models/m2.jpg" },
  { kind: "video", src: "/midia/reel-1.mp4" },
  { kind: "image", src: "/midia/models/m3.jpg" },
  { kind: "image", src: "/midia/models/m4.jpg" },
  { kind: "image", src: "/midia/models/m5.jpg" },
  { kind: "video", src: "/midia/reel-2.mp4" },
  { kind: "image", src: "/midia/models/m6.jpg" },
  { kind: "image", src: "/midia/models/m7.jpg" },
  { kind: "image", src: "/midia/models/m8.jpg" },
  { kind: "video", src: "/midia/reel-3.mp4" },
  { kind: "image", src: "/midia/models/m9.jpg" },
  { kind: "image", src: "/midia/models/m10.jpg" },
  { kind: "image", src: "/midia/models/m11.jpg" },
  { kind: "video", src: "/midia/reel-4.mp4" },
  { kind: "image", src: "/midia/models/m12.jpg" },
  { kind: "image", src: "/midia/models/m13.jpg" },
  { kind: "image", src: "/midia/models/m14.jpg" },
  { kind: "video", src: "/midia/reel-5.mp4" },
  { kind: "image", src: "/midia/models/m15.jpg" },
];

export function ModelWall() {
  const t = useTranslations("modelWall");
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="modelos" className="bg-landing-bg py-16 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div
          ref={ref}
          className="landing-ease mx-auto max-w-2xl text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-accent">
            {t("tag")}
          </span>
          <h2 className="landing-reveal mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            {t("title")}
          </h2>
          <p
            className="landing-reveal mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]"
            style={{ animationDelay: "0.08s" }}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Grid de rostos */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {TILES.map((tile, i) => (
            <div
              key={i}
              className="group landing-ease relative aspect-[3/4] overflow-hidden rounded-xl border border-[#f3f0ed]/[0.04] bg-landing-card transition-all duration-400 hover:border-landing-accent/15"
            >
              {tile.kind === "video" ? (
                <LazyVideo src={tile.src} overlay />
              ) : (
                <Image
                  src={tile.src}
                  alt={t("alt", { index: i + 1 })}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
