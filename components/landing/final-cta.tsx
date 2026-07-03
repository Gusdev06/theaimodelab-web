"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useScrollReveal } from "./use-scroll-reveal";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";

const INITIALS = ["LF", "MC", "RS", "CO", "JP", "AS"];

export function FinalCta() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { openLoginModal } = useLoginModal();
  const { ref, isVisible } = useScrollReveal();
  const t = useTranslations("ctaFinal");

  return (
    <section className="landing-noise relative overflow-hidden py-16 sm:py-28 lg:py-36">
      {/* Background gradient — lime glow from top */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225,29,42,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div
          ref={ref}
          className="mx-auto flex max-w-[680px] flex-col items-center text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(28px)",
          }}
        >
          {/* Stacked avatars */}
          <div className="mb-7 flex items-center sm:mb-10">
            <div className="flex -space-x-2.5">
              {INITIALS.map((init, i) => (
                <div
                  key={init}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-landing-bg bg-landing-accent/15 text-[11px] font-bold text-landing-accent ring-1 ring-landing-accent/20"
                  style={{ zIndex: INITIALS.length - i }}
                >
                  {init}
                </div>
              ))}
            </div>
            {/* TODO: SUBSTITUIR POR NÚMERO REAL */}
            <span className="ml-4 text-[13px] font-medium text-landing-text-muted">
              {t("creatorsUsing")}
            </span>
          </div>

          {/* Headline */}
          <h2 className="landing-reveal font-sora text-[26px] font-bold tracking-tight text-landing-text sm:text-3xl lg:text-[48px] lg:leading-[1.1]">
            {t("title")}
          </h2>

          {/* Sub */}
          <p
            className="landing-reveal mt-5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-6 sm:text-[17px]"
            style={{ animationDelay: "0.08s" }}
          >
            {t("subtitle")}
          </p>

          {/* CTA */}
          {isLoggedIn ? (
            <a
              href="/home"
              className="landing-btn landing-reveal group mt-8 inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:mt-10 sm:px-9 sm:py-4 sm:text-[15px]"
              style={{ animationDelay: "0.16s" }}
            >
              {t("ctaLoggedIn")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal({ mode: "register" })}
              className="landing-btn landing-reveal group mt-8 inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:mt-10 sm:px-9 sm:py-4 sm:text-[15px]"
              style={{ animationDelay: "0.16s" }}
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}

          {/* Microcopy */}
          <p className="mt-5 text-[13px] tracking-wide text-landing-text-muted">
            {t("microcopyShort")}
          </p>
        </div>
      </div>
    </section>
  );
}
