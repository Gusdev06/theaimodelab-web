"use client";

import { Instagram, Megaphone, ShoppingBag, Palette } from "lucide-react";
import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

const ITEMS = [
  {
    Icon: Instagram,
    title: "Content creators",
    desc: "Launch your digital influencer and post every day without showing up, without a camera and without hiring anyone. Keep the same face and build a loyal audience.",
  },
  {
    Icon: Megaphone,
    title: "Social media & marketing",
    desc: "Produce unlimited photos and videos for your brands' channels. An AI influencer as the face of the campaign, always with a consistent identity.",
  },
  {
    Icon: ShoppingBag,
    title: "E-commerce & fashion",
    desc: "Create virtual models to wear your products, catalog photos and showcase videos — no photoshoot, no studio and no production costs.",
  },
  {
    Icon: Palette,
    title: "Agencies & studios",
    desc: "Multiply the number of personas without growing your team. Deliver fresh content to multiple clients with a consistent face and its own library.",
  },
];

function Card({
  Icon,
  title,
  desc,
  delay,
}: {
  Icon: typeof Instagram;
  title: string;
  desc: string;
  delay: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="landing-ease group flex gap-4 rounded-2xl border border-[#f3f0ed]/[0.05] bg-landing-card p-6 transition-all duration-500 hover:border-landing-accent/15 sm:p-7"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-landing-accent/15 bg-landing-accent/[0.06]">
        <Icon className="h-5 w-5 text-landing-accent" />
      </div>
      <div>
        <h3 className="font-sora text-[17px] font-semibold text-landing-text sm:text-[18px]">
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-landing-text-secondary">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function InfluencerUseCases() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-16 sm:py-28 lg:py-36">
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
            Who it's for
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            From your first influencer to an agency with dozens of personas.
          </h2>
          <p className="mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]">
            Whatever your goal, the platform scales with you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {ITEMS.map((item, i) => (
            <Card key={item.title} {...item} delay={(i % 2) * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
