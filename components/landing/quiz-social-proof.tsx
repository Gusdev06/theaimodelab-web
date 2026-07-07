import { ArrowRight, BadgeDollarSign, Bell, Check, ImageIcon, Play, Shirt, Smile, Dumbbell, MapPin } from "lucide-react";

const MARKET_PROOFS = [
  {
    label: "Creator dashboard",
    metric: "$8,062.95",
    detail: "all-time earnings shown in the screenshot",
    note: "$3,120.04 month shown beside it",
  },
  {
    label: "Creator dashboard",
    metric: "$4,888.94",
    detail: "all-time earnings shown in the screenshot",
    note: "$2,014.91 month shown beside it",
  },
  {
    label: "Creator dashboard",
    metric: "$10,621.10",
    detail: "all-time earnings shown in the screenshot",
    note: "$5,678.19 month shown beside it",
  },
  {
    label: "Payment notifications",
    metric: "$81k+",
    detail: "balance visible across Fanvue notifications",
    note: "$80, $50, $15 and smaller payments stacked",
  },
];

const SAFE_EXAMPLES = [
  {
    icon: ImageIcon,
    title: "Profile photos",
    body: "Clean headshots, consistent face, believable creator identity.",
  },
  {
    icon: Play,
    title: "UGC-style videos",
    body: "Short clips that feel native to social feeds and landing pages.",
  },
  {
    icon: Shirt,
    title: "Looks and outfits",
    body: "Different wardrobe directions without changing the model identity.",
  },
  {
    icon: MapPin,
    title: "Locations",
    body: "Bedroom, studio, gym, street and lifestyle scenes without explicit content.",
  },
  {
    icon: Dumbbell,
    title: "Fitness and health",
    body: "Aspirational lifestyle sets for safer audience-building content.",
  },
  {
    icon: Smile,
    title: "Facial expressions",
    body: "Variation in mood and expression while keeping the same character.",
  },
];

export function QuizSocialProof() {
  return (
    <section className="relative bg-[#101214] px-4 py-12 sm:px-8 sm:py-18">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-landing-accent/20 bg-landing-accent/[0.08] px-3 py-1 text-[10px] font-black uppercase text-landing-accent">
              <BadgeDollarSign className="h-3.5 w-3.5" />
              Market proof
            </span>
            <h2 className="mt-4 font-sora text-[28px] font-bold leading-tight text-landing-text sm:text-[42px]">
              The market is not buying “AI”. It is buying output that can be posted, tested and sold.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-landing-text-secondary sm:text-[16px]">
              The screenshots you shared point to the same bottleneck: revenue comes after consistent characters, repeatable content and enough weekly volume to test what buyers respond to.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {MARKET_PROOFS.map((proof) => (
              <div
                key={`${proof.metric}-${proof.note}`}
                className="rounded-xl border border-[#f3f0ed]/[0.08] bg-[#171a1d] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase text-[#f3f0ed]/45">
                      {proof.label}
                    </p>
                    <p className="mt-2 font-sora text-[26px] font-bold text-landing-text">
                      {proof.metric}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.10] text-emerald-300">
                    <Bell className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-[12px] font-semibold leading-relaxed text-[#f3f0ed]/65">
                  {proof.detail}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#f3f0ed]/35">
                  {proof.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-[#f3f0ed]/[0.07] bg-[#0d0f11] p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[11px] font-black uppercase text-landing-accent">
                Safe examples to produce first
              </span>
              <h3 className="mt-2 font-sora text-[22px] font-bold text-landing-text sm:text-[30px]">
                Start with non-explicit assets that prove the model can look real.
              </h3>
            </div>
            <a
              href="#ai-model-sales-quiz"
              className="inline-flex min-h-10 items-center gap-2 text-[13px] font-black text-landing-accent"
            >
              Match my offer
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SAFE_EXAMPLES.map((example) => (
              <div
                key={example.title}
                className="rounded-lg border border-[#f3f0ed]/[0.06] bg-[#f3f0ed]/[0.035] p-3.5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-landing-accent/[0.10] text-landing-accent">
                    <example.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-sora text-[14px] font-bold text-landing-text">
                      {example.title}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold leading-relaxed text-[#f3f0ed]/55">
                      {example.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-lg border border-landing-accent/15 bg-landing-accent/[0.06] p-3.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-accent" />
            <p className="text-[12px] font-semibold leading-relaxed text-[#f3f0ed]/70">
              Use these safe examples to validate identity and content quality first. Keep adult-specific execution out of the quiz and move only when the model identity already works.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
