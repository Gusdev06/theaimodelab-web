"use client";

import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const STEPS = [
  {
    n: "01",
    title: "Create your influencer",
    desc: "Pick a model from the gallery or generate a brand-new persona. Define face, body, style and personality in a few clicks.",
  },
  {
    n: "02",
    title: "Generate the content",
    desc: "Choose scene, pose, outfit and movement. Use ready-made prompts or write your own. Photos, videos and voice — always the same face.",
  },
  {
    n: "03",
    title: "Publish to your channels",
    desc: "Download in high quality, ready for Instagram, TikTok, YouTube or any network. No watermark on paid plans.",
  },
];

export function InfluencerHowItWorks() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { openLoginModal } = useLoginModal();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="como-funciona"
      className="relative bg-landing-bg-secondary py-16 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          ref={ref}
          className="landing-ease mx-auto max-w-2xl text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-accent">
            As simple as that
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            From idea to a ready influencer in 3 steps.
          </h2>
          <p className="mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]">
            You don't need any experience with AI, editing or design. The
            platform does the heavy lifting for you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-3 md:gap-6">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-[#f3f0ed]/[0.05] bg-landing-card p-7 sm:p-8"
            >
              <span className="font-sora text-[40px] font-extrabold leading-none text-landing-accent/20 sm:text-[52px]">
                {s.n}
              </span>
              <h3 className="mt-4 font-sora text-[18px] font-semibold text-landing-text sm:text-[20px]">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-landing-text-secondary">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:mt-14">
          {isLoggedIn ? (
            <a
              href="/home"
              className="landing-btn group inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:text-[15px]"
            >
              Go to Platform
              <ArrowRight className="landing-ease h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal({ mode: "register" })}
              className="landing-btn group inline-flex items-center gap-2.5 bg-landing-accent px-7 py-3.5 text-[14px] font-bold text-landing-bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.2)] sm:text-[15px]"
            >
              Create my first influencer
              <ArrowRight className="landing-ease h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
