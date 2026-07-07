"use client";

import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";

export function BusinessFinalCta() {
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
          <h2 className="landing-reveal font-sora text-[26px] font-bold tracking-tight text-landing-text sm:text-3xl lg:text-[48px] lg:leading-[1.1]">
            Start creating with AI today
          </h2>

          <p
            className="landing-reveal mt-5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-6 sm:text-[17px]"
            style={{ animationDelay: "0.08s" }}
          >
            Every tool you need in one place. Try it free and see your first
            creation come to life in minutes.
          </p>

          {isLoggedIn ? (
            <a
              href="/home"
              className="landing-btn landing-reveal group mt-8 inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:mt-10 sm:px-9 sm:py-4 sm:text-[15px]"
              style={{ animationDelay: "0.16s" }}
            >
              Open Platform
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal({ mode: "register" })}
              className="landing-btn landing-reveal group mt-8 inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:mt-10 sm:px-9 sm:py-4 sm:text-[15px]"
              style={{ animationDelay: "0.16s" }}
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}

          <p className="mt-5 text-[13px] tracking-wide text-landing-text-muted">
            No credit card required to start
          </p>
        </div>
      </div>
    </section>
  );
}
