"use client";

import { Instagram } from "lucide-react";
import Image from "next/image";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

const SOCIAL = [
  {
    Icon: Instagram,
    href: "https://www.instagram.com/theaimodelab.ai/",
    label: "Instagram",
  },
  {
    Icon: TikTokIcon,
    href: "https://www.tiktok.com/@theaimodelab.ia",
    label: "TikTok",
  },
];

const PRODUCT = [
  { label: "Features", href: "#funcionalidades" },
  { label: "How it works", href: "#como-funciona" },
  { label: "Pricing", href: "#precos" },
  { label: "FAQ", href: "#faq" },
];

const LEGAL = [
  { label: "Terms of Use", href: "/termos-de-uso" },
  { label: "Privacy Policy", href: "/politica-de-privacidade" },
];

export function InfluencerFooter() {
  return (
    <footer className="border-t border-[#f3f0ed]/[0.04] bg-landing-bg py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo-red-sem-fundo.png"
                alt="The AI Model Lab"
                width={130}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <span className="font-sora text-[17px] font-bold tracking-tight text-landing-text">
                The AI Model Lab
              </span>
            </div>
            <p className="mt-5 max-w-[300px] text-[14px] leading-relaxed text-landing-text-muted">
              Create your own AI influencer with a consistent face, photos,
              videos and voice — all powered by artificial intelligence.
            </p>

            <div className="mt-6 flex gap-2.5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="landing-ease flex h-9 w-9 items-center justify-center rounded-lg border border-[#f3f0ed]/[0.06] text-landing-text-muted transition-all duration-300 hover:border-landing-accent/20 hover:text-landing-accent"
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-[13px] font-semibold text-landing-text">
              Product
            </h4>
            <ul className="mt-4 space-y-3">
              {PRODUCT.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="landing-ease text-[13px] text-landing-text-muted transition-colors duration-300 hover:text-landing-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <h4 className="text-[13px] font-semibold text-landing-text">
              Legal
            </h4>
            <ul className="mt-4 space-y-3">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="landing-ease text-[13px] text-landing-text-muted transition-colors duration-300 hover:text-landing-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#f3f0ed]/[0.04] pt-6 text-center text-[13px] text-landing-text-muted sm:mt-14 sm:pt-8">
          © {new Date().getFullYear()} The AI Model Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
