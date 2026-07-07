"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  DollarSign,
  Gauge,
  Layers,
  LineChart,
  Mail,
  Sparkles,
  Target,
  Video,
  type LucideIcon,
} from "lucide-react";
import { trackLeadEvent, trackViewContent } from "@/lib/tracking";

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

type ResultKey = "consistency" | "volume" | "margin" | "agency";

type QuizResult = {
  key: ResultKey;
  icon: LucideIcon;
  label: string;
  title: string;
  summary: string;
  opportunities: string[];
  nextMove: string;
};

const QUESTIONS: QuizQuestion[] = [
  {
    id: "operation",
    eyebrow: "1/3 · Operation",
    title: "What are you trying to build right now?",
    options: [
      {
        value: "solo",
        label: "My first AI model",
        helper: "Validate one persona and learn what converts.",
      },
      {
        value: "operator",
        label: "A small OFM operation",
        helper: "Feed multiple accounts without hiring more creators.",
      },
      {
        value: "agency",
        label: "An agency-scale machine",
        helper: "Launch and manage many personas with repeatable production.",
      },
    ],
  },
  {
    id: "bottleneck",
    eyebrow: "2/3 · Bottleneck",
    title: "What is the biggest thing slowing revenue down?",
    options: [
      {
        value: "consistency",
        label: "The same face is hard to keep",
        helper: "Subscribers need to recognize the model every time.",
      },
      {
        value: "volume",
        label: "Not enough daily content",
        helper: "Accounts need fresh photos, motion and short clips.",
      },
      {
        value: "margin",
        label: "Too many paid tools",
        helper: "The stack gets expensive before the account proves itself.",
      },
      {
        value: "launch",
        label: "I need to launch faster",
        helper: "Go from idea to a testable persona without a long setup.",
      },
    ],
  },
  {
    id: "scale",
    eyebrow: "3/3 · Scale",
    title: "What would make the next 30 days a win?",
    options: [
      {
        value: "validate",
        label: "Validate one model",
        helper: "Find a look, niche and first content angle.",
      },
      {
        value: "three-five",
        label: "Run 3-5 models",
        helper: "Build a small portfolio and see what earns attention.",
      },
      {
        value: "six-fifteen",
        label: "Scale 6-15 accounts",
        helper: "Turn content production into an operating system.",
      },
      {
        value: "sixteen-plus",
        label: "Build the agency machine",
        helper: "Standardize personas, prompts, video and publishing flow.",
      },
    ],
  },
];

const RESULTS: Record<ResultKey, QuizResult> = {
  consistency: {
    key: "consistency",
    icon: Target,
    label: "Identity Opportunity",
    title: "Your fastest win is a recognizable AI model.",
    summary:
      "Start by locking one face, one visual universe and a repeatable prompt system before you spend credits on volume.",
    opportunities: [
      "Create a model identity subscribers can recognize.",
      "Turn winning prompts into reusable production templates.",
      "Stop wasting generations on faces that drift.",
    ],
    nextMove: "Buy enough credits to test face, image and video consistency in one sprint.",
  },
  volume: {
    key: "volume",
    icon: Video,
    label: "Content Volume Opportunity",
    title: "Your biggest upside is a daily content engine.",
    summary:
      "You do not need more photoshoots. You need a repeatable flow for images, motion and short clips across every account.",
    opportunities: [
      "Fill daily feeds without waiting on real creators.",
      "Repurpose one model into photo, video and motion angles.",
      "Keep accounts active while your team stays lean.",
    ],
    nextMove: "Start with a credit pack that lets you produce multiple angles per model.",
  },
  margin: {
    key: "margin",
    icon: DollarSign,
    label: "Margin Opportunity",
    title: "Your opportunity is replacing a bloated tool stack.",
    summary:
      "The money leak is usually not one generation. It is paying for separate tools before the persona has proven revenue.",
    opportunities: [
      "Replace fragmented image, video, motion and upscale tools.",
      "Test more concepts before committing to a large account build.",
      "Protect margin while you validate what actually sells.",
    ],
    nextMove: "Use one platform first, then scale spend only on models that show traction.",
  },
  agency: {
    key: "agency",
    icon: Layers,
    label: "Agency Scale Opportunity",
    title: "You are ready for a repeatable model factory.",
    summary:
      "The opportunity is no longer one model. It is a system for creating, testing and feeding many personas without adding headcount.",
    opportunities: [
      "Launch multiple personas from one production workflow.",
      "Separate creative testing from account management.",
      "Standardize prompts, motion and export quality for the team.",
    ],
    nextMove: "Buy credits for a multi-model test and benchmark cost per usable asset.",
  },
};

function getResult(answers: Answers): QuizResult {
  if (answers.scale === "sixteen-plus" || answers.operation === "agency") {
    return RESULTS.agency;
  }

  if (answers.bottleneck === "consistency") return RESULTS.consistency;
  if (answers.bottleneck === "margin") return RESULTS.margin;
  return RESULTS.volume;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function SalesQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [leadTracked, setLeadTracked] = useState(false);

  const currentQuestion = QUESTIONS[step];
  const result = useMemo(() => getResult(answers), [answers]);
  const ResultIcon = result.icon;
  const isCaptureStep = started && step === QUESTIONS.length;
  const isResultStep = started && step > QUESTIONS.length;
  const progress = started
    ? Math.min(((step + 1) / (QUESTIONS.length + 1)) * 100, 100)
    : 0;

  function startQuiz() {
    setStarted(true);
    setStep(0);
    trackViewContent({
      content_name: "ai_opportunity_quiz",
      content_category: "sales_quiz",
      quiz_stage: "start",
    });
  }

  function chooseAnswer(questionId: QuestionId, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setStep((current) => Math.min(current + 1, QUESTIONS.length));
  }

  function goBack() {
    setError("");
    if (!started) return;
    if (step === 0) {
      setStarted(false);
      return;
    }
    setStep((current) => Math.max(0, current - 1));
  }

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = normalizeName(name);
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setError("Enter your name to unlock the opportunity map.");
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email to unlock the opportunity map.");
      return;
    }

    setError("");

    if (!leadTracked) {
      trackLeadEvent(
        {
          content_name: "ai_opportunity_quiz",
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
      setLeadTracked(true);
    }

    setStep(QUESTIONS.length + 1);
  }

  return (
    <section
      id="ai-opportunity-quiz"
      className="relative overflow-hidden bg-[#101214] py-14 sm:py-24 lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(225,29,42,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-landing-accent/20 bg-landing-accent/[0.08] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-landing-accent">
            <Sparkles className="h-3.5 w-3.5" />
            AI Revenue Diagnostic
          </span>
          <h2 className="mt-5 max-w-xl font-sora text-[28px] font-bold leading-[1.08] text-landing-text sm:text-[42px] lg:text-[52px]">
            Find the AI model opportunity you should monetize first.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-landing-text-secondary sm:text-[17px]">
            Answer 3 quick questions and get a sales-focused action map for your Fanvue or OFM operation.
          </p>

          <div className="mt-6 grid max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
            {[
              "No generic form",
              "Built for selling",
              "Result in 60 sec",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg border border-[#f3f0ed]/[0.07] bg-[#f3f0ed]/[0.03] px-3 py-2 text-[12px] font-semibold text-[#f3f0ed]/70"
              >
                <Check className="h-3.5 w-3.5 text-landing-accent" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#f3f0ed]/[0.08] bg-[#171a1d] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-4">
          <div className="rounded-xl border border-[#f3f0ed]/[0.06] bg-[#0d0f11] p-4 sm:p-6">
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#f3f0ed]/[0.06]">
              <div
                className="h-full rounded-full bg-landing-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {!started && (
              <div className="min-h-[420px] content-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-landing-accent text-[#101214]">
                  <Gauge className="h-6 w-6" />
                </div>
                <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.18em] text-landing-accent">
                  Opportunity score
                </p>
                <h3 className="mt-3 font-sora text-[26px] font-bold leading-tight text-landing-text sm:text-[34px]">
                  See where The AI Model Lab can create leverage in your operation.
                </h3>
                <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-landing-text-secondary sm:text-[15px]">
                  The result points to the first production opportunity worth testing with credits.
                </p>
                <button
                  type="button"
                  onClick={startQuiz}
                  className="landing-btn mt-8 inline-flex w-full items-center justify-center gap-2 bg-landing-accent px-6 py-4 text-[14px] font-bold text-[#101214] sm:w-auto"
                >
                  Start diagnostic
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {started && currentQuestion && step < QUESTIONS.length && (
              <div className="min-h-[420px]">
                <button
                  type="button"
                  onClick={goBack}
                  className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#f3f0ed]/45 transition-colors hover:text-[#f3f0ed]/75"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-landing-accent">
                  {currentQuestion.eyebrow}
                </p>
                <h3 className="mt-3 font-sora text-[24px] font-bold leading-tight text-landing-text sm:text-[32px]">
                  {currentQuestion.title}
                </h3>

                <div className="mt-7 space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => chooseAnswer(currentQuestion.id, option.value)}
                      className="group w-full rounded-lg border border-[#f3f0ed]/[0.08] bg-[#f3f0ed]/[0.035] p-4 text-left transition-all duration-200 hover:border-landing-accent/35 hover:bg-landing-accent/[0.06]"
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span>
                          <span className="block text-[15px] font-bold text-landing-text">
                            {option.label}
                          </span>
                          <span className="mt-1.5 block text-[13px] leading-relaxed text-landing-text-secondary">
                            {option.helper}
                          </span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-landing-accent opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isCaptureStep && (
              <form onSubmit={submitLead} className="min-h-[420px]">
                <button
                  type="button"
                  onClick={goBack}
                  className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#f3f0ed]/45 transition-colors hover:text-[#f3f0ed]/75"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-landing-accent/[0.12] text-landing-accent">
                  <Mail className="h-5 w-5" />
                </div>
                <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.18em] text-landing-accent">
                  Your opportunity map is ready
                </p>
                <h3 className="mt-3 font-sora text-[24px] font-bold leading-tight text-landing-text sm:text-[32px]">
                  Where should we attach the result?
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-landing-text-secondary">
                  Unlock the diagnosis and see what to test first inside The AI Model Lab.
                </p>

                <div className="mt-7 grid gap-3">
                  <label className="grid gap-2 text-[12px] font-semibold text-[#f3f0ed]/55">
                    Name
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="h-12 rounded-lg border border-[#f3f0ed]/[0.08] bg-[#f3f0ed]/[0.04] px-4 text-[14px] text-landing-text outline-none transition-colors placeholder:text-[#f3f0ed]/25 focus:border-landing-accent/45"
                      placeholder="Alex"
                    />
                  </label>
                  <label className="grid gap-2 text-[12px] font-semibold text-[#f3f0ed]/55">
                    Email
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 rounded-lg border border-[#f3f0ed]/[0.08] bg-[#f3f0ed]/[0.04] px-4 text-[14px] text-landing-text outline-none transition-colors placeholder:text-[#f3f0ed]/25 focus:border-landing-accent/45"
                      placeholder="alex@agency.com"
                      inputMode="email"
                    />
                  </label>
                </div>

                {error && (
                  <p className="mt-3 rounded-lg border border-red-400/15 bg-red-400/[0.08] px-3 py-2 text-[12px] font-semibold text-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="landing-btn mt-6 inline-flex w-full items-center justify-center gap-2 bg-landing-accent px-6 py-4 text-[14px] font-bold text-[#101214]"
                >
                  Show my opportunity
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {isResultStep && (
              <div className="min-h-[420px]">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-landing-accent text-[#101214]">
                    <ResultIcon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-landing-accent/20 bg-landing-accent/[0.08] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-landing-accent">
                    {result.label}
                  </span>
                </div>

                <h3 className="mt-5 font-sora text-[24px] font-bold leading-tight text-landing-text sm:text-[32px]">
                  {result.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-landing-text-secondary sm:text-[15px]">
                  {result.summary}
                </p>

                <div className="mt-6 grid gap-2.5">
                  {result.opportunities.map((opportunity) => (
                    <div
                      key={opportunity}
                      className="flex items-start gap-3 rounded-lg border border-[#f3f0ed]/[0.07] bg-[#f3f0ed]/[0.035] px-3.5 py-3 text-[13px] font-semibold leading-relaxed text-[#f3f0ed]/75"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-landing-accent" />
                      {opportunity}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-landing-accent/15 bg-landing-accent/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <LineChart className="mt-0.5 h-4 w-4 shrink-0 text-landing-accent" />
                    <p className="text-[13px] font-semibold leading-relaxed text-[#f3f0ed]/75">
                      {result.nextMove}
                    </p>
                  </div>
                </div>

                <a
                  href="#precos"
                  onClick={() =>
                    trackViewContent({
                      content_name: "quiz_result_pricing_click",
                      content_category: "sales_quiz",
                      quiz_result: result.key,
                    })
                  }
                  className="landing-btn mt-6 inline-flex w-full items-center justify-center gap-2 bg-landing-accent px-6 py-4 text-[14px] font-bold text-[#101214] sm:w-auto"
                >
                  See credit packs
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
