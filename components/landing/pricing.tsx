"use client";

import { AlertTriangle, Check, Shield, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useScrollReveal } from "./use-scroll-reveal";
import { useEffect, useState } from "react";
import { useLoginModal } from "@/lib/login-modal-context";
import { api, CreditPackage } from "@/lib/api";
import { CreditPackagesGrid } from "@/components/editor/CreditPackagesGrid";

// Assinaturas descontinuadas: a landing exibe os pacotes de crédito avulsos
// (endpoint público GET /credits/packages/public). Usuários deslogados que
// clicam em comprar caem no modal de registro.
export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const currency = locale === 'pt-BR' ? 'BRL' : 'USD';
  const { ref, isVisible } = useScrollReveal();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    api.credits
      .packagesPublic(currency)
      .then((data) => {
        setPackages(data);
        setLoadFailed(false);
      })
      .catch(() => {
        setPackages([]);
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, [currency]);

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

        {/* Packages grid */}
        {loading ? (
          <div className="mt-16 flex justify-center lg:mt-20">
            <Loader2 className="h-6 w-6 animate-spin text-landing-accent" />
          </div>
        ) : packages.length > 0 ? (
          <div className="mt-10 sm:mt-16 lg:mt-20">
            <CreditPackagesGrid
              packages={packages}
              currency={currency}
              onUnauthenticated={() => openLoginModal({ mode: "register" })}
            />
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#f3f0ed]/[0.07] bg-[#16161a] p-5 text-center sm:mt-16 sm:p-7">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-landing-accent/15 bg-landing-accent/[0.08] text-landing-accent">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-sora text-[18px] font-bold text-landing-text">
              {loadFailed ? "Credit packs are taking longer to load." : "Credit packs are being prepared."}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-landing-text-secondary">
              Create your account now and pick the right credit pack inside the platform.
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
