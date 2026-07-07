"use client";

import { Clapperboard, Megaphone, ShoppingBag, Building2, type LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const CASES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Clapperboard,
    title: "Content creators",
    desc: "Produce a steady stream of images, videos and voiceovers to keep every channel fed — without a studio or a crew.",
  },
  {
    icon: Megaphone,
    title: "Marketing & social teams",
    desc: "Ship on-brand creatives for ads and social in minutes, and test more variations without waiting on production.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce & product",
    desc: "Generate product visuals, lifestyle scenes and short videos to make listings and campaigns stand out.",
  },
  {
    icon: Building2,
    title: "Agencies & studios",
    desc: "Deliver more work for more clients from a single platform, and cut production cost and turnaround time.",
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
        transitionDelay: `${i * 100}ms`,
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-landing-accent/10 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 text-landing-accent sm:h-6 sm:w-6" />
      </div>
      <h3 className="mt-3.5 font-sora text-[16px] font-semibold text-landing-text sm:mt-5 sm:text-[17px]">
        {title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-landing-text-secondary">
        {desc}
      </p>
    </div>
  );
}

export function BusinessUseCases() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="bg-landing-bg-secondary py-16 sm:py-28 lg:py-36">
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
            Who it&apos;s for
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            Built for anyone who creates
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3.5 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:mt-20 lg:gap-6">
          {CASES.map((c, i) => (
            <Card key={c.title} {...c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
