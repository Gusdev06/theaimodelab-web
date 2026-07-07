"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  DollarSign,
  Layers,
  LineChart,
  Mail,
  Sparkles,
  Target,
  User,
  Video,
  type LucideIcon,
} from "lucide-react";
import { captureMarketingLead, trackLeadEvent, trackViewContent } from "@/lib/tracking";

type QuestionId = "operation" | "bottleneck" | "scale";
type Answers = Partial<Record<QuestionId, string>>;

type QuizOption = {
  value: string;
  label: string;
  helper: string;
};

type QuizQuestion = {
  id: QuestionId;
  eyebrow: string;
  title: string;
  options: QuizOption[];
};

type ResultKey = "identity" | "volume" | "margin" | "agency";

type QuizResult = {
  key: ResultKey;
  icon: LucideIcon;
  badge: string;
  headline: string;
  mirror: string;
  offer: string;
  proof: string;
  productionPlan: string;
  firstWeek: string;
  planHint: string;
  bullets: string[];
};

const QUESTIONS: QuizQuestion[] = [
  {
    id: "operation",
    eyebrow: "1/3",
    title: "Where will the first AI model revenue come from?",
    options: [
      {
        value: "solo",
        label: "One paid persona",
        helper: "I need one believable model that can start earning.",
      },
      {
        value: "operator",
        label: "A small model operation",
        helper: "I need enough output to feed several accounts.",
      },
      {
        value: "agency",
        label: "A model factory offer",
        helper: "I want to sell repeatable AI model production to clients.",
      },
    ],
  },
  {
    id: "bottleneck",
    eyebrow: "2/3",
    title: "What is most likely to make the buyer say yes?",
    options: [
      {
        value: "identity",
        label: "Believable identity",
        helper: "Same face, same vibe, no obvious AI drift.",
      },
      {
        value: "volume",
        label: "Daily content supply",
        helper: "Photos, clips and motion without waiting on shoots.",
      },
      {
        value: "margin",
        label: "Lower production cost",
        helper: "Stop paying scattered tools before revenue is proven.",
      },
      {
        value: "speed",
        label: "Speed to first test",
        helper: "Get one sellable concept live before overbuilding.",
      },
    ],
  },
  {
    id: "scale",
    eyebrow: "3/3",
    title: "What production pace can you actually commit to?",
    options: [
      {
        value: "validate",
        label: "Validate one model",
        helper: "Find the face, niche and first paid angle.",
      },
      {
        value: "portfolio",
        label: "Compare 3-5 models",
        helper: "Benchmark concepts and keep the winners.",
      },
      {
        value: "machine",
        label: "Feed 6-15 accounts",
        helper: "Build a repeatable production workflow.",
      },
      {
        value: "agency",
        label: "Sell the agency offer",
        helper: "Standardize personas, prompts, clips and delivery.",
      },
    ],
  },
];

const RESULTS: Record<ResultKey, QuizResult> = {
  identity: {
    key: "identity",
    icon: Target,
    badge: "Identity offer",
    headline: "Start with the identity offer: one model people can believe.",
    mirror: "The buyer does not need a giant operation yet. They need proof that one character can look consistent enough to sell.",
    offer: "Sell a launch pack: face system, visual niche, first paid angles and reusable prompts for one AI model.",
    proof: "The value is recognizability. If the face drifts, the offer dies before content volume matters.",
    productionPlan: "Pick a monthly plan that lets you produce identity tests, 20-30 usable images and first short clips without switching tools.",
    firstWeek: "Day 1-2: lock face and visual niche. Day 3-5: produce the first content set. Day 6-7: test which angle gets saves, clicks or paid interest.",
    planHint: "Best fit: Creator or Pro if this is the first monetized persona.",
    bullets: ["Consistent face", "Paid niche angle", "Reusable prompt set"],
  },
  volume: {
    key: "volume",
    icon: Video,
    badge: "Content engine",
    headline: "Sell the content engine: daily output without daily shoots.",
    mirror: "Your strongest buyer cares about keeping accounts fed, not about owning another prompt box.",
    offer: "Sell a 30-day content engine: images, motion, clips and variations for every active model.",
    proof: "The buyer pays for freshness, speed and fewer production handoffs.",
    productionPlan: "Choose a monthly plan with enough credits to produce multiple angles per model every week, not one-off samples.",
    firstWeek: "Day 1: choose content pillars. Day 2-4: produce feed and motion variations. Day 5-7: publish, measure saves, replies and subscription intent.",
    planHint: "Best fit: Pro or Advanced if you are feeding more than one active account.",
    bullets: ["Daily feed", "Motion angles", "Lean production"],
  },
  margin: {
    key: "margin",
    icon: DollarSign,
    badge: "Margin play",
    headline: "Sell the margin play: one production stack before the model scales.",
    mirror: "The buyer is tired of paying separate tools before a persona has proven revenue.",
    offer: "Sell a single-stack AI model test that covers image, video, motion and upscale work in one workflow.",
    proof: "Lower fixed cost means more concepts tested before committing to a larger account build.",
    productionPlan: "Start on the lowest monthly plan that can produce a real batch, then upgrade only after the winner is obvious.",
    firstWeek: "Day 1: list the tools you replace. Day 2-5: produce one complete batch inside one stack. Day 6-7: compare cost per usable asset.",
    planHint: "Best fit: Creator for one concept, Pro once output volume becomes the constraint.",
    bullets: ["One stack", "Lower fixed cost", "More tests"],
  },
  agency: {
    key: "agency",
    icon: Layers,
    badge: "Model factory",
    headline: "Sell the model factory: a repeatable system for many personas.",
    mirror: "This buyer is not buying one character. They are buying a production machine they can resell.",
    offer: "Sell a model factory: persona creation, content templates, motion workflow, export standards and delivery rhythm.",
    proof: "Agencies win when output scales without hiring a bigger production team.",
    productionPlan: "Use a higher monthly plan to benchmark multiple personas and know cost per usable asset before selling retainers.",
    firstWeek: "Day 1: define the model factory offer. Day 2-5: benchmark 3 personas. Day 6-7: package delivery standards and retainer pricing.",
    planHint: "Best fit: Advanced or Studio if the offer is for clients or multiple accounts.",
    bullets: ["Many personas", "Delivery rhythm", "Agency margin"],
  },
};

const STAGE_COUNT = 5;

const ASPIRATIONAL_PROOF = [
  {
    label: "Identity",
    quote: "I can show one model with the same face, not a folder of random AI images.",
  },
  {
    label: "Output",
    quote: "I know what to produce this week instead of guessing prompts every day.",
  },
  {
    label: "Offer",
    quote: "I have a first package to sell before I build a full model factory.",
  },
];

function resolveResult(answers: Answers): QuizResult {
  if (answers.operation === "agency" || answers.scale === "agency") return RESULTS.agency;
  if (answers.bottleneck === "identity") return RESULTS.identity;
  if (answers.bottleneck === "margin") return RESULTS.margin;
  return RESULTS.volume;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function displayName(value: string): string {
  const normalized = normalizeName(value);
  if (!normalized) return "you";
  return normalized[0].toUpperCase() + normalized.slice(1);
}

export function SalesQuiz() {
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [leadTracked, setLeadTracked] = useState(false);
  const leadTrackedRef = useRef(false);
  const trackedStartRef = useRef(false);
  const result = useMemo(() => resolveResult(answers), [answers]);
  const progress = Math.min(((stage + 1) / STAGE_COUNT) * 100, 100);

  useEffect(() => {
    if (trackedStartRef.current) return;
    trackedStartRef.current = true;
    trackViewContent({
      content_name: "ai_model_sales_quiz",
      content_category: "sales_quiz",
      quiz_stage: "first_question",
    });
  }, []);

  const currentQuestion =
    stage === 0 ? QUESTIONS[0] : stage === 1 ? QUESTIONS[1] : stage === 3 ? QUESTIONS[2] : null;
  const ResultIcon = result.icon;

  function chooseAnswer(questionId: QuestionId, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setError("");
    setStage((current) => Math.min(current + 1, STAGE_COUNT));
  }

  function goBack() {
    setError("");
    setStage((current) => Math.max(0, current - 1));
  }

  function submitName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!normalizeName(name)) {
      setError("Add your name to personalize the sales map.");
      return;
    }
    setError("");
    setStage(3);
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = normalizeName(name);
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email to unlock your sales angle.");
      return;
    }

    if (!leadTrackedRef.current && !leadTracked) {
      leadTrackedRef.current = true;
      const eventId = trackLeadEvent(
        {
          content_name: "ai_model_sales_quiz",
          content_category: "sales_quiz",
          quiz_result: result.key,
          quiz_operation: answers.operation,
          quiz_bottleneck: answers.bottleneck,
          quiz_scale: answers.scale,
          status: true,
        },
        {
          name: normalizedName,
          email: normalizedEmail,
        },
      );
      void captureMarketingLead({
        name: normalizedName,
        email: normalizedEmail,
        source: "sales_quiz",
        quizResult: result.key,
        quizAnswers: answers,
        eventId,
      });
      setLeadTracked(true);
    }

    setError("");
    setStage(5);
  }

  return (
    <section
      id="ai-model-sales-quiz"
      className="relative min-h-screen overflow-hidden bg-[#101214] px-4 py-5 sm:px-8 sm:py-10 lg:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225,29,42,0.13) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-5 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-10">
        <div className="pt-3 lg:pt-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-landing-accent/20 bg-landing-accent/[0.08] px-3 py-1 text-[10px] font-black uppercase text-landing-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Built for model operators
          </span>

          <h1 className="mt-4 max-w-xl font-sora text-[31px] font-extrabold leading-[1.04] text-landing-text sm:text-[52px] lg:text-[64px]">
            Find the first AI model offer worth selling.
          </h1>

          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-landing-text-secondary sm:text-[17px]">
            For creators, OFM teams and agencies who need one AI model offer to sell before they scale production.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {["3 questions", "No checkbox", "7-day launch map"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#f3f0ed]/[0.07] bg-[#f3f0ed]/[0.035] px-3 py-1.5 text-[11px] font-bold text-[#f3f0ed]/70"
              >
                <Check className="h-3 w-3 text-landing-accent" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:grid sm:max-w-xl sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:mt-7">
            {ASPIRATIONAL_PROOF.map((item) => (
              <div
                key={item.label}
                className="min-w-[210px] rounded-lg border border-[#f3f0ed]/[0.07] bg-[#f3f0ed]/[0.035] p-3 sm:min-w-0"
              >
                <p className="text-[10px] font-black uppercase text-landing-accent">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-[#f3f0ed]/65">
                  “{item.quote}”
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#f3f0ed]/[0.08] bg-[#171a1d] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-4">
          <div className="rounded-xl border border-[#f3f0ed]/[0.06] bg-[#0d0f11] p-4 sm:p-6">
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#f3f0ed]/[0.06]">
              <div
                className="h-full rounded-full bg-landing-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {currentQuestion && (
              <div className="min-h-[390px]">
                {stage > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="mb-5 inline-flex min-h-9 items-center gap-1.5 text-[12px] font-bold text-[#f3f0ed]/45 transition-colors hover:text-[#f3f0ed]/75"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                )}

                <p className="text-[12px] font-black uppercase text-landing-accent">
                  {currentQuestion.eyebrow}
                </p>
                <h2 className="mt-2 font-sora text-[24px] font-bold leading-tight text-landing-text sm:text-[32px]">
                  {currentQuestion.title}
                </h2>

                <div className="mt-5 space-y-2.5">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => chooseAnswer(currentQuestion.id, option.value)}
                      className="group min-h-[64px] w-full rounded-lg border border-[#f3f0ed]/[0.08] bg-[#f3f0ed]/[0.035] p-3.5 text-left transition-all duration-200 hover:border-landing-accent/35 hover:bg-landing-accent/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent sm:p-4"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-[14px] font-black text-landing-text sm:text-[15px]">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-[12px] leading-relaxed text-landing-text-secondary sm:text-[13px]">
                            {option.helper}
                          </span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-landing-accent opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage === 2 && (
              <form onSubmit={submitName} className="min-h-[390px]">
                <button
                  type="button"
                  onClick={goBack}
                  className="mb-5 inline-flex min-h-9 items-center gap-1.5 text-[12px] font-bold text-[#f3f0ed]/45 transition-colors hover:text-[#f3f0ed]/75"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back
                </button>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-landing-accent/[0.12] text-landing-accent">
                  <User className="h-5 w-5" />
                </div>
                <p className="mt-5 text-[12px] font-black uppercase text-landing-accent">
                  Sales map loading
                </p>
                <h2 className="mt-2 font-sora text-[24px] font-bold leading-tight text-landing-text sm:text-[32px]">
                  Who is this offer map for?
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-landing-text-secondary sm:text-[14px]">
                  One more question after this. Then you get the angle to test first.
                </p>

                <label
                  htmlFor="quiz-lead-name"
                  className="mt-6 grid gap-2 text-[12px] font-bold text-[#f3f0ed]/55"
                >
                  Name
                  <input
                    id="quiz-lead-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-12 rounded-lg border border-[#f3f0ed]/[0.08] bg-[#f3f0ed]/[0.04] px-4 text-[14px] text-landing-text outline-none transition-colors placeholder:text-[#f3f0ed]/25 focus:border-landing-accent/45"
                    placeholder="Alex"
                    autoComplete="given-name"
                  />
                </label>

                {error && (
                  <p role="alert" className="mt-3 rounded-lg border border-red-400/15 bg-red-400/[0.08] px-3 py-2 text-[12px] font-bold text-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="landing-btn mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-landing-accent px-6 py-3.5 text-[14px] font-black text-[#101214]"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {stage === 4 && (
              <form onSubmit={submitEmail} className="min-h-[390px]">
                <button
                  type="button"
                  onClick={goBack}
                  className="mb-5 inline-flex min-h-9 items-center gap-1.5 text-[12px] font-bold text-[#f3f0ed]/45 transition-colors hover:text-[#f3f0ed]/75"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back
                </button>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-landing-accent/[0.12] text-landing-accent">
                  <Mail className="h-5 w-5" />
                </div>
                <p className="mt-5 text-[12px] font-black uppercase text-landing-accent">
                  {displayName(name)}, your angle is ready
                </p>
                <h2 className="mt-2 font-sora text-[24px] font-bold leading-tight text-landing-text sm:text-[32px]">
                  Unlock the sales map.
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-landing-text-secondary sm:text-[14px]">
                  The next screen shows the offer, proof angle and monthly production plan to run first.
                </p>

                <label
                  htmlFor="quiz-lead-email"
                  className="mt-6 grid gap-2 text-[12px] font-bold text-[#f3f0ed]/55"
                >
                  Email
                  <input
                    id="quiz-lead-email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-lg border border-[#f3f0ed]/[0.08] bg-[#f3f0ed]/[0.04] px-4 text-[14px] text-landing-text outline-none transition-colors placeholder:text-[#f3f0ed]/25 focus:border-landing-accent/45"
                    placeholder="alex@agency.com"
                    inputMode="email"
                    autoComplete="email"
                  />
                </label>

                {error && (
                  <p role="alert" className="mt-3 rounded-lg border border-red-400/15 bg-red-400/[0.08] px-3 py-2 text-[12px] font-bold text-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="landing-btn mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-landing-accent px-6 py-3.5 text-[14px] font-black text-[#101214]"
                >
                  Show my sales angle
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {stage >= 5 && (
              <div className="min-h-[390px]" aria-live="polite">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-landing-accent text-[#101214]">
                    <ResultIcon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-landing-accent/20 bg-landing-accent/[0.08] px-3 py-1 text-[10px] font-black uppercase text-landing-accent">
                    {result.badge}
                  </span>
                </div>

                <h2 className="mt-5 font-sora text-[24px] font-bold leading-tight text-landing-text sm:text-[32px]">
                  {result.headline}
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-landing-text-secondary">
                  {result.mirror}
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {result.bullets.map((bullet) => (
                    <span
                      key={bullet}
                      className="rounded-lg border border-[#f3f0ed]/[0.07] bg-[#f3f0ed]/[0.035] px-3 py-2 text-[12px] font-black text-[#f3f0ed]/75"
                    >
                      {bullet}
                    </span>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  <ResultBlock title="Offer to sell" body={result.offer} />
                  <ResultBlock title="Proof angle" body={result.proof} />
                  <ResultBlock title="Monthly production plan" body={result.productionPlan} />
                  <ResultBlock title="First 7 days" body={result.firstWeek} />
                  <ResultBlock title="Plan fit" body={result.planHint} />
                </div>

                <div className="mt-5 rounded-lg border border-landing-accent/20 bg-landing-accent/[0.07] p-3.5">
                  <p className="text-[10px] font-black uppercase text-landing-accent">
                    What you should be able to pitch
                  </p>
                  <p className="mt-1 text-[13px] font-semibold leading-relaxed text-[#f3f0ed]/80">
                    “We can launch a believable AI model, feed it for 7 days, and know which angle is worth selling before building the full operation.”
                  </p>
                </div>

                <a
                  href="#precos"
                  onClick={() =>
                    trackViewContent({
                      content_name: "sales_quiz_result_pricing_click",
                      content_category: "sales_quiz",
                      quiz_result: result.key,
                    })
                  }
                  className="landing-btn mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-landing-accent px-6 py-3.5 text-[14px] font-black text-[#101214] sm:w-auto"
                >
                  See monthly plans
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-[#f3f0ed]/[0.07] bg-[#f3f0ed]/[0.035] p-3.5">
      <div className="flex items-start gap-3">
        <LineChart className="mt-0.5 h-4 w-4 shrink-0 text-landing-accent" />
        <div>
          <p className="text-[11px] font-black uppercase text-landing-accent">{title}</p>
          <p className="mt-1 text-[13px] font-semibold leading-relaxed text-[#f3f0ed]/75">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
