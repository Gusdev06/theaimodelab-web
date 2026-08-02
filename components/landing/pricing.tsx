"use client";

import { AlertTriangle, Check, Shield, Infinity as InfinityIcon } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useScrollReveal } from "./use-scroll-reveal";
import { useEffect, useState } from "react";
import { useLoginModal } from "@/lib/login-modal-context";
import { useAuth } from "@/lib/auth-context";
import { api, Plan } from "@/lib/api";
import { estimateGenerations, getPlanGenerationBuckets, PLAN_UNLIMITED_FEATURE_KEYS } from "@/lib/plans";
import { withCheckoutIdentity } from "@/lib/checkout";

// Monetização por assinatura mensal (PerfectPay). A landing lista os planos ativos
// (endpoint público GET /api/v1/plans) e o CTA redireciona para o checkout recorrente
// da PerfectPay (plan.checkoutUrl). Visitantes deslogados caem no modal de registro
// primeiro — a ativação da assinatura casa a compra pelo email da conta.
export function Pricing() {
  const t = useTranslations("pricing");
  const tUnlimited = useTranslations("editorPlans.unlimited");
  const tCategories = useTranslations("editorPlans.categories");
  const tEditorPlans = useTranslations("editorPlans");
  const locale = useLocale();
  // Moeda por locale: Brasil (/pt-br) cobra em BRL via Cakto; /en e /es em USD via
  // PerfectPay. O backend devolve o preço e o checkoutUrl da moeda pedida.
  const currency = locale === "pt-BR" ? "BRL" : "USD";
  const { ref, isVisible } = useScrollReveal();
  const { accessToken, user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    api.plans
      .listPublic(currency)
      .then((data) => {
        setPlans(data);
        setLoadFailed(false);
      })
      .catch(() => {
        setPlans([]);
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, [currency]);

  function handleSubscribe(plan: Plan) {
    if (!plan.checkoutUrl) return;
    if (!accessToken) {
      openLoginModal({ mode: "register" });
      return;
    }
    // Manda o email (e nome) da conta logada para o checkout da PerfectPay.
    window.location.href = withCheckoutIdentity(plan.checkoutUrl, {
      email: user?.email,
      name: user?.name,
    });
  }

  const formatPrice = (cents: number, cur: string) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: cur || "BRL",
      minimumFractionDigits: 2,
    }).format(cents / 100);

  const formatCredits = (n: number) => new Intl.NumberFormat(locale).format(n);

  const badges = [
    t("badges.noCancelFee"),
    t("badges.securePayment"),
    t("badges.creditsRenew"),
  ];

  return (
    <section id="precos" className="relative py-16 sm:py-28 lg:py-36">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(225,29,42,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div
          ref={ref}
          className="landing-reveal mx-auto max-w-2xl text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-accent">
            {t("tag")}
          </span>
          <h2 className="mt-4 font-sora text-[26px] font-bold tracking-tight text-landing-text sm:mt-5 sm:text-3xl lg:text-[44px]">
            {t("title")}
          </h2>
          <p className="mt-3.5 text-[15px] leading-relaxed text-landing-text-secondary sm:mt-5 sm:text-[17px]">
            {t("subtitle")}
          </p>
        </div>

        {/* Plans grid */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-[20px] border border-[#f3f0ed]/[0.06] bg-[#16161a] p-6"
              >
                <div className="h-5 w-24 animate-pulse rounded-md bg-[#f3f0ed]/[0.06]" />
                <div className="mt-4 h-9 w-32 animate-pulse rounded-md bg-[#f3f0ed]/[0.08]" />
                <div className="mt-5 h-4 w-40 animate-pulse rounded-md bg-[#f3f0ed]/[0.05]" />
                <div className="mt-4 space-y-2.5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-3.5 w-full animate-pulse rounded-md bg-[#f3f0ed]/[0.04]"
                    />
                  ))}
                </div>
                <div className="mt-8 h-11 w-full animate-pulse rounded-full bg-[#f3f0ed]/[0.06]" />
              </div>
            ))}
          </div>
        ) : plans.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {plans.map((plan) => {
              const highlighted = plan.slug === "pro";
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-[20px] border bg-[#16161a] p-6 transition-all duration-300 ${
                    highlighted
                      ? "border-landing-accent/40 shadow-[0_0_60px_rgba(225,29,42,0.1)] lg:-translate-y-2"
                      : "border-[#f3f0ed]/[0.06] hover:border-[#f3f0ed]/[0.12]"
                  }`}
                >
                  {highlighted && (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-landing-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-landing-accent">
                      {t("mostPopular")}
                    </span>
                  )}
                  <h3 className="font-sora text-lg font-bold text-landing-text">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-sora text-3xl font-bold text-landing-text">
                      {formatPrice(plan.priceCents, plan.currency)}
                    </span>
                    <span className="text-[13px] text-[#f3f0ed]/40">{t("perMonth")}</span>
                  </div>
                  <p className="mt-4 text-[13px] font-semibold text-landing-text">
                    {t("creditsPerMonth", { credits: formatCredits(plan.creditsPerMonth) })}
                  </p>
                  {(() => {
                    const est = estimateGenerations(plan.creditsPerMonth);
                    if (est.images <= 0 && est.videos <= 0) return null;
                    return (
                      <p className="mt-1 text-[12px] text-[#f3f0ed]/40">
                        {tEditorPlans("estimatePlan", { images: est.images, videos: est.videos })}
                      </p>
                    );
                  })()}
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f3f0ed]/35">
                    {t("generationEstimate")}
                  </p>
                  <ul className="mt-2.5 space-y-1.5 text-[13px] text-[#f3f0ed]/55">
                    {getPlanGenerationBuckets(plan.creditsPerMonth).map((b) => (
                      <li key={b.key} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 text-landing-accent/70" />
                        <span>
                          <span className="font-semibold text-landing-text">
                            {formatCredits(b.countNumber)}
                          </span>{" "}
                          {tCategories(b.key)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {(PLAN_UNLIMITED_FEATURE_KEYS[plan.slug]?.length ?? 0) > 0 && (
                    <div className="mt-4 rounded-2xl border border-landing-accent/20 bg-landing-accent/[0.05] p-3.5">
                      <div className="flex items-center gap-2">
                        <InfinityIcon className="h-4 w-4 shrink-0 text-landing-accent" />
                        <span className="text-[13px] font-semibold text-landing-text">
                          {t("unlimitedTitle")}
                        </span>
                        <span className="ml-auto rounded-full bg-landing-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-landing-accent">
                          {t("unlimitedBadge")}
                        </span>
                      </div>
                      <ul className="mt-2.5 space-y-1.5 text-[13px] text-[#f3f0ed]/55">
                        {(PLAN_UNLIMITED_FEATURE_KEYS[plan.slug] ?? []).map((key) => (
                          <li key={key} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 shrink-0 text-landing-accent/70" />
                            <span>{tUnlimited(`features.${key}`)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => handleSubscribe(plan)}
                    disabled={!plan.checkoutUrl}
                    className={`mt-6 w-full rounded-full px-4 py-3 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      highlighted
                        ? "bg-landing-accent text-white hover:bg-landing-accent/90"
                        : "border border-[#f3f0ed]/[0.12] text-landing-text hover:bg-[#f3f0ed]/[0.04]"
                    }`}
                  >
                    {t("subscribe", { plan: plan.name })}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#f3f0ed]/[0.07] bg-[#16161a] p-5 text-center sm:mt-16 sm:p-7">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-landing-accent/15 bg-landing-accent/[0.08] text-landing-accent">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-sora text-[18px] font-bold text-landing-text">
              {loadFailed ? "Plans are taking longer to load." : "Plans are being prepared."}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-landing-text-secondary">
              Create your account now and choose your monthly plan inside the platform.
            </p>
            <button
              type="button"
              onClick={() => openLoginModal({ mode: "register" })}
              className="landing-btn mt-5 inline-flex min-h-11 items-center justify-center bg-landing-accent px-5 text-[13px] font-black text-[#111113]"
            >
              Create account
            </button>
          </div>
        )}

        {/* Guarantee */}
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20">
          <div className="rounded-[20px] border border-[#f3f0ed]/[0.05] bg-[#16161a] p-5 text-center sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-landing-accent/15 bg-landing-accent/[0.06]">
              <Shield className="h-5 w-5 text-landing-accent" />
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[#f3f0ed]/50">
              {t("guaranteeText")}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:mt-7 sm:gap-x-6 sm:gap-y-2.5">
              {badges.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-2 text-[12px] text-[#f3f0ed]/35"
                >
                  <Check className="h-3 w-3 text-landing-accent/60" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
