"use client";

import { useScrollReveal } from "@/components/landing/use-scroll-reveal";

/* TODO: REPLACE WITH REAL TESTIMONIALS */
const ITEMS = [
  {
    name: "Lucas Ferreira",
    handle: "@lucasferreira.ai",
    niche: "Content creator",
    text: "I launched my AI influencer and within a few weeks I already had an engaged audience. The face comes out identical in every generation — no one suspects it's AI.",
    initials: "LF",
  },
  {
    name: "Mariana Costa",
    handle: "@maricosta.digital",
    niche: "Social media",
    text: "I can deliver fresh content every day for the brands I manage, without relying on a photoshoot or a photographer. My production costs dropped drastically.",
    initials: "MC",
  },
  {
    name: "Rafael Souza",
    handle: "@rafasouza.mkt",
    niche: "Marketing agency",
    text: "We create several personas for different clients with a lean team. The face consistency is what makes each influencer feel real.",
    initials: "RS",
  },
  {
    name: "Camila Oliveira",
    handle: "@camilaoliveira.brand",
    niche: "Fashion e-commerce",
    text: "I use the virtual models to dress my products in the catalog. Professional photos and videos with no studio and no photoshoot costs.",
    initials: "CO",
  },
];

function Card({
  item,
  delay,
}: {
  item: (typeof ITEMS)[number];
  delay: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="landing-ease flex flex-col rounded-2xl border border-[#f3f0ed]/[0.05] bg-landing-card p-6 transition-all duration-500 sm:p-7"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <p className="text-[15px] leading-relaxed text-landing-text-secondary">
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-landing-accent/20 bg-landing-accent/[0.1] text-[12px] font-bold text-landing-accent">
          {item.initials}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-landing-text">
            {item.name}
          </p>
          <p className="text-[12px] text-landing-text-muted">
            {item.handle} · {item.niche}
          </p>
        </div>
      </div>
    </div>
  );
}

export function InfluencerTestimonials() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative bg-landing-bg-secondary py-16 sm:py-28 lg:py-36">
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
            What people say about us
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            Real creators. Real influencers.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {ITEMS.map((item, i) => (
            <Card key={item.name} item={item} delay={(i % 2) * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
