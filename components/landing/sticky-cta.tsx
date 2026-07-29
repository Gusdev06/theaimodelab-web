"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { useLoginModal } from "@/lib/login-modal-context";
import { cn } from "@/lib/utils";

/* Barra de CTA fixa no rodapé do mobile — aparece depois que o visitante
   passa do hero e some perto do fim da página (onde já existe o FinalCta). */
export function StickyCta() {
  const { user, loading } = useAuth();
  const { openLoginModal } = useLoginModal();
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const nearBottom =
        window.innerHeight + scrolled >
        document.documentElement.scrollHeight - 900;
      setVisible(scrolled > 700 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return null;
  const isLoggedIn = !!user;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-300 sm:hidden",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="landing-glass flex items-center justify-between gap-3 rounded-2xl p-3 pl-4">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-landing-text">
            {t("microcopy")}
          </p>
          <p className="truncate text-[11px] text-landing-text-muted">
            {t("trust3")}
          </p>
        </div>
        {isLoggedIn ? (
          <a
            href="/home"
            className="landing-btn inline-flex shrink-0 items-center gap-1.5 bg-landing-accent px-4 py-2.5 text-[13px] font-bold text-landing-bg-secondary"
          >
            {tNav("accessPlatform")}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => openLoginModal({ mode: "register" })}
            className="landing-btn inline-flex shrink-0 items-center gap-1.5 bg-landing-accent px-4 py-2.5 text-[13px] font-bold text-landing-bg-secondary"
          >
            {t("cta")}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
