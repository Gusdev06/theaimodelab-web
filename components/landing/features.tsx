"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  User,
  Move3d,
  Image as ImageIcon,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "./use-scroll-reveal";

type Media =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster?: string }
  | { kind: "beforeAfter"; src: string; beforeSrc?: string; beforeFilter?: string };

const FEATURES: { key: string; icon: LucideIcon; media: Media }[] = [
  {
    key: "influencers",
    icon: User,
    media: {
      kind: "image",
      src: "https://www.promptsgoat.com/en/assets/4963395053896272996.jpg",
    },
  },
  {
    key: "motion",
    icon: Move3d,
    media: {
      kind: "video",
      src: "https://zayraai.com/videos/motion-showcase-3.mp4?v=2",
    },
  },
  {
    key: "imagesHD",
    icon: ImageIcon,
    media: {
      kind: "image",
      src: "https://cdn.geraew.com.br/storage/v1/object/public/ai-generations/generations/cmr3dn6co08utlc0110yinfg5/feffd1b1-fffb-4db2-a370-e22b029b85ce/output_0.jpg",
    },
  },
  {
    key: "videos",
    icon: Video,
    media: {
      kind: "video",
      src: "https://zayraai.com/videos/motion-zaza.mp4",
      poster: "https://zayraai.com/images/motion-zaza-poster.jpg",
    },
  },
];

function LazyVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {visible ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-[#f3f0ed]/[0.03]" />
      )}
    </div>
  );
}

function BeforeAfterSlider({
  src,
  beforeSrc,
  beforeFilter,
  alt,
  beforeLabel,
  afterLabel,
}: {
  src: string;
  beforeSrc?: string;
  beforeFilter?: string;
  alt: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    const updateFromX = (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = ((clientX - rect.left) / rect.width) * 100;
      setPos(Math.max(0, Math.min(100, next)));
    };
    const onMouseMove = (e: MouseEvent) => {
      if (draggingRef.current) updateFromX(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (draggingRef.current && e.touches[0]) updateFromX(e.touches[0].clientX);
    };
    const stop = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stop);
    window.addEventListener("touchcancel", stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stop);
      window.removeEventListener("touchcancel", stop);
    };
  }, []);

  const startFromEvent = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, next)));
    draggingRef.current = true;
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-ew-resize select-none touch-none"
      onMouseDown={(e) => startFromEvent(e.clientX)}
      onTouchStart={(e) => {
        if (e.touches[0]) startFromEvent(e.touches[0].clientX);
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover pointer-events-none"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={beforeSrc ?? src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          style={beforeSrc ? undefined : { filter: beforeFilter }}
        />
      </div>

      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
        {beforeLabel}
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
        {afterLabel}
      </div>

      <div
        className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-white/95 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${pos}%`, transform: "translate(-50%, -50%)" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-black"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-ml-1 text-black"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  media,
  i,
  beforeLabel,
  afterLabel,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  media: Media;
  i: number;
  beforeLabel: string;
  afterLabel: string;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className="group overflow-hidden rounded-2xl border border-[#f3f0ed]/[0.06] bg-landing-card transition-all duration-500 hover:border-landing-accent/15 hover:shadow-[0_0_40px_rgba(225,29,42,0.06)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${i * 80}ms`,
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0e1416]">
        {media.kind === "image" && (
          <Image
            src={media.src}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
        {media.kind === "video" && <LazyVideo src={media.src} poster={media.poster} />}
        {media.kind === "beforeAfter" && (
          <BeforeAfterSlider
            src={media.src}
            beforeSrc={media.beforeSrc}
            beforeFilter={media.beforeFilter}
            alt={title}
            beforeLabel={beforeLabel}
            afterLabel={afterLabel}
          />
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-landing-accent" />
          <h3 className="font-sora text-[16px] font-semibold text-landing-text sm:text-[17px]">
            {title}
          </h3>
        </div>
        <p className="mt-2.5 text-[14px] leading-relaxed text-landing-text-secondary">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function Features() {
  const { ref, isVisible } = useScrollReveal();
  const t = useTranslations("features");

  return (
    <section id="funcionalidades" className="bg-landing-bg-secondary py-16 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          ref={ref}
          className="landing-reveal mx-auto max-w-2xl text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-accent">
            {t("tag")}
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            {t("title")}
          </h2>
          <p className="mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.key}
              icon={f.icon}
              title={t(`items.${f.key}.title`)}
              desc={t(`items.${f.key}.description`)}
              media={f.media}
              i={i}
              beforeLabel={t("beforeLabel")}
              afterLabel={t("afterLabel")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
