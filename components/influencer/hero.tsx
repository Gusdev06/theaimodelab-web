"use client";

import { ArrowRight, UserRound, Camera, Video, Mic } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";

const CHIPS = [
  { Icon: UserRound, label: "Consistent face" },
  { Icon: Camera, label: "Full HD photos" },
  { Icon: Video, label: "Ultra-realistic videos" },
  { Icon: Mic, label: "Its own voice" },
];

export function InfluencerHero() {
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;
  const { openLoginModal } = useLoginModal();

  return (
    <section className="landing-noise relative overflow-hidden pt-24 pb-16 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-32">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(225,29,42,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 20%, rgba(225,29,42,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          {/* Badge */}
          <div className="landing-shimmer landing-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-landing-accent/20 bg-landing-accent/[0.07] px-4 py-1.5 sm:mb-8">
            <span className="text-[13px] font-medium text-landing-accent">
              Create AI influencers from scratch
            </span>
          </div>

          {/* Headline */}
          <h1
            className="landing-reveal font-sora text-[32px] leading-[1.05] font-extrabold tracking-[-0.02em] text-landing-text sm:text-[56px] lg:text-[68px]"
            style={{ animationDelay: "0.08s" }}
          >
            Create your own{" "}
            <span className="text-landing-accent">AI influencer</span>.
          </h1>

          {/* Sub-headline */}
          <p
            className="landing-reveal mt-5 max-w-[640px] text-[15px] leading-relaxed text-landing-text-secondary sm:mt-7 sm:text-[17px] lg:text-[19px]"
            style={{ animationDelay: "0.16s" }}
          >
            Build a hyper-realistic digital persona with a 100% consistent face
            and produce photos, videos and voice with AI — all in one place. No
            camera, no studio and no need to show your face.
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
                Go to Platform
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openLoginModal({ mode: "register" })}
                className="landing-btn group inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_8px_24px_rgba(225,29,42,0.24)] sm:px-8 sm:py-4 sm:text-[15px]"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>

          {/* Microcopy */}
          <p
            className="landing-reveal mt-5 text-[13px] tracking-wide text-landing-text-muted"
            style={{ animationDelay: "0.32s" }}
          >
            Your first influencer ready in under 2 minutes
          </p>

          {/* Capability chips — replaces the image cards */}
          <div
            className="landing-reveal mt-14 grid w-full max-w-[720px] grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-4 sm:gap-4"
            style={{ animationDelay: "0.4s" }}
          >
            {CHIPS.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-[#f3f0ed]/[0.06] bg-gradient-to-b from-landing-card to-landing-bg px-4 py-6 shadow-xl"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-landing-accent/15 bg-landing-accent/[0.07]">
                  <Icon className="h-5 w-5 text-landing-accent" />
                </div>
                <span className="text-[13px] font-medium text-landing-text-secondary">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
