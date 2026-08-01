"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "./use-scroll-reveal";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";

const ITEMS: { src: string; type: "image" | "video" }[] = [
  { src: "/midia/reel-1.mp4", type: "video" },
  { src: "/midia/model-4.jpg", type: "image" },
  { src: "/midia/models/m16.jpg", type: "image" },
  { src: "/midia/reel-3.mp4", type: "video" },
  { src: "/midia/model-5.jpg", type: "image" },
  { src: "/midia/models/m17.jpg", type: "image" },
  { src: "/midia/reel-5.mp4", type: "video" },
  { src: "/midia/models/m18.jpg", type: "image" },
  { src: "/midia/models/m19.jpg", type: "image" },
  { src: "/midia/reel-6.mp4", type: "video" },
  { src: "/midia/models/m20.jpg", type: "image" },
  { src: "/midia/models/m21.jpg", type: "image" },
];

function LazyVideo({ src }: { src: string }) {
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
    <div ref={ref} className="h-full w-full">
      {visible ? (
        <video
          src={src}
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

export function Gallery() {
  const t = useTranslations("gallery");
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { openLoginModal } = useLoginModal();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="resultados" className="bg-landing-bg-secondary py-16 sm:py-28 lg:py-36">
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
          <p className="landing-reveal mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]" style={{ animationDelay: "0.08s" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Masonry grid */}
        <div className="mt-8 columns-2 gap-3 sm:mt-12 sm:columns-3 sm:gap-4 lg:gap-5">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="group landing-ease mb-3 overflow-hidden rounded-xl sm:mb-4 border border-[#f3f0ed]/[0.04] bg-landing-card break-inside-avoid transition-all duration-400 hover:border-landing-accent/15 lg:mb-5"
            >
              {item.type === "video" ? (
                <LazyVideo src={item.src} />
              ) : (
                <Image
                  src={item.src}
                  alt={t("alt", { index: i + 1 })}
                  width={400}
                  height={500}
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center sm:mt-14">
          {isLoggedIn ? (
            <a
              href="/home"
              className="group landing-btn inline-flex items-center gap-2.5 bg-landing-accent px-6 py-3 text-[13px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:px-7 sm:py-3.5 sm:text-[14px]"
            >
              {t("ctaLoggedIn")}
              <ArrowRight className="landing-ease h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal({ mode: "register" })}
              className="group landing-btn inline-flex items-center gap-2.5 bg-landing-accent px-6 py-3 text-[13px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:px-7 sm:py-3.5 sm:text-[14px]"
            >
              {t("cta")}
              <ArrowRight className="landing-ease h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
