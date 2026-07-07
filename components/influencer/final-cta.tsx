"use client";

import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const INITIALS = ["LF", "MC", "RS", "CO", "JP", "AS"];

export function InfluencerFinalCta() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { openLoginModal } = useLoginModal();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="landing-noise relative overflow-hidden py-16 sm:py-28 lg:py-36">
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
            {/* TODO: REPLACE WITH REAL NUMBER */}
            <span className="ml-4 text-[13px] font-medium text-landing-text-muted">
              +2,000 creators already use the platform
            </span>
          </div>

          <h2 className="landing-reveal font-sora text-[26px] font-bold tracking-tight text-landing-text sm:text-3xl lg:text-[48px] lg:leading-[1.1]">
            Ready to create your AI influencer?
          </h2>

          <p
            className="landing-reveal mt-5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-6 sm:text-[17px]"
            style={{ animationDelay: "0.08s" }}
          >
            Join the creators who already bring their digital personas to life
            with a 100% consistent face, photos, videos and voice — all with AI.
          </p>

          {isLoggedIn ? (
            <a
              href="/home"
              className="landing-btn landing-reveal group mt-8 inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:mt-10 sm:px-9 sm:py-4 sm:text-[15px]"
              style={{ animationDelay: "0.16s" }}
            >
              Go to Platform
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal({ mode: "register" })}
              className="landing-btn landing-reveal group mt-8 inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:mt-10 sm:px-9 sm:py-4 sm:text-[15px]"
              style={{ animationDelay: "0.16s" }}
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}

          <p className="mt-5 text-[13px] tracking-wide text-landing-text-muted">
            2-minute setup · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
