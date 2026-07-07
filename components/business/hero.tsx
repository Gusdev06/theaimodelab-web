"use client";

import { ArrowRight, ImageIcon, Video, Mic, User, LayoutGrid, Sparkles, type LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";

const TOOLS: { icon: LucideIcon; label: string }[] = [
  { icon: ImageIcon, label: "Images" },
  { icon: Video, label: "Videos" },
  { icon: Mic, label: "Voice" },
  { icon: User, label: "Avatars" },
  { icon: Sparkles, label: "Upscale" },
  { icon: LayoutGrid, label: "Workspace" },
];

function ToolGrid() {
  return (
    <div className="relative mx-auto mt-16 max-w-3xl sm:mt-20">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[280px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[100px]"
        style={{ background: "rgba(225,29,42,0.10)" }}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {TOOLS.map((tool, i) => (
          <div
            key={tool.label}
            className="landing-reveal group flex flex-col items-start gap-4 rounded-2xl border border-[#f3f0ed]/[0.06] bg-gradient-to-b from-landing-card to-landing-bg p-5 transition-all duration-500 hover:border-landing-accent/20 hover:shadow-[0_0_40px_rgba(225,29,42,0.08)] sm:p-6"
            style={{ animationDelay: `${0.3 + i * 0.07}s` }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-landing-accent/15 bg-landing-accent/[0.07] transition-colors group-hover:bg-landing-accent/[0.12]">
              <tool.icon className="h-5 w-5 text-landing-accent" />
            </div>
            <span className="font-sora text-[15px] font-semibold text-landing-text">
              {tool.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BusinessHero() {
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;
  const { openLoginModal } = useLoginModal();

  return (
    <section className="landing-noise relative overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-28">
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
        <div className="mx-auto flex max-w-[840px] flex-col items-center text-center">
          <div className="landing-shimmer landing-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-landing-accent/20 bg-landing-accent/[0.07] px-4 py-1.5 sm:mb-8">
            <span className="text-[13px] font-medium text-landing-accent">
              One platform. Every AI creation tool.
            </span>
          </div>

          <h1
            className="landing-reveal font-sora text-[32px] leading-[1.05] font-extrabold tracking-[-0.02em] text-landing-text sm:text-[56px] lg:text-[64px]"
            style={{ animationDelay: "0.08s" }}
          >
            Create images, videos, voices and avatars — all with AI.
          </h1>

          <p
            className="landing-reveal mt-5 max-w-[640px] text-[15px] leading-relaxed text-landing-text-secondary sm:mt-7 sm:text-[17px] lg:text-[19px]"
            style={{ animationDelay: "0.16s" }}
          >
            The AI Model Lab is a complete creative studio powered by AI. Generate
            high-quality visuals, produce videos end to end, clone voices, and build
            avatars — no complex software and no scattered subscriptions.
          </p>

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
                Open Platform
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openLoginModal({ mode: "register" })}
                className="landing-btn group inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_8px_24px_rgba(225,29,42,0.24)] sm:px-8 sm:py-4 sm:text-[15px]"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>

          <p
            className="landing-reveal mt-5 text-[13px] tracking-wide text-landing-text-muted"
            style={{ animationDelay: "0.32s" }}
          >
            Your first creation ready in under 2 minutes
          </p>
        </div>

        <ToolGrid />
      </div>
    </section>
  );
}
