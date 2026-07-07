import { Check, Coins, Gauge, Layers } from "lucide-react";

const TEST_STEPS = [
  {
    icon: Gauge,
    title: "Commit to one offer",
    body: "Use the quiz result as the first paid model offer. Do not split attention across every possible persona.",
  },
  {
    icon: Layers,
    title: "Produce weekly batches",
    body: "Create enough images, clips and motion tests to judge consistency, speed and cost per usable asset.",
  },
  {
    icon: Coins,
    title: "Choose the monthly plan",
    body: "Pick the plan that matches the production pace from your result, then upgrade only when output becomes the limit.",
  },
];

const PLAN_RULES = [
  "One persona: choose enough capacity to prove identity and the first paid angle.",
  "Several accounts: choose enough capacity for weekly variation, not isolated samples.",
  "Agency offer: choose enough capacity to benchmark multiple personas before selling retainers.",
];

export function QuizOfferBridge() {
  return (
    <section className="relative bg-[#101214] px-4 py-12 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-black uppercase text-landing-accent">
            Next step
          </span>
          <h2 className="mt-3 font-sora text-[26px] font-bold leading-tight text-landing-text sm:text-[42px]">
            Turn the quiz result into a monthly production plan.
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-landing-text-secondary sm:text-[17px]">
            Do not subscribe randomly. Use the first month to prove one model angle with enough output to make a real decision.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-5">
          {TEST_STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-[#f3f0ed]/[0.07] bg-[#f3f0ed]/[0.035] p-4 sm:p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-landing-accent/[0.10] text-landing-accent">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-sora text-[15px] font-bold text-landing-text">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-landing-text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-4 grid max-w-3xl gap-2 sm:mt-6 sm:grid-cols-3">
          {PLAN_RULES.map((rule) => (
            <div
              key={rule}
              className="rounded-lg border border-[#f3f0ed]/[0.06] bg-[#0d0f11] px-3 py-3 text-[12px] font-semibold leading-relaxed text-[#f3f0ed]/60"
            >
              {rule}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-xl border border-landing-accent/15 bg-landing-accent/[0.06] p-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-accent" />
            <p className="text-[13px] font-semibold leading-relaxed text-[#f3f0ed]/75">
              Best first month: enough production capacity for a focused batch, not scattered one-off samples.
            </p>
          </div>
          <a
            href="#precos"
            className="landing-btn inline-flex min-h-11 shrink-0 items-center justify-center bg-landing-accent px-5 text-[13px] font-black text-[#101214]"
          >
            See monthly plans
          </a>
        </div>
      </div>
    </section>
  );
}
