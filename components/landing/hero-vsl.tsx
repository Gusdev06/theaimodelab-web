"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/* VSL do hero (VTurb) — exibida apenas no locale /en. O título é hardcoded em
   inglês porque o componente só renderiza nesse locale. */
const SCRIPT_SRC =
  "https://scripts.converteai.net/8961d838-aff2-4dce-9b39-e84022d332ce/players/6a57dd7dc427d2c7a7d1281e/v4/player.js";

const PLAYER_HTML = `<vturb-smartplayer id="vid-6a57dd7dc427d2c7a7d1281e" style="display: block; margin: 0 auto; width: 100%;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 65.0994575045208% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer>`;

export function HeroVsl() {
  const locale = useLocale();
  const isEnglish = locale === "en";

  useEffect(() => {
    if (!isEnglish) return;
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, [isEnglish]);

  if (!isEnglish) return null;

  return (
    <div
      className="landing-reveal mt-7 w-full max-w-[560px] sm:mt-8"
      style={{ animationDelay: "0.12s" }}
    >
      <p className="mb-3 text-center text-[14px] font-semibold tracking-wide text-landing-accent sm:text-[15px] lg:text-left">
        How to create completely uncensored images
      </p>
      <div
        className="overflow-hidden rounded-2xl border border-[#f3f0ed]/[0.08] bg-black shadow-2xl"
        dangerouslySetInnerHTML={{ __html: PLAYER_HTML }}
      />
    </div>
  );
}
