"use client";

import {
  ImageIcon,
  Video,
  Mic,
  User,
  Sparkles,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: ImageIcon,
    title: "Image generation",
    desc: "Create stunning images from a simple text prompt, or transform and edit the ones you already have.",
  },
  {
    icon: Video,
    title: "Video generation",
    desc: "Produce videos end to end from a single prompt or a reference — no editing suite required.",
  },
  {
    icon: Mic,
    title: "Voice & text-to-speech",
    desc: "Turn any script into natural, expressive narration, or clone a voice from a short sample.",
  },
  {
    icon: User,
    title: "AI avatars",
    desc: "Build talking avatars and put a face and voice to your ideas in minutes.",
  },
  {
    icon: Sparkles,
    title: "Upscale & enhance",
    desc: "Boost quality, sharpness and resolution of any image with a single click.",
  },
  {
    icon: LayoutGrid,
    title: "Prompt library & workspace",
    desc: "Start from ready-made prompts and organize every project on an infinite, collaborative canvas.",
  },
];

function Card({
  icon: Icon,
  title,
  desc,
  i,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  i: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="group landing-ease rounded-2xl border border-[#f3f0ed]/[0.06] bg-landing-card p-5 transition-all duration-500 hover:border-landing-accent/15 hover:shadow-[0_0_40px_rgba(225,29,42,0.06)] sm:p-8"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${i * 80}ms`,
      }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-landing-accent/10 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 text-landing-accent sm:h-6 sm:w-6" />
      </div>
      <h3 className="mt-4 font-sora text-[16px] font-semibold text-landing-text sm:mt-5 sm:text-[17px]">
        {title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-landing-text-secondary">
        {desc}
      </p>
    </div>
  );
}

export function BusinessFeatures() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="features" className="bg-landing-bg-secondary py-16 sm:py-28 lg:py-36">
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
            Everything in one place
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            A complete AI creation toolkit
          </h2>
          <p className="mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]">
            Image, video, voice and avatars — every tool you need to create,
            side by side, with no extra subscriptions.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((f, i) => (
            <Card key={f.title} icon={f.icon} title={f.title} desc={f.desc} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
