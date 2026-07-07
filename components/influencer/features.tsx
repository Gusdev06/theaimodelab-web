"use client";

import {
  UserRound,
  Repeat,
  Camera,
  Video,
  Mic,
  Sparkles,
} from "lucide-react";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const ITEMS = [
  {
    Icon: UserRound,
    title: "Create the persona",
    desc: "Generate a hyper-realistic AI influencer with its own face, body, style and personality. Define every detail in a few clicks or start from a ready-made model.",
  },
  {
    Icon: Repeat,
    title: "100% consistent face",
    desc: "Lock your influencer's identity and keep the exact same face across every photo and video. The consistency that builds a recognizable persona.",
  },
  {
    Icon: Camera,
    title: "Full HD photos",
    desc: "Produce professional photos in high definition with realistic lighting, cinematic composition and sharp detail — ready to publish.",
  },
  {
    Icon: Video,
    title: "Ultra-realistic videos",
    desc: "Bring your influencer to life with cinema-quality videos: natural movement, fluid expressions and realistic physics, straight from text.",
  },
  {
    Icon: Mic,
    title: "Its own voice",
    desc: "Give your influencer a unique voice for narrations, lines and audio content — with natural delivery and lip sync.",
  },
  {
    Icon: Sparkles,
    title: "Natural skin & 4K upscale",
    desc: "Remove the artificial AI look with realistic skin texture and upscale any image up to 4K, preserving every detail.",
  },
];

function Card({
  Icon,
  title,
  desc,
  delay,
}: {
  Icon: typeof UserRound;
  title: string;
  desc: string;
  delay: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="landing-ease group rounded-2xl border border-[#f3f0ed]/[0.05] bg-landing-card p-6 transition-all duration-500 hover:border-landing-accent/15 sm:p-7"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-landing-accent/15 bg-landing-accent/[0.06] transition-colors duration-300 group-hover:bg-landing-accent/[0.1]">
        <Icon className="h-5 w-5 text-landing-accent" />
      </div>
      <h3 className="mt-5 font-sora text-[17px] font-semibold text-landing-text sm:text-[18px]">
        {title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-landing-text-secondary">
        {desc}
      </p>
    </div>
  );
}

export function InfluencerFeatures() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="funcionalidades"
      className="relative py-16 sm:py-28 lg:py-36"
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
            Everything to create your influencer
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            A complete studio to bring your AI influencer to life.
          </h2>
          <p className="mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]">
            Consistent face, photos, videos and voice — all with AI, all in one
            place, ready to publish on your channels.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Card key={item.title} {...item} delay={(i % 3) * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
