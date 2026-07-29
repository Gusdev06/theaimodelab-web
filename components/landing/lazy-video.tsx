"use client";

import { useEffect, useRef, useState } from "react";

/* Monta o <video> apenas quando o card se aproxima do viewport e pausa fora
   dele — vídeos escondidos por CSS (display:none) nunca interceptam, então
   nunca baixam.

   iOS Safari: não dispara `loadeddata` com preload="metadata" e bloqueia
   play() programático em Modo de Baixo Consumo. Por isso o vídeo NÃO é
   escondido atrás de um gate de evento — o placeholder fica embaixo e o
   vídeo pinta por cima quando tiver frames — e o autoplay é feito pelo
   atributo nativo (muted + playsinline), não por play() via JS. */
export function LazyVideo({
  src,
  poster,
  overlay,
}: {
  src: string;
  poster?: string;
  overlay?: boolean;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "260px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = holderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div ref={holderRef} className="absolute inset-0">
      <div className="absolute inset-0 animate-pulse bg-[#f3f0ed]/[0.03]" />
      {mounted && (
        <video
          ref={(el) => {
            videoRef.current = el;
            // React não serializa `muted` como atributo — o iOS exige o
            // estado mudo presente antes do autoplay para liberá-lo.
            if (el) {
              el.muted = true;
              el.setAttribute("muted", "");
            }
          }}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 via-transparent to-transparent" />
      )}
    </div>
  );
}
