"use client";

import { PencilLine, Wand2, Download } from "lucide-react";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const STEPS = [
  {
    icon: PencilLine,
    step: "01",
    title: "Describe your idea",
    desc: "Type a prompt or upload a reference. Pick the tool — image, video, voice or avatar.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Generate with AI",
    desc: "Our models turn your input into a polished result in seconds. Tweak and regenerate as you like.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download & use it anywhere",
    desc: "Export high-quality files ready for social, ads, stores, or any project you're working on.",
  },
];

function Step({
  icon: Icon,
  step,
  title,
  desc,
  i,
}: {
  icon: typeof PencilLine;
  step: string;
  title: string;
  desc: string;
  i: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="relative rounded-2xl border border-[#f3f0ed]/[0.06] bg-landing-card p-6 transition-all duration-500 sm:p-8"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${i * 100}ms`,
      }}
    >
      <span className="font-sora text-[13px] font-bold text-landing-accent/40">
        {step}
      </span>
      <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-landing-accent/10">
        <Icon className="h-5 w-5 text-landing-accent" />
      </div>
      <h3 className="mt-4 font-sora text-[17px] font-semibold text-landing-text">
        {title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-landing-text-secondary">
        {desc}
      </p>
    </div>
  );
}

export function BusinessHowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how" className="py-16 sm:py-28 lg:py-36">
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
            How it works
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            From idea to result in three steps
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-5 lg:mt-20 lg:gap-6">
          {STEPS.map((s, i) => (
            <Step key={s.step} {...s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
